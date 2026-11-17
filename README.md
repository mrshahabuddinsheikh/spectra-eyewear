# 🕶️ Spectra Eyewear PK — Ultra-Fast 3D Luxury Eyewear Monorepo

> **Production-ready, viral, high-converting e-commerce monorepo for premium Eyewear & Sunglasses with Cash on Delivery (COD) tailored for the South Asian / Pakistan market.**

![Spectra Eyewear](https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 1. Architecture & Tech Stack

```
glasses/
├── .github/workflows/deploy.yml   # Multi-tier GitHub Actions CI/CD to cPanel / CloudLinux
├── server.js                      # Universal Phusion Passenger entry point & Fastify proxy
├── package.json                   # Root npm workspaces configuration
├── apps/
│   ├── api/                       # Fastify v5 (TypeScript standalone bundle via esbuild)
│   │   ├── src/
│   │   │   ├── db/                # Drizzle ORM + MySQL 10.5+ / In-Memory hybrid layer
│   │   │   ├── routes/            # Auth, Products, Orders, Reels, Social Proof, AI Optician
│   │   │   └── index.ts           # Fastify engine bootstrap
│   │   └── esbuild.config.mjs     # Standalone single-file compiler for cPanel/CloudLinux
│   └── web/                       # Next.js 16 (React 19, Turbopack, Tailwind CSS v4)
│       └── src/
│           ├── components/
│           │   ├── 3d/            # Three.js + React Three Fiber Procedural 3D Engine
│           │   ├── reels/         # 9:16 Vertical Shoppable Video Reels with 1-tap COD
│           │   ├── social-proof/  # Real-time Floating Order Notifications
│           │   ├── optician/      # Floating 3D AI Optician Assistant
│           │   ├── gamification/  # Lucky Lens Discount Spin Wheel
│           │   └── checkout/      # Frictionless 1-Page COD Pakistani Checkout
│           └── app/               # Next.js App Router (Shop, Customizer, Track, Admin)
```

---

## ✨ 2. Key Modules & Features

### A. Procedural 3D Frame & Lens Customizer
* **Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)**:
  * **Procedural 3D Eyewear Engine**: Zero heavy GLTF model downloads; lightweight, instant-loading parametric CAD geometries.
  * **7 Iconic Frame Shapes**: Aviator, Wayfarer, Round Classic, Clubmaster, Cat-Eye, Hexagonal, and Rimless.
  * **Frame Materials & Finishes**: Polished Acetate, Stealth Matte Black, Brushed Titanium, Royal Gold Metal, Silver Chrome, and Havana Tortoiseshell.
  * **Lens Technology**: Polarized UV400 Anti-Glare, Blue-Cut Computer Guard (95% HEV filter), Photochromic Transition (smart light-to-dark), and Mirror Chrome Gradient.
  * **Face Shape Fit Guide**: Round, Oval, Square, and Diamond face shape selector with real-time frame dimension compatibility.
  * **Interactive Controls**: 360° auto-spin, OrbitControls damping, Exploded Technical Optics view, and CAD Wireframe mesh inspection.

### B. TikTok / Instagram Shoppable Reels
* **9:16 Full-Screen Vertical Video Carousel**: Smooth TikTok-style vertical navigation with sound mute/unmute toggle.
* **Persistent Like Engine**: Double-tap / button heart animation with live counter.
* **Verified Buyer Reviews Drawer**: Real Pakistani buyer reviews with ratings and city badges.
* **In-Modal "⚡ Fast Buy COD" Overlay**: Allows buyers to select frame color and lens tint, enter name, mobile, and city, and place an order directly without leaving the video reel!

### C. Dynamic Social Proof & Trust Signals
* Floating bottom-left translucent notification (*"Someone in Lahore bought Wayfarer Acetate Polarized 2 min ago · Real Order"*).
* Configurable from the Admin Panel: **Auto mode** (fetches real recent orders), **Custom mode** (curated highlights), and **Hybrid mode**.
* Configurable delay, display duration, and rotation gaps with full Dark & Light mode Liquid Glass translucency.

