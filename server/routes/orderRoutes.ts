import { Router, Response } from 'express';
import { OrderRepository } from '../models/Order.js';
import { ProductRepository } from '../models/Product.js';
import { verifyToken, optionalAuth, verifyAdmin, AuthenticatedRequest } from '../middleware/auth.js';

export const orderRouter = Router();

// Create new order (supports both authenticated customers and guest checkout)
orderRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      items,
      paymentMethod,
      discountCode,
    } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Please provide complete customer details, delivery address, and at least one item.' });
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      res.status(400).json({ success: false, message: 'Please provide full street, city, state, and postal code for delivery.' });
      return;
    }

    // Verify items and calculate subtotal securely on server side
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await ProductRepository.findByIdOrSlug(item.productId);
      if (!product) {
        res.status(400).json({ success: false, message: `Product "${item.name || item.productId}" is no longer available.` });
        return;
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += product.price * qty;

      validatedItems.push({
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
      });

      // Deduct stock if available
      const remainingStock = Math.max(0, (product.stock || 0) - qty);
      await ProductRepository.update(product._id || product.id, { stock: remainingStock });
    }

    // Free shipping over $150
    const shippingFee = calculatedSubtotal >= 150 ? 0 : 15;
    const tax = Math.round(calculatedSubtotal * 0.08 * 100) / 100; // 8% sales tax

    // Optional coupon discount
    let discount = 0;
    if (discountCode && discountCode.toUpperCase() === 'WELCOME10') {
      discount = Math.round(calculatedSubtotal * 0.1 * 100) / 100; // 10% off
    } else if (discountCode && discountCode.toUpperCase() === 'AURA20') {
      discount = Math.round(calculatedSubtotal * 0.2 * 100) / 100; // 20% off
    }

    const total = Math.max(0, Math.round((calculatedSubtotal + tax + shippingFee - discount) * 100) / 100);

    const newOrder = await OrderRepository.create({
      userId: req.user?.userId || undefined,
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      phone: phone || '',
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country?.trim() || 'United States',
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      tax,
      shippingFee,
      discount,
      total,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'processing',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Error placing order:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to process order.' });
  }
});

// Get authenticated user's order history
orderRouter.get('/my-orders', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }
    const orders = await OrderRepository.findByUserId(req.user.userId);
    res.json({ success: true, count: orders.length, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve order history.' });
  }
});

// Get single order by id or orderNumber
orderRouter.get('/:idOrNumber', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const order = await OrderRepository.findByIdOrNumber(req.params.idOrNumber);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve order.' });
  }
});

// Admin: Get all orders
orderRouter.get('/', verifyToken, verifyAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await OrderRepository.findAll();
    res.json({ success: true, count: orders.length, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve orders.' });
  }
});

// Admin: Update order status
orderRouter.patch('/:id/status', verifyToken, verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status value.' });
      return;
    }
    const updated = await OrderRepository.updateStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }
    res.json({ success: true, message: `Order status updated to ${status}.`, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update order status.' });
  }
});
