# AURA | Professional MERN Stack E-Commerce Platform

A production-ready, full-stack E-Commerce web application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, Lucide icons, and JWT-based authentication.

---

## 🚀 Live Demo & Quick Evaluation

The application includes pre-configured demo credentials with **1-click sign-in buttons** in the Sign In modal:

- **Demo Customer**: `demo@aura.store` / `password123`
- **Demo Administrator**: `admin@aura.store` / `admin123` (Unlocks the Admin Portal for product CRUD and order status updates)

Coupon codes for checkout:
- `WELCOME10` (10% off)
- `AURA20` (20% off)

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, TypeScript | Modular functional components, Hooks, Context API |
| **Styling** | Tailwind CSS v4 | Responsive mobile/tablet/desktop layout, Plus Jakarta Sans & Outfit fonts |
| **Icons & Motion** | Lucide React | Clean, domain-native iconography |
| **Backend** | Node.js, Express.js | RESTful APIs, JWT Auth middleware, Error handling |
| **Database** | MongoDB / Mongoose | MongoDB Atlas connection with automatic fallback to persistent JSON document store |
| **Security** | bcryptjs & JWT | Secure salted password hashing and 7-day signed JWT tokens |

---

## 🌟 Application Features & Pages

### 1. Home Page
- **Navigation Bar**: Responsive 3-zone header with search input, shopping bag badge, customer avatar/dropdown, and admin portal link.
- **Storefront Hero**: High-resolution lifestyle photography, balanced headline typography, and direct CTA into the curated collection.
- **Specialty Categories**: Quick category selector for *Audio & Acoustics*, *Brew & Ceramics*, *Desk & Studio*, *Lighting & Living*, and *Curated Essentials*.
- **Featured Collection**: 4-column responsive grid of spotlighted products.
- **Studio Craftsmanship Story**: Architectural detail section highlighting material provenance, aerospace alloys, and Tuscan vegetable-tanned hides.
- **Trending Goods**: Seasonal showcase of highest-demand items.
- **Footer**: Complimentary shipping policy, warranty terms, directory links, newsletter signup, and tech stack disclosure.

### 2. Products Catalog Page
- **Responsive Grid**: Fluid 1 to 4 column card layout.
- **Search & Filters**: Real-time name/description search, category filters, and price threshold selector.
- **Sorting**: Newest editions, Price (low to high), Price (high to low), Rating, and Popularity.
- **Product Card**: Image-first presentation (65-75% height), unboxed metadata, tabular pricing, rating badge, quick-view button, and instant Add-to-Bag with tactile feedback.
- **Quick View / PDP Modal**: Contiguous purchase module with full specifications table, stock inventory counter, quantity stepper, and purchase reassurance.

### 3. Cart Drawer & Checkout
- **Slide-Over Cart Drawer**:
  - Live quantity adjustment (`+` / `-`) and instant item removal.
  - Interactive **Free Shipping Progress Bar** (Qualify with orders over $150).
  - Promo code field supporting `WELCOME10` and `AURA20`.
  - Subtotal, tax (8%), shipping fee, and total calculation.
- **Checkout Page**:
  - Customer contact details (Name, Email, Phone).
  - Shipping address with validation (Street, City, State, Postal Code, Country).
  - Settlement method selection:
    - **Credit / Debit Card** with simulated validation.
    - **Cash on Delivery (COD)** with clear instructions.
    - **Instant UPI / Wire Transfer**.
  - Itemized order summary with total breakdown.
- **Order Confirmation Page**:
  - Unique Order ID (`AUR-XXXXXX`).
  - Estimated arrival date and carrier dispatch tracker.
  - Itemized receipt breakdown.
  - Direct links to Order History and storefront.

### 4. User Account & Order History
- Sign up and sign in with JWT tokens.
- Persistent session storage in `localStorage`.
- Order history tracking with fulfillment badges: `Processing`, `Shipped`, `Delivered`.
- Guest order tracking by Order ID.

### 5. Admin Management Portal (Role: `admin`)
- **Key Performance Metrics**: Gross revenue, total orders processed, active product count, and total physical inventory.
- **Product Catalog Management**:
  - Create new products with custom prices, categories, images, and descriptions.
  - Edit existing products, pricing, and stock levels.
  - Delete products from the catalog.
  - "Reset Demo Catalog" button to restore default curated products anytime.