### D. Cash on Delivery (COD) 1-Page Express Checkout
* **Single-page express checkout** optimized specifically for the Pakistani market.
* **100+ Pakistani City Selector**: Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta, Sialkot, Abbottabad, and more.
* **Automated Shipping Waiver**: Free express delivery over Rs. 3,000 (flat Rs. 200 below).
* **Phone Normalization**: Accepts `03xx` or `+923xx` and validates against Pakistan telecom standards.
* **Prescription Slip Upload & Power Input**: Supports doctor slip image uploads or manual Right/Left Eye (Sphere, Cylinder, Axis, PD) values.
* **Live Order Tracking (`/track` and `/order/[orderNumber]`)**: Milestone stepper with real-time status (Order Placed, Confirmed, Dispatched, In Transit via TCS/Leopards/Trax, Out for Delivery, Delivered).

### E. Floating 3D AI Optician Assistant
* Floating interactive 3D bot widget with glowing avatar and animated optical visor.
* Real-time conversational guidance for face shape styling, blue-light protection benefits, return policy, and order tracking lookup by order reference.

### F. Gamified Lead Capture
* **Lucky Lens Spin-to-Win Wheel**: Offers 5%, 10%, 15% OFF, Free Express Delivery, or Free Microfiber & Hard Case on first COD order.
* Automatically injects discount promo codes (`VIPCOD15`, `FREESHIP`) into the cart with celebratory confetti.

### G. Executive Admin Dashboard (`/admin`)
* **Secure JWT + bcrypt Authentication**: Default credentials: `admin@spectra.pk` / `admin123`.
* **Order Desk**: Filter orders, update status (Pending, Confirmed, Shipped, Delivered, Cancelled), assign courier (TCS, Leopards, Trax, CallCourier) and tracking numbers.
* **Printable Thermal & A4 Invoices**: One-click printable packing slip with COD barcode simulation, items summary, and recipient shipping label.
* **Catalog Editor**: Add and edit frame models, 3D shapes, base prices, compare-at prices, stock, and badges.
* **Shoppable Reels Manager**: Add and manage vertical MP4 video clips, captions, and linked products.
* **Social Proof Manager**: Configure timings and regional buyer popup entries.
* **COD Risk Intelligence**: Automated scoring engine that flags suspicious repetitive numbers (e.g. `03000000000`), incomplete street addresses, and fraud patterns.
* **Bit-for-Bit Database Backup**: One-click `.SQL` and `.JSON` zero-loss database snapshot downloads.

---

## 🛠️ 3. Quick Start & Local Development

### Prerequisites
- Node.js 20+ (Node 20 to 24 supported)
- npm 10+

### Installation
```bash
# 1. Clone repository
cd glasses

# 2. Install all workspaces dependencies
npm install

# 3. Seed Database (idempotent seed)
npm run seed

# 4. Start Development Servers
# Frontend (Next.js 16 with Turbopack on http://localhost:3000)
npm run dev

# Fastify API (on http://localhost:4000)
npm run dev:api
```

---

## 📦 4. Production Build & cPanel / CloudLinux Deployment

### Production Compilation
```bash
# Compile Fastify standalone bundle into apps/api/dist/server.js
npm run build:api

# Build Next.js 16 production storefront
npm run build:web

# Run universal host (spawns Fastify and handles /api/v1 proxying)
npm start
```

### GitHub Actions CI/CD (`.github/workflows/deploy.yml`)
The included GitHub Actions workflow automates the 6 deployment stages to cPanel / CloudLinux:
1. Installs monorepo dependencies.
2. Compiles Fastify API into a single standalone bundle (`apps/api/dist/server.js`) via `esbuild`.
3. Builds Next.js storefront (`next build`).
4. Bundles production files into a clean tarball excluding dev files and caches.
5. Transfers release to cPanel via SCP using GitHub Secrets (`SSH_HOST`, `SSH_USER`, `SSH_PASSWORD`, `SSH_TARGET_DIR`).
6. Executes SSH post-deploy script: extracts archive, runs idempotent MySQL seed (`apps/api/dist/seed.js`), ensures 755/777 permissions, and triggers graceful Phusion Passenger restart (`touch tmp/restart.txt`).

### cPanel GitHub Secrets Configuration
Configure the following secrets in your GitHub repository:
- `SSH_HOST`: IP or domain of your cPanel server (e.g., `server.yourdomain.com`).
- `SSH_USER`: cPanel SSH username.
- `SSH_PASSWORD`: cPanel SSH password or private key.
- `SSH_TARGET_DIR`: Destination directory (e.g., `/home/username/public_html` or `/home/username/spectra`).
- `SSH_PORT`: (Optional, default `22`).

---

## 🔒 5. Admin Credentials
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@spectra.pk`
- **Password**: `admin123`

---

## 📄 License
MIT License. Handcrafted for **Spectra Eyewear PK**.
