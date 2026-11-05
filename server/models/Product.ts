import mongoose, { Schema, Document } from 'mongoose';
import { localStore, isUsingMongoose } from '../db.js';
import crypto from 'crypto';

export interface IProduct {
  _id?: any;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  additionalImages?: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  featured: boolean;
  trending: boolean;
  specs: Record<string, string>;
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    additionalImages: [{ type: String }],
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 10, min: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    specs: { type: Map, of: String, default: {} },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export const ProductRepository = {
  async findAll(filter: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    trending?: boolean;
    sort?: string;
  } = {}) {
    if (isUsingMongoose()) {
      const query: any = {};
      if (filter.category && filter.category !== 'all') {
        query.category = { $regex: new RegExp(`^${filter.category}$`, 'i') };
      }
      if (filter.search) {
        query.$or = [
          { name: { $regex: filter.search, $options: 'i' } },
          { description: { $regex: filter.search, $options: 'i' } },
          { tags: { $in: [new RegExp(filter.search, 'i')] } }
        ];
      }
      if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
        query.price = {};
        if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
        if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
      }
      if (filter.featured !== undefined) query.featured = filter.featured;
      if (filter.trending !== undefined) query.trending = filter.trending;

      let sortOptions: any = { createdAt: -1 };
      if (filter.sort === 'price-low') sortOptions = { price: 1 };
      if (filter.sort === 'price-high') sortOptions = { price: -1 };
      if (filter.sort === 'rating') sortOptions = { rating: -1 };
      if (filter.sort === 'popular') sortOptions = { reviewsCount: -1 };

      return await ProductModel.find(query).sort(sortOptions).lean();
    }

    // Local JSON store fallback
    let items = [...localStore.get('products')];

    if (filter.category && filter.category !== 'all') {
      items = items.filter(p => p.category?.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }
    if (filter.minPrice !== undefined) {
      items = items.filter(p => p.price >= (filter.minPrice || 0));
    }
    if (filter.maxPrice !== undefined) {
      items = items.filter(p => p.price <= (filter.maxPrice || Infinity));
    }
    if (filter.featured !== undefined) {
      items = items.filter(p => !!p.featured === filter.featured);
    }
    if (filter.trending !== undefined) {
      items = items.filter(p => !!p.trending === filter.trending);
    }

    if (filter.sort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (filter.sort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (filter.sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (filter.sort === 'popular') {
      items.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else {
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return items;
  },

  async findByIdOrSlug(idOrSlug: string) {
    if (isUsingMongoose()) {
      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        const byId = await ProductModel.findById(idOrSlug).lean();
        if (byId) return byId;
      }
      return await ProductModel.findOne({ slug: idOrSlug }).lean();
    }
    const products = localStore.get('products');
    return products.find(p => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async create(data: Partial<IProduct>) {
    const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${Date.now()}`);
    if (isUsingMongoose()) {
      const created = await ProductModel.create({ ...data, slug });
      return created.toObject();
    }
    const products = localStore.get('products');
    const newProduct = {
      _id: 'prd_' + crypto.randomBytes(8).toString('hex'),
      slug,
      rating: 5.0,
      reviewsCount: 1,
      stock: 15,
      featured: false,
      trending: false,
      specs: {},
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    products.push(newProduct);
    localStore.set('products', products);
    return newProduct;
  },

  async update(id: string, updates: Partial<IProduct>) {
    if (isUsingMongoose()) {
      return await ProductModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const products = localStore.get('products');
    const idx = products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
    localStore.set('products', products);
    return products[idx];
  },

  async delete(id: string) {
    if (isUsingMongoose()) {
      const res = await ProductModel.findByIdAndDelete(id).lean();
      return !!res;
    }
    const products = localStore.get('products');
    const filtered = products.filter(p => p._id !== id && p.id !== id);
    const deleted = filtered.length < products.length;
    localStore.set('products', filtered);
    return deleted;
  },

  async count() {
    if (isUsingMongoose()) {
      return await ProductModel.countDocuments();
    }
    return localStore.get('products').length;
  },

  async seedAll(items: any[]) {
    if (isUsingMongoose()) {
      await ProductModel.deleteMany({});
      return await ProductModel.insertMany(items);
    }
    localStore.set('products', items);
    return items;
  }
};
