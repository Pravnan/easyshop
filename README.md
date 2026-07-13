# EasyShop

A multi-store e-commerce platform where shop owners can create online storefronts and receive customer enquiries/orders through WhatsApp.

## Features

- **Admin Module**: Manage stores, shop owners, activate/deactivate stores
- **Shop Owner Dashboard**: Manage orders, products, categories, and store settings
- **Public Storefront**: Browse products, add to cart, checkout via WhatsApp or website
- **WhatsApp Integration**: Click-to-chat with formatted order messages
- **Role-based Access**: ADMIN and SHOP_OWNER roles with route protection
- **Responsive Design**: Mobile-first blue-and-white theme

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Actions, NextAuth v5, MongoDB + Mongoose
- **File Storage**: Cloudinary (product images, logos, banners)
- **Validation**: Zod, React Hook Form
- **Notifications**: Sonner
- **Icons**: Lucide React

## Prerequisites

- Node.js 20+
- MongoDB Atlas (or local MongoDB)
- Cloudinary account
- npm

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | http://localhost:3000 (for development) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SEED_ADMIN_NAME` | Admin display name |
| `SEED_ADMIN_EMAIL` | Admin email |
| `SEED_ADMIN_PASSWORD` | Admin password |

## Installation

```bash
npm install
```

## Seed the Admin Account

```bash
npm run seed
```

This creates the first admin user using values from your `.env.local`.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

### Note for Apple Silicon (M1/M2/M3) Users

If you encounter a `@next/swc-darwin-arm64` error during build, use:

```bash
npm run build -- --webpack
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run seed` | Seed admin account |

## Test Credentials

After seeding, log in with:

- **Email**: `admin@example.com`
- **Password**: (the value of `SEED_ADMIN_PASSWORD`)

## Routes

### Admin (`/admin/*`)
- `/admin` — Dashboard with store statistics
- `/admin/stores` — Store management table
- `/admin/stores/new` — Create shop owner & store
- `/admin/stores/[storeId]` — Store details

### Shop Owner (`/dashboard/*`)
- `/dashboard` — Dashboard with order/sales stats
- `/dashboard/orders` — Order & lead management
- `/dashboard/orders/new` — Manual order creation
- `/dashboard/orders/[orderId]` — Order details
- `/dashboard/products` — Product management
- `/dashboard/products/new` — Create product
- `/dashboard/products/[productId]/edit` — Edit product
- `/dashboard/categories` — Category management
- `/dashboard/settings` — Store settings

### Public (`/store/*`)
- `/store/[storeSlug]` — Storefront with products
- `/store/[storeSlug]/product/[productSlug]` — Product details
- `/store/[storeSlug]/cart` — Shopping cart
- `/store/[storeSlug]/checkout` — Checkout
- `/store/[storeSlug]/order-success/[orderId]` — Order confirmation

### Auth
- `/login` — Login page

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/login/     # Login page
│   ├── admin/            # Admin module
│   ├── dashboard/        # Shop owner module
│   ├── store/            # Public storefront
│   └── api/auth/         # NextAuth API route
├── components/
│   ├── admin/            # Admin components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Shop owner components
│   ├── storefront/       # Public storefront components
│   └── ui/               # shadcn/ui components
├── actions/              # Server Actions
│   ├── admin/            # Admin server actions
│   ├── dashboard/        # Shop owner server actions
│   └── storefront/       # Storefront server actions
├── lib/                  # Utilities
│   ├── auth/             # NextAuth config
│   ├── database/         # MongoDB connection
│   ├── cloudinary/       # Cloudinary helpers
│   ├── permissions/      # Role-based access
│   ├── order-id/         # Auto-generated order IDs
│   └── whatsapp/         # WhatsApp message builder
├── models/               # Mongoose models
├── validations/          # Zod schemas
├── types/                # TypeScript types
└── hooks/                # React hooks (useCart)
```

## Deployment

### Vercel
1. Push the project to GitHub.
2. Import the repository on Vercel.
3. Add all environment variables from `.env.example`.
4. Deploy.

### MongoDB Atlas
1. Create a free cluster on MongoDB Atlas.
2. Get the connection string.
3. Add it as `MONGODB_URI` in Vercel environment variables.

### Cloudinary
1. Create a free Cloudinary account.
2. Get your cloud name, API key, and API secret.
3. Add them as environment variables.

## Limitations

- Cloudinary integration requires valid API keys; image upload is optional (products work without images)
- WhatsApp click-to-chat only (not WhatsApp Business API)
- Basic variant selector (no SKU-level inventory tracking)
- No payment gateway integration
- No email notifications
- No analytics beyond dashboard stats

## Future Improvements

- Payment gateway integration
- Email notifications for orders
- Inventory/stock management with SKUs
- Multiple product image support (beyond 2)
- Bulk product import/export
- Advanced analytics and reporting
- Coupon/discount system
- Customer account creation
- Order tracking for customers
