import mongoose, { Schema, Document } from 'mongoose';
import { localStore, isUsingMongoose } from '../db.js';
import crypto from 'crypto';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  _id?: any;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'cod' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    phone: { type: String },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'cod', 'upi'], default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'paid' },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export const OrderRepository = {
  async create(orderData: Partial<IOrder>) {
    const orderNumber = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
    if (isUsingMongoose()) {
      const created = await OrderModel.create({ ...orderData, orderNumber });
      return created.toObject();
    }
    const orders = localStore.get('orders');
    const newOrder = {
      _id: 'ord_' + crypto.randomBytes(8).toString('hex'),
      orderNumber,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData,
    };
    orders.unshift(newOrder);
    localStore.set('orders', orders);
    return newOrder;
  },

  async findByUserId(userId: string) {
    if (isUsingMongoose()) {
      return await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
    }
    const orders = localStore.get('orders');
    return orders.filter(o => o.userId === userId);
  },

  async findByIdOrNumber(idOrNum: string) {
    if (isUsingMongoose()) {
      if (mongoose.Types.ObjectId.isValid(idOrNum)) {
        const byId = await OrderModel.findById(idOrNum).lean();
        if (byId) return byId;
      }
      return await OrderModel.findOne({ orderNumber: idOrNum }).lean();
    }
    const orders = localStore.get('orders');
    return orders.find(o => o._id === idOrNum || o.id === idOrNum || o.orderNumber === idOrNum) || null;
  },

  async findAll() {
    if (isUsingMongoose()) {
      return await OrderModel.find().sort({ createdAt: -1 }).lean();
    }
    return localStore.get('orders');
  },

  async updateStatus(id: string, orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled') {
    if (isUsingMongoose()) {
      return await OrderModel.findByIdAndUpdate(id, { orderStatus }, { new: true }).lean();
    }
    const orders = localStore.get('orders');
    const idx = orders.findIndex(o => o._id === id || o.id === id || o.orderNumber === id);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], orderStatus, updatedAt: new Date().toISOString() };
    localStore.set('orders', orders);
    return orders[idx];
  }
};
