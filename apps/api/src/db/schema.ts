import { mysqlTable, varchar, text, int, boolean, timestamp, json } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 120 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  tagline: varchar('tagline', { length: 255 }),
  description: text('description'),
  basePrice: int('base_price').notNull(),
  compareAtPrice: int('compare_at_price'),
  frameShape: varchar('frame_shape', { length: 50 }).notNull(), // aviator, wayfarer, round, clubmaster, cat-eye, hexagonal, rimless
  frameMaterial: varchar('frame_material', { length: 50 }).notNull(), // acetate, matte-black, titanium, gold-metal, silver-metal, tortoiseshell
  recommendedFaceShapes: text('recommended_face_shapes'), // round, oval, square, diamond, heart
  images: json('images').$type<string[]>(),
  isBestseller: boolean('is_bestseller').default(false),
  isNew: boolean('is_new').default(false),
  isActive: boolean('is_active').default(true),
  stock: int('stock').default(50),
  createdAt: timestamp('created_at').defaultNow(),
});

export const variants = mysqlTable('variants', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 }).notNull(),
  frameColorName: varchar('frame_color_name', { length: 100 }).notNull(),
  frameColorHex: varchar('frame_color_hex', { length: 20 }).notNull(),
  lensTint: varchar('lens_tint', { length: 50 }).notNull(), // polarized, blue-cut, transition, mirror-gradient, clear
  sku: varchar('sku', { length: 100 }),
  priceAdjustment: int('price_adjustment').default(0),
  stock: int('stock').default(20),
});

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderNumber: varchar('order_number', { length: 32 }).notNull().unique(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  shippingAddress: text('shipping_address').notNull(),
  specialInstructions: text('special_instructions'),
  prescriptionUrl: text('prescription_url'),
  prescriptionData: json('prescription_data').$type<{
    sphereRight?: string;
    cylinderRight?: string;
    axisRight?: string;
    sphereLeft?: string;
    cylinderLeft?: string;
    axisLeft?: string;
    pd?: string;
  }>(),
  subtotal: int('subtotal').notNull(),
  shippingFee: int('shipping_fee').notNull(),
  discount: int('discount').default(0),
  total: int('total').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, confirmed, shipped, delivered, cancelled
  courier: varchar('courier', { length: 50 }).default('TCS'), // TCS, Leopards, Trax, CallCourier
  trackingNumber: varchar('tracking_number', { length: 100 }),
  paymentMethod: varchar('payment_method', { length: 50 }).default('COD'),
  riskScore: varchar('risk_score', { length: 20 }).default('low'), // low, medium, high
  riskReason: varchar('risk_reason', { length: 255 }),
  source: varchar('source', { length: 50 }).default('web'), // web, reels, customizer
  items: json('items').$type<Array<{
    productId?: string;
    name: string;
    frameShape: string;
    frameMaterial: string;
    lensTint: string;
    frameColor: string;
    quantity: number;
    price: number;
    image?: string;
  }>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reels = mysqlTable('reels', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  videoUrl: text('video_url').notNull(),
  posterUrl: text('poster_url'),
  productId: varchar('product_id', { length: 36 }),
  productName: varchar('product_name', { length: 255 }),
  productPrice: int('product_price'),
  likesCount: int('likes_count').default(1420),
  sharesCount: int('shares_count').default(95),
  badgeText: varchar('badge_text', { length: 50 }).default('Verified Buyer Video'),
  reviews: json('reviews').$type<Array<{ author: string; city: string; comment: string; rating: number }>>(),
  displayOrder: int('display_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const socialProofSettings = mysqlTable('social_proof_settings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  mode: varchar('mode', { length: 20 }).default('hybrid'), // auto, custom, hybrid
  initialDelayMs: int('initial_delay_ms').default(3000),
  displayDurationMs: int('display_duration_ms').default(5000),
  rotationIntervalMs: int('rotation_interval_ms').default(8000),
  isEnabled: boolean('is_enabled').default(true),
});

export const socialProofEvents = mysqlTable('social_proof_events', {
  id: varchar('id', { length: 36 }).primaryKey(),
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  timeAgo: varchar('time_ago', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true),
});
