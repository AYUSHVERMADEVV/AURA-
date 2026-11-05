import { Router, Request, Response } from 'express';
import { ProductRepository } from '../models/Product.js';
import { verifyToken, verifyAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { initialProducts } from '../seedData.js';

export const productRouter = Router();

// Get categories list with counts
productRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const products = await ProductRepository.findAll();
    const map: Record<string, number> = {};
    for (const p of products) {
      const cat = p.category || 'General';
      map[cat] = (map[cat] || 0) + 1;
    }
    const categories = Object.entries(map).map(([name, count]) => ({ name, count }));
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching categories.' });
  }
});

// List products with filtering, search, sorting
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      trending,
      sort,
    } = req.query;

    const filter: any = {};
    if (typeof category === 'string' && category.trim()) filter.category = category.trim();
    if (typeof search === 'string' && search.trim()) filter.search = search.trim();
    if (minPrice !== undefined && minPrice !== '') filter.minPrice = Number(minPrice);
    if (maxPrice !== undefined && maxPrice !== '') filter.maxPrice = Number(maxPrice);
    if (featured !== undefined) filter.featured = featured === 'true';
    if (trending !== undefined) filter.trending = trending === 'true';
    if (typeof sort === 'string') filter.sort = sort;

    const products = await ProductRepository.findAll(filter);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve products.' });
  }
});

// Get single product by id or slug
productRouter.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const product = await ProductRepository.findByIdOrSlug(req.params.idOrSlug);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve product.' });
  }
});

// Admin: Create product
productRouter.post('/', verifyToken, verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, price, originalPrice, category, image, stock, featured, trending, specs, tags } = req.body;

    if (!name || !description || price === undefined || !category || !image) {
      res.status(400).json({ success: false, message: 'Missing required product fields (name, description, price, category, image).' });
      return;
    }

    const created = await ProductRepository.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      image,
      stock: stock !== undefined ? Number(stock) : 10,
      featured: Boolean(featured),
      trending: Boolean(trending),
      specs: specs || {},
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({ success: true, message: 'Product created successfully.', product: created });
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create product.' });
  }
});

// Admin: Update product
productRouter.put('/:id', verifyToken, verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) updates.originalPrice = Number(updates.originalPrice);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const updated = await ProductRepository.update(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found to update.' });
      return;
    }

    res.json({ success: true, message: 'Product updated successfully.', product: updated });
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to update product.' });
  }
});

// Admin: Delete product
productRouter.delete('/:id', verifyToken, verifyAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await ProductRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, message: 'Product removed successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete product.' });
  }
});

// Seed / Reset products
productRouter.post('/seed/reset', verifyToken, verifyAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await ProductRepository.seedAll(initialProducts);
    res.json({ success: true, message: 'Products successfully reset to default catalog.', count: initialProducts.length });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to reset products.' });
  }
});
