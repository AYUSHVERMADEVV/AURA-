import mongoose, { Schema, Document } from 'mongoose';
import { localStore, isUsingMongoose } from '../db.js';
import crypto from 'crypto';

export interface IUser {
  _id?: any;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    avatar: { type: String },
    phone: { type: String },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'United States' },
    },
  },
  { timestamps: true }
);

// Mongoose model instance
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Universal repository that seamlessly delegates to Mongoose or local store
export const UserRepository = {
  async findByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isUsingMongoose()) {
      return await UserModel.findOne({ email: cleanEmail }).lean();
    }
    const users = localStore.get('users');
    return users.find((u: any) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id: string) {
    if (isUsingMongoose()) {
      return await UserModel.findById(id).select('-password').lean();
    }
    const users = localStore.get('users');
    const user = users.find((u: any) => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async create(userData: Partial<IUser>) {
    if (isUsingMongoose()) {
      const created = await UserModel.create(userData);
      return created.toObject();
    }
    const users = localStore.get('users');
    const newUser = {
      _id: 'usr_' + crypto.randomBytes(8).toString('hex'),
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData,
    };
    users.push(newUser);
    localStore.set('users', users);
    return newUser;
  },

  async update(id: string, updates: Partial<IUser>) {
    if (isUsingMongoose()) {
      return await UserModel.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean();
    }
    const users = localStore.get('users');
    const index = users.findIndex((u: any) => u._id === id || u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    localStore.set('users', users);
    const { password, ...safeUser } = users[index];
    return safeUser;
  },

  async count() {
    if (isUsingMongoose()) {
      return await UserModel.countDocuments();
    }
    return localStore.get('users').length;
  }
};
