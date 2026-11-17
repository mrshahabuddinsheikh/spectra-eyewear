import { getDb, closeDb } from './connection.js';
import { memoryState } from './store.js';
import * as schema from './schema.js';
import { eq } from 'drizzle-orm';

export async function runSeed() {
  console.log('🌱 [Seed] Starting idempotent database seed...');

  const { db, isRealDb } = await getDb();

  if (!isRealDb || !db) {
    console.log('⚡ [Seed] In-memory persistence initialized with default products, reels, and admin user.');
    console.log('✅ Seed completed in memory mode.');
    return;
  }

  try {
    // 1. Seed Admin User
    const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.email, 'admin@spectra.pk'));
    if (existingAdmin.length === 0) {
      console.log('👤 Seeding default admin user: admin@spectra.pk / admin123');
      await db.insert(schema.users).values(memoryState.users[0]);
    } else {
      console.log('✓ Admin user already exists.');
    }

    // 2. Seed Products
    for (const product of memoryState.products) {
      const existingProduct = await db.select().from(schema.products).where(eq(schema.products.slug, product.slug));
      if (existingProduct.length === 0) {
        console.log(`🕶️ Seeding product: ${product.name}`);
        await db.insert(schema.products).values(product);
      }
    }

    // 3. Seed Reels
    for (const reel of memoryState.reels) {
      const existingReel = await db.select().from(schema.reels).where(eq(schema.reels.id, reel.id));
      if (existingReel.length === 0) {
        console.log(`📱 Seeding reel: ${reel.title}`);
        await db.insert(schema.reels).values(reel);
      }
    }

    console.log('✅ Idempotent database seed completed successfully!');
  } catch (err: any) {
    console.error('❌ Error during database seed:', err.message);
  } finally {
    await closeDb();
  }
}

// Execute directly if run via CLI
if (process.argv[1]?.includes('seed')) {
  runSeed().then(() => {
    process.exit(0);
  });
}
