import bcrypt from 'bcryptjs';
import { getDb } from './connection.js';
import * as schema from './schema.js';
import { eq, desc, sql } from 'drizzle-orm';

// In-Memory Fallback State (initialized with rich realistic data)
export interface InMemState {
  users: any[];
  products: any[];
  variants: any[];
  orders: any[];
  reels: any[];
  socialProofSettings: any;
  socialProofEvents: any[];
}

const salt = bcrypt.genSaltSync(10);
const adminPasswordHash = bcrypt.hashSync('admin123', salt);

export const memoryState: InMemState = {
  users: [
    {
      id: 'usr-admin-1',
      email: 'admin@spectra.pk',
      passwordHash: adminPasswordHash,
      name: 'Spectra Operations Admin',
      role: 'admin',
      createdAt: new Date(),
    },
  ],
  products: [
    {
      id: 'prd-wayfarer-1',
      name: 'Wayfarer Bold Acetate',
      slug: 'wayfarer-bold-acetate',
      tagline: 'Iconic masculine silhouette hand-crafted from Italian cellulose acetate',
      description: 'The standard of modern eyewear. Featuring reinforced barrel hinges, sculpted nose pads for South Asian bridge profiles, and anti-reflective optical grade lenses.',
      basePrice: 2999,
      compareAtPrice: 4500,
      frameShape: 'wayfarer',
      frameMaterial: 'acetate',
      recommendedFaceShapes: 'round,oval,diamond',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: true,
      isNew: false,
      isActive: true,
      stock: 45,
      createdAt: new Date(),
    },
    {
      id: 'prd-aviator-1',
      name: 'Aviator SkyMaster Titanium',
      slug: 'aviator-skymaster-titanium',
      tagline: 'Military teardrop styling reimagined in aerospace-grade titanium',
      description: 'Ultra-lightweight double bridge frame with bayonet temples and gradient polarized UV400 lenses designed to eliminate harsh tropical sun glare.',
      basePrice: 3499,
      compareAtPrice: 5200,
      frameShape: 'aviator',
      frameMaterial: 'gold-metal',
      recommendedFaceShapes: 'square,oval,heart',
      images: [
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: true,
      isNew: true,
      isActive: true,
      stock: 30,
      createdAt: new Date(),
    },
    {
      id: 'prd-clubmaster-1',
      name: 'Clubmaster Retro Browline',
      slug: 'clubmaster-retro-browline',
      tagline: '1950s intellectual elegance with tortoiseshell acetate and gold filigree',
      description: 'Hand-polished acetate upper browline combined with stamped golden rim wires. Ideal for computer screen protection and executive presence.',
      basePrice: 3699,
      compareAtPrice: 5500,
      frameShape: 'clubmaster',
      frameMaterial: 'tortoiseshell',
      recommendedFaceShapes: 'round,oval,square',
      images: [
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: false,
      isNew: true,
      isActive: true,
      stock: 22,
      createdAt: new Date(),
    },
    {
      id: 'prd-round-1',
      name: 'Round Classic Vintage',
      slug: 'round-classic-vintage',
      tagline: 'Timeless circular silhouette in brushed gunmetal titanium',
      description: 'Clean circular wireframe with ultra-flexible silicone nose pads. Fitted standard with Blue-Cut computer lenses to stop screen fatigue.',
      basePrice: 3199,
      compareAtPrice: 4800,
      frameShape: 'round',
      frameMaterial: 'matte-black',
      recommendedFaceShapes: 'square,diamond,heart',
      images: [
        'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: true,
      isNew: false,
      isActive: true,
      stock: 38,
      createdAt: new Date(),
    },
    {
      id: 'prd-cateye-1',
      name: 'Cat-Eye St. Tropez Luxe',
      slug: 'cat-eye-st-tropez-luxe',
      tagline: 'Dramatic upswept feline contours with high-gloss beveled rims',
      description: 'Chic Parisian statement piece crafted with gradient amber tones and subtle micro-beveled temple details.',
      basePrice: 3899,
      compareAtPrice: 5800,
      frameShape: 'cat-eye',
      frameMaterial: 'acetate',
      recommendedFaceShapes: 'round,diamond,oval',
      images: [
        'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: false,
      isNew: true,
      isActive: true,
      stock: 19,
      createdAt: new Date(),
    },
    {
      id: 'prd-hexagonal-1',
      name: 'Hexagonal Geometric Edge',
      slug: 'hexagonal-geometric-edge',
      tagline: 'Contemporary multifaceted octagonal wireframe for trendsetters',
      description: 'Sharply defined geometric angles with laser-etched knurling on the bridge. Comes equipped with Photochromic day-to-night smart transition lenses.',
      basePrice: 3599,
      compareAtPrice: 5000,
      frameShape: 'hexagonal',
      frameMaterial: 'silver-metal',
      recommendedFaceShapes: 'round,oval',
      images: [
        'https://images.unsplash.com/photo-1582142839970-2b9dc313eb02?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: true,
      isNew: true,
      isActive: true,
      stock: 25,
      createdAt: new Date(),
    },
    {
      id: 'prd-rimless-1',
      name: 'Rimless Titanium Air Minimalist',
      slug: 'rimless-titanium-air-minimalist',
      tagline: 'Weightless floating optics mounted on surgical beta-titanium',
      description: 'Barely-there 8.5-gram featherweight frame engineered for high-index prescription and professional everyday comfort.',
      basePrice: 4499,
      compareAtPrice: 6500,
      frameShape: 'rimless',
      frameMaterial: 'titanium',
      recommendedFaceShapes: 'round,oval,square,diamond',
      images: [
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
      ],
      isBestseller: false,
      isNew: true,
      isActive: true,
      stock: 15,
      createdAt: new Date(),
    },
  ],
  variants: [
    { id: 'var-1', productId: 'prd-wayfarer-1', frameColorName: 'Polished Piano Black', frameColorHex: '#111111', lensTint: 'polarized', sku: 'WF-BLK-POL', priceAdjustment: 0, stock: 20 },
    { id: 'var-2', productId: 'prd-wayfarer-1', frameColorName: 'Classic Havana Tortoise', frameColorHex: '#5c3317', lensTint: 'blue-cut', sku: 'WF-TOR-BLU', priceAdjustment: 300, stock: 15 },
    { id: 'var-3', productId: 'prd-aviator-1', frameColorName: 'Royal Brushed Gold', frameColorHex: '#d4af37', lensTint: 'polarized', sku: 'AV-GLD-POL', priceAdjustment: 0, stock: 18 },
    { id: 'var-4', productId: 'prd-aviator-1', frameColorName: 'Gunmetal Silver', frameColorHex: '#a8a9ad', lensTint: 'mirror-gradient', sku: 'AV-SLV-MIR', priceAdjustment: 400, stock: 12 },
    { id: 'var-5', productId: 'prd-round-1', frameColorName: 'Matte Onyx', frameColorHex: '#1a1a1a', lensTint: 'blue-cut', sku: 'RD-MAT-BLU', priceAdjustment: 0, stock: 25 },
    { id: 'var-6', productId: 'prd-hexagonal-1', frameColorName: 'Chrome Titanium', frameColorHex: '#e2e8f0', lensTint: 'transition', sku: 'HX-CRM-TRN', priceAdjustment: 600, stock: 14 },
  ],
  orders: [
    {
      id: 'ord-101',
      orderNumber: 'SP-2026-8492',
      customerName: 'Muhammad Hamza Bilal',
      customerPhone: '03008472910',
      customerEmail: 'hamza.bilal@gmail.com',
      city: 'Lahore',
      shippingAddress: 'House 42, Street 7, Block Y, Phase 3, DHA, Lahore',
      specialInstructions: 'Call before delivery please, security gate entry.',
      prescriptionUrl: null,
      prescriptionData: null,
      subtotal: 2999,
      shippingFee: 0,
      discount: 0,
      total: 2999,
      status: 'delivered',
      courier: 'TCS',
      trackingNumber: 'TCS-89301928PK',
      paymentMethod: 'COD',
      riskScore: 'low',
      riskReason: 'Verified phone format, clear DHA address, repeat customer score 98%',
      source: 'web',
      items: [
        {
          name: 'Wayfarer Bold Acetate',
          frameShape: 'wayfarer',
          frameMaterial: 'acetate',
          lensTint: 'polarized',
          frameColor: 'Polished Piano Black',
          quantity: 1,
          price: 2999,
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 48),
      updatedAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: 'ord-102',
      orderNumber: 'SP-2026-7821',
      customerName: 'Ayesha Siddiqui',
      customerPhone: '03219482019',
      customerEmail: 'ayesha.s@outlook.com',
      city: 'Karachi',
      shippingAddress: 'Apartment 4B, Creek Vistas, Phase 8, Clifton, Karachi',
      specialInstructions: 'Leave with lobby reception if unavailable',
      prescriptionUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      prescriptionData: {
        sphereRight: '-1.50',
        cylinderRight: '-0.50',
        axisRight: '90',
        sphereLeft: '-1.75',
        cylinderLeft: '-0.25',
        axisLeft: '85',
        pd: '63mm',
      },
      subtotal: 3499,
      shippingFee: 0,
      discount: 350,
      total: 3149,
      status: 'shipped',
      courier: 'Leopards',
      trackingNumber: 'LPD-7729103PK',
      paymentMethod: 'COD',
      riskScore: 'low',
      riskReason: 'Accurate prescription details supplied, active mobile verification',
      source: 'reels',
      items: [
        {
          name: 'Aviator SkyMaster Titanium',
          frameShape: 'aviator',
          frameMaterial: 'gold-metal',
          lensTint: 'blue-cut',
          frameColor: 'Royal Brushed Gold',
          quantity: 1,
          price: 3499,
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 24),
      updatedAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      id: 'ord-103',
      orderNumber: 'SP-2026-6104',
      customerName: 'Zainab Qureshi',
      customerPhone: '03335198244',
      customerEmail: 'zainab.q@gmail.com',
      city: 'Islamabad',
      shippingAddress: 'House 19, Street 44, Sector F-7/2, Islamabad',
      specialInstructions: 'Ring bell twice',
      prescriptionUrl: null,
      prescriptionData: null,
      subtotal: 3699,
      shippingFee: 0,
      discount: 0,
      total: 3699,
      status: 'confirmed',
      courier: 'Trax',
      trackingNumber: 'TRX-4491028PK',
      paymentMethod: 'COD',
      riskScore: 'low',
      riskReason: 'Valid sector address, verified WhatsApp line',
      source: 'customizer',
      items: [
        {
          name: 'Clubmaster Retro Browline',
          frameShape: 'clubmaster',
          frameMaterial: 'tortoiseshell',
          lensTint: 'blue-cut',
          frameColor: 'Classic Havana Tortoise',
          quantity: 1,
          price: 3699,
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 6),
      updatedAt: new Date(Date.now() - 3600000 * 3),
    },
    {
      id: 'ord-104',
      orderNumber: 'SP-2026-5590',
      customerName: 'Unknown Guest',
      customerPhone: '03000000000',
      customerEmail: null,
      city: 'Lahore',
      shippingAddress: 'Near general store abc street',
      specialInstructions: null,
      prescriptionUrl: null,
      prescriptionData: null,
      subtotal: 2999,
      shippingFee: 0,
      discount: 0,
      total: 2999,
      status: 'pending',
      courier: 'TCS',
      trackingNumber: null,
      paymentMethod: 'COD',
      riskScore: 'high',
      riskReason: 'Repetitive dummy phone number digits (03000000000) & incomplete street address',
      source: 'web',
      items: [
        {
          name: 'Wayfarer Bold Acetate',
          frameShape: 'wayfarer',
          frameMaterial: 'acetate',
          lensTint: 'polarized',
          frameColor: 'Polished Piano Black',
          quantity: 1,
          price: 2999,
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 1),
      updatedAt: new Date(Date.now() - 3600000 * 1),
    },
  ],
  reels: [
    {
      id: 'reel-1',
      title: 'POV: Finding the perfect pair for South Asian face shapes 🔥',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-lighting-wearing-sunglasses-40436-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      productId: 'prd-wayfarer-1',
      productName: 'Wayfarer Bold Acetate',
      productPrice: 2999,
      likesCount: 3824,
      sharesCount: 341,
      badgeText: 'Trending on TikTok PK',
      reviews: [
        { author: 'Bilal K.', city: 'Lahore', comment: 'Quality is 10/10, looks 10x more expensive than Rs 2,999!', rating: 5 },
        { author: 'Saad M.', city: 'Rawalpindi', comment: 'Loved the 1-page COD checkout. Came in 2 days.', rating: 5 },
      ],
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'reel-2',
      title: 'Testing Polarized UV400 vs Harsh Sunlight in Clifton Beach Karachi 🌊',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-man-putting-on-sunglasses-40428-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80',
      productId: 'prd-aviator-1',
      productName: 'Aviator SkyMaster Titanium',
      productPrice: 3499,
      likesCount: 2910,
      sharesCount: 198,
      badgeText: 'Customer Video Review',
      reviews: [
        { author: 'Farhan A.', city: 'Karachi', comment: 'The polarization is genuine. Cuts driving glare completely.', rating: 5 },
      ],
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'reel-3',
      title: 'Unboxing the 3D Custom Clubmaster Browline — Honest Review ✨',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-touching-her-sunglasses-with-confidence-40432-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80',
      productId: 'prd-clubmaster-1',
      productName: 'Clubmaster Retro Browline',
      productPrice: 3699,
      likesCount: 4512,
      sharesCount: 520,
      badgeText: 'Verified Buyer Unboxing',
      reviews: [
        { author: 'Zainab N.', city: 'Islamabad', comment: 'The tortoiseshell finish is gorgeous in sunlight!', rating: 5 },
      ],
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'reel-4',
      title: 'Work from home essential: Blue-Cut lenses demo 💻👀',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-man-wearing-trendy-sunglasses-40430-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80',
      productId: 'prd-round-1',
      productName: 'Round Classic Vintage',
      productPrice: 3199,
      likesCount: 2190,
      sharesCount: 167,
      badgeText: 'Optician Recommendation',
      reviews: [
        { author: 'Danish R.', city: 'Faisalabad', comment: 'My eye strain after 8 hrs of coding is completely gone.', rating: 5 },
      ],
      displayOrder: 4,
      isActive: true,
      createdAt: new Date(),
    },
  ],
  socialProofSettings: {
    id: 'sps-1',
    mode: 'hybrid', // auto, custom, hybrid
    initialDelayMs: 3000,
    displayDurationMs: 5000,
    rotationIntervalMs: 8000,
    isEnabled: true,
  },
  socialProofEvents: [
    { id: 'spe-1', customerName: 'Someone', city: 'Lahore (DHA Phase 5)', productName: 'Wayfarer Bold Acetate (Polarized)', timeAgo: '2 minutes ago', isActive: true },
    { id: 'spe-2', customerName: 'Usman K.', city: 'Karachi (Clifton)', productName: 'Aviator SkyMaster Titanium (Gold)', timeAgo: '4 minutes ago', isActive: true },
    { id: 'spe-3', customerName: 'Dr. Fatima', city: 'Islamabad (F-10)', productName: 'Clubmaster Browline (Blue-Cut)', timeAgo: '7 minutes ago', isActive: true },
    { id: 'spe-4', customerName: 'Ali Raza', city: 'Rawalpindi (Bahria Town)', productName: 'Hexagonal Geometric Edge', timeAgo: '11 minutes ago', isActive: true },
    { id: 'spe-5', customerName: 'Waleed', city: 'Peshawar (University Town)', productName: 'Round Classic Vintage', timeAgo: '16 minutes ago', isActive: true },
    { id: 'spe-6', customerName: 'Hira Shah', city: 'Multan (Cantt)', productName: 'Cat-Eye St. Tropez Luxe', timeAgo: '22 minutes ago', isActive: true },
  ],
};

// Data Access Layer
export const store = {
  // Products
  async getProducts() {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      return await db.select().from(schema.products).where(eq(schema.products.isActive, true));
    }
    return memoryState.products.filter(p => p.isActive);
  },

  async getAllProductsAdmin() {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      return await db.select().from(schema.products);
    }
    return memoryState.products;
  },

  async getProductBySlug(slug: string) {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      const results = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
      return results[0] || null;
    }
    return memoryState.products.find(p => p.slug === slug) || null;
  },

  async getProductById(id: string) {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      const results = await db.select().from(schema.products).where(eq(schema.products.id, id));
      return results[0] || null;
    }
    return memoryState.products.find(p => p.id === id) || null;
  },

  async saveProduct(productData: any) {
    const { db, isRealDb } = await getDb();
    const existingIndex = memoryState.products.findIndex(p => p.id === productData.id);
    if (existingIndex >= 0) {
      memoryState.products[existingIndex] = { ...memoryState.products[existingIndex], ...productData };
    } else {
      memoryState.products.unshift(productData);
    }

    if (isRealDb && db) {
      try {
        await db.insert(schema.products).values(productData).onDuplicateKeyUpdate({ set: productData });
      } catch (err) {
        console.error('Database write error:', err);
      }
    }
    return productData;
  },

  async deleteProduct(id: string) {
    const { db, isRealDb } = await getDb();
    memoryState.products = memoryState.products.filter(p => p.id !== id);
    if (isRealDb && db) {
      try {
        await db.delete(schema.products).where(eq(schema.products.id, id));
      } catch (err) {
        console.error('Database delete error:', err);
      }
    }
    return true;
  },

  // Orders
  async getOrders() {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      return await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
    }
    return [...memoryState.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderByNumber(orderNumber: string) {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      const results = await db.select().from(schema.orders).where(eq(schema.orders.orderNumber, orderNumber));
      return results[0] || null;
    }
    return memoryState.orders.find(o => o.orderNumber.toUpperCase() === orderNumber.toUpperCase()) || null;
  },

  async createOrder(orderData: any) {
    const { db, isRealDb } = await getDb();
    memoryState.orders.unshift(orderData);
    if (isRealDb && db) {
      try {
        await db.insert(schema.orders).values(orderData);
      } catch (err) {
        console.error('Database create order error:', err);
      }
    }
    return orderData;
  },

  async updateOrderStatus(orderNumber: string, status: string, courier?: string, trackingNumber?: string) {
    const { db, isRealDb } = await getDb();
    const order = memoryState.orders.find(o => o.orderNumber === orderNumber);
    if (order) {
      order.status = status;
      if (courier) order.courier = courier;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      order.updatedAt = new Date();
    }

    if (isRealDb && db) {
      try {
        const updatePayload: any = { status, updatedAt: new Date() };
        if (courier) updatePayload.courier = courier;
        if (trackingNumber) updatePayload.trackingNumber = trackingNumber;
        await db.update(schema.orders).set(updatePayload).where(eq(schema.orders.orderNumber, orderNumber));
      } catch (err) {
        console.error('Database update order error:', err);
      }
    }
    return order;
  },

  // Reels
  async getReels() {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      return await db.select().from(schema.reels).where(eq(schema.reels.isActive, true));
    }
    return memoryState.reels.filter(r => r.isActive);
  },

  async getAllReelsAdmin() {
    return memoryState.reels;
  },

  async saveReel(reelData: any) {
    const { db, isRealDb } = await getDb();
    const existingIndex = memoryState.reels.findIndex(r => r.id === reelData.id);
    if (existingIndex >= 0) {
      memoryState.reels[existingIndex] = { ...memoryState.reels[existingIndex], ...reelData };
    } else {
      memoryState.reels.push(reelData);
    }
    return reelData;
  },

  async likeReel(id: string) {
    const reel = memoryState.reels.find(r => r.id === id);
    if (reel) {
      reel.likesCount = (reel.likesCount || 0) + 1;
      return reel.likesCount;
    }
    return 0;
  },

  // Social Proof
  async getSocialProofSettings() {
    return memoryState.socialProofSettings;
  },

  async updateSocialProofSettings(newSettings: any) {
    memoryState.socialProofSettings = { ...memoryState.socialProofSettings, ...newSettings };
    return memoryState.socialProofSettings;
  },

  async getSocialProofEvents() {
    return memoryState.socialProofEvents.filter(e => e.isActive);
  },

  async saveSocialProofEvent(eventData: any) {
    const existingIndex = memoryState.socialProofEvents.findIndex(e => e.id === eventData.id);
    if (existingIndex >= 0) {
      memoryState.socialProofEvents[existingIndex] = { ...memoryState.socialProofEvents[existingIndex], ...eventData };
    } else {
      memoryState.socialProofEvents.unshift(eventData);
    }
    return eventData;
  },

  // Users & Auth
  async findUserByEmail(email: string) {
    const { db, isRealDb } = await getDb();
    if (isRealDb && db) {
      const results = await db.select().from(schema.users).where(eq(schema.users.email, email));
      return results[0] || null;
    }
    return memoryState.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // Bit-for-bit SQL / JSON Backup
  generateBackupDump() {
    const dump = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'spectra_eyewear',
      tables: {
        products: memoryState.products,
        variants: memoryState.variants,
        orders: memoryState.orders,
        reels: memoryState.reels,
        socialProofSettings: memoryState.socialProofSettings,
        socialProofEvents: memoryState.socialProofEvents,
      },
    };
    return dump;
  },
};
