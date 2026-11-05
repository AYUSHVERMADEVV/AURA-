import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, isUsingMongoose } from './server/db.js';
import { authRouter } from './server/routes/authRoutes.js';
import { productRouter } from './server/routes/productRoutes.js';
import { orderRouter } from './server/routes/orderRoutes.js';
import { UserRepository } from './server/models/User.js';
import { ProductRepository } from './server/models/Product.js';
import { OrderRepository } from './server/models/Order.js';
import { initialProducts, getInitialSeedUsers } from './server/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve assets folder statically so generated product imagery is accessible
app.use('/src/assets', express.static(path.resolve(process.cwd(), 'src', 'assets')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// Health & System status endpoint
app.get('/api/status', async (_req: Request, res: Response) => {
  const userCount = await UserRepository.count();
  const productCount = await ProductRepository.count();
  const orders = await OrderRepository.findAll();

  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    stack: {
      frontend: 'React 19 + Tailwind CSS',
      backend: 'Node.js + Express.js',
      database: isUsingMongoose() ? 'MongoDB (Connected via Mongoose)' : 'MongoDB Store (Persistent Document Storage)',
      auth: 'JWT (HMAC SHA-256) + bcryptjs'
    },
    metrics: {
      totalProducts: productCount,
      totalUsers: userCount,
      totalOrders: orders.length,
    }
  });
});

async function seedDatabaseIfEmpty() {
  try {
    const userCount = await UserRepository.count();
    if (userCount === 0) {
      console.log('[Seed] Seeding demo users...');
      const seedUsers = await getInitialSeedUsers();
      for (const u of seedUsers) {
        await UserRepository.create(u);
      }
      console.log('[Seed] Demo users seeded (demo@aura.store / admin@aura.store).');
    }

    const prodCount = await ProductRepository.count();
    if (prodCount === 0) {
      console.log('[Seed] Seeding initial product catalog...');
      await ProductRepository.seedAll(initialProducts);
      console.log(`[Seed] ${initialProducts.length} products seeded successfully.`);
    }
  } catch (err) {
    console.error('[Seed] Error seeding initial data:', err);
  }
}

async function startServer() {
  // Connect to DB and seed initial data
  await connectDB();
  await seedDatabaseIfEmpty();

  if (!isProd) {
    // Development mode: Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Vite] Mounted Vite development middleware');
  } else {
    // Production mode: Static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Production] Serving static files from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AURA MERN E-Commerce Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