- **Fulfillment Management**: Update order statuses in real-time (`Processing` → `Shipped` → `Delivered` → `Cancelled`).

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # HTML entry point with web fonts & metadata
├── metadata.json             # Applet metadata configuration
├── package.json              # Dependencies and run scripts
├── server.ts                 # Full-stack Express server with Vite middleware integration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── server/                   # Backend Architecture
│   ├── db.ts                 # MongoDB / Mongoose connection with persistent JSON fallback
│   ├── seedData.ts           # Initial sample products and demo accounts
│   ├── middleware/
│   │   └── auth.ts           # JWT token generation, verification & admin check
│   ├── models/
│   │   ├── User.ts           # User schema & Mongoose/local repository
│   │   ├── Product.ts        # Product schema & repository with search & filters
│   │   └── Order.ts          # Order schema & repository
│   └── routes/
│       ├── authRoutes.ts     # /api/auth (register, login, me, profile)
│       ├── productRoutes.ts  # /api/products (CRUD, filtering, categories, seed reset)
│       └── orderRoutes.ts    # /api/orders (create, my-orders, admin list, status updates)
└── src/                      # Frontend Architecture
    ├── App.tsx               # Main SPA router and view orchestrator
    ├── main.tsx              # React DOM entry point
    ├── index.css             # Tailwind CSS imports and tabular figures
    ├── types/
    │   └── index.ts          # Shared TypeScript models and interfaces
    ├── services/
    │   └── api.ts            # Centralized API fetch client with Bearer auth
    ├── context/
    │   ├── AuthContext.tsx   # User session, JWT tokens, and demo login handlers
    │   └── CartContext.tsx   # Shopping bag state, quantities, discounts & calculations
    ├── assets/images/        # High-resolution generated studio product photography
    └── components/
        ├── Navbar.tsx        # Top navigation adhering to 3-zone contract
        ├── Footer.tsx        # Structured footer with trust markers & directory
        ├── HeroSection.tsx   # Campaign focal point & value proposition
        ├── FeaturedCategories.tsx # Specialty category selector
        ├── ProductCard.tsx   # Reusable product card with image priority
        ├── ProductCatalog.tsx # Filterable, searchable, and sortable catalog view
        ├── ProductDetailModal.tsx # Contiguous purchase module (PDP)
        ├── CartDrawer.tsx    # Slide-over bag with free shipping progress
        ├── CheckoutView.tsx  # Multi-step checkout with customer coordinates & payments
        ├── OrderSuccessView.tsx # Post-purchase confirmation receipt & tracking
        ├── OrdersView.tsx    # Customer order history & guest tracking
        ├── AdminView.tsx     # Admin CRUD dashboard & fulfillment management
        └── AuthModal.tsx     # Sign-in & registration with 1-click demo access
```

---

## 💻 Installation & Execution

### Prerequisites
- Node.js (version 18 or higher)
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: If you wish to connect to a live MongoDB Atlas cluster, set `MONGODB_URI` in `.env`. If left unset, the application automatically persists data to `server/data/db.json` with zero extra configuration!)*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`. The Express server boots up and serves the React application with Vite middleware.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔌 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new customer account
- `POST /api/auth/login` - Authenticate with email/password and receive a JWT token
- `GET /api/auth/me` - Retrieve current user profile (Bearer token required)
- `PUT /api/auth/profile` - Update customer delivery address & contact details

### Products (`/api/products`)
- `GET /api/products` - List products with query filters (`?category=...&search=...&minPrice=...&maxPrice=...&sort=...`)
- `GET /api/products/categories` - Get distinct categories with item counts
- `GET /api/products/:idOrSlug` - Get single product details
- `POST /api/products` - Create new product (Admin authorization required)
- `PUT /api/products/:id` - Update existing product (Admin authorization required)
- `DELETE /api/products/:id` - Delete product (Admin authorization required)
- `POST /api/products/seed/reset` - Reset catalog to default seed products (Admin only)

### Orders (`/api/orders`)
- `POST /api/orders` - Place a new order (computes subtotal, tax, free shipping threshold, and updates stock)
- `GET /api/orders/my-orders` - Retrieve authenticated user's order history
- `GET /api/orders/:idOrNumber` - Get order receipt details by ID or order number
- `GET /api/orders` - List all orders across all customers (Admin only)
- `PATCH /api/orders/:id/status` - Update order status (Admin only)

---

## ☁️ Production Deployment Guide

### Option A: Monolithic Full-Stack Deployment (Render, Railway, Fly.io)
1. Push this repository to GitHub.
2. In **Render** / **Railway**, create a new **Web Service**.
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/aura_db`
   - `JWT_SECRET=<your-secure-random-key>`

### Option B: Decoupled Deployment (Vercel Frontend + Render Backend)
1. **Database**: Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and get your connection string.
2. **Backend**: Deploy `server.ts` as an Express Node.js web service on Render with the `MONGODB_URI` environment variable.
3. **Frontend**: Deploy on Vercel with build command `npm run build` and output directory `dist`. Point API requests to your hosted backend URL.

---

## 📜 License
Apache-2.0 License.
