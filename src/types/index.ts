export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt?: string;
}

export interface Product {
  _id: string;
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
  featured?: boolean;
  trending?: boolean;
  specs?: Record<string, string>;
  tags?: string[];
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  category?: string;
  stock?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'card' | 'cod' | 'upi';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface FilterState {
  category: string;
  search: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  featuredOnly: boolean;
  inStockOnly: boolean;
}
