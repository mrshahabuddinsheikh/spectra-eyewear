import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.js';
import { productRoutes } from './routes/products.js';
import { orderRoutes } from './routes/orders.js';
import { reelRoutes } from './routes/reels.js';
import { socialProofRoutes } from './routes/social-proof.js';
import { opticianAiRoutes } from './routes/optician-ai.js';
import { backupRoutes } from './routes/backup.js';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Declare Types for Fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

// Health Check
fastify.get('/api/v1/health', async () => {
  return {
    status: 'ok',
    service: 'Spectra Eyewear Fastify Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
  };
});

export async function bootstrap() {
  // Register CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register JWT
  const jwtSecret = process.env.JWT_SECRET || 'spectra-super-secret-key-pk-2026';
  await fastify.register(jwt, {
    secret: jwtSecret,
  });

  // Decorate fastify with authenticate hook
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized: Invalid or expired access token' });
    }
  });

  // Register Module Routes
  await fastify.register(authRoutes);
  await fastify.register(productRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(reelRoutes);
  await fastify.register(socialProofRoutes);
  await fastify.register(opticianAiRoutes);
  await fastify.register(backupRoutes);

  // Server Listen
  const PORT = Number(process.env.PORT || 4000);
  const HOST = process.env.HOST || '0.0.0.0';

  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`⚡ Fastify Standalone API running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();

export { fastify };
