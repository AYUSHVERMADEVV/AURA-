import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface DatabaseState {
  users: any[];
  products: any[];
  orders: any[];
}

class JsonDocumentStore {
  private data: DatabaseState = {
    users: [],
    products: [],
    orders: []
  };
  private isLoaded = false;

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.isLoaded = true;
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('Could not read local JSON database, initializing empty', err);
      this.data = { users: [], products: [], orders: [] };
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to local JSON database', err);
    }
  }

  public get<K extends keyof DatabaseState>(collection: K): DatabaseState[K] {
    if (!this.isLoaded) this.load();
    return this.data[collection];
  }

  public set<K extends keyof DatabaseState>(collection: K, items: DatabaseState[K]) {
    this.data[collection] = items;
    this.save();
  }
}

export const localStore = new JsonDocumentStore();

let isMongoConnected = false;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] MONGODB_URI not set. Using persistent local document store (server/data/db.json). Ready for production MongoDB Atlas when configured.');
    return;
  }

  try {
    console.log('[Database] Connecting to MongoDB at:', uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@'));
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isMongoConnected = true;
    console.log('[Database] Successfully connected to MongoDB.');
  } catch (err) {
    console.warn('[Database] MongoDB connection failed. Falling back to persistent local JSON store:', (err as Error).message);
    isMongoConnected = false;
  }
}

export function isUsingMongoose(): boolean {
  return isMongoConnected && mongoose.connection.readyState === 1;
}
