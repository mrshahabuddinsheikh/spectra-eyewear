import { FastifyPluginAsync } from 'fastify';
import { store } from '../db/store.js';
import { evaluateCodRisk, normalizePakPhone } from './orders.js';

export const reelRoutes: FastifyPluginAsync = async (fastify) => {
  // Public list of active reels
  fastify.get('/api/v1/reels', async (request, reply) => {
    const reels = await store.getReels();
    return reply.send({ reels });
  });

  // Like a reel
  fastify.post('/api/v1/reels/:id/like', async (request, reply) => {
    const { id } = request.params as { id: string };
    const likesCount = await store.likeReel(id);
    return reply.send({ success: true, likesCount });
  });

  // Fast Buy COD directly from the reel modal!
  fastify.post('/api/v1/reels/fast-buy', async (request, reply) => {
    const body = request.body as any;

    if (!body.customerName || !body.customerPhone || !body.city || !body.shippingAddress || !body.productId) {
      return reply.code(400).send({ error: 'Please provide all required details for Fast Buy' });
    }

    const cleanPhone = normalizePakPhone(body.customerPhone);
    if (cleanPhone.length < 10) {
      return reply.code(400).send({ error: 'Please enter a valid mobile number (e.g. 0300 1234567)' });
    }

    const product = await store.getProductById(body.productId);
    const price = product ? product.basePrice : Number(body.price || 2999);
    const shippingFee = price >= 3000 ? 0 : 200;
    const total = price + shippingFee;

    const { riskScore, riskReason } = evaluateCodRisk({
      customerPhone: cleanPhone,
      customerName: body.customerName,
      shippingAddress: body.shippingAddress,
      city: body.city,
      total,
    });

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SP-2026-${randomSuffix}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: body.customerName.trim(),
      customerPhone: cleanPhone,
      customerEmail: null,
      city: body.city.trim(),
      shippingAddress: body.shippingAddress.trim(),
      specialInstructions: 'Fast Buy from Shoppable Reel',
      prescriptionUrl: null,
      prescriptionData: null,
      subtotal: price,
      shippingFee,
      discount: 0,
      total,
      status: 'pending',
      courier: 'TCS',
      trackingNumber: null,
      paymentMethod: 'COD',
      riskScore,
      riskReason,
      source: 'reels',
      items: [
        {
          productId: body.productId,
          name: product?.name || body.productName || 'Spectra Eyewear',
          frameShape: product?.frameShape || 'wayfarer',
          frameMaterial: product?.frameMaterial || 'acetate',
          lensTint: body.lensTint || 'polarized',
          frameColor: body.frameColor || 'Black',
          quantity: 1,
          price,
          image: product?.images?.[0],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await store.createOrder(newOrder);

    // Social proof trigger
    await store.saveSocialProofEvent({
      id: `spe-${Date.now()}`,
      customerName: body.customerName.split(' ')[0] || 'Someone',
      city: body.city,
      productName: product?.name || 'Spectra Eyewear',
      timeAgo: 'Just now',
      isActive: true,
    });

    return reply.code(201).send({
      success: true,
      orderNumber: newOrder.orderNumber,
      order: newOrder,
      message: 'Fast Buy order confirmed! Cash on Delivery dispatched.',
    });
  });

  // Admin: Get all reels
  fastify.get('/api/v1/admin/reels', {
    onRequest: [fastify.authenticate],
  }, async () => {
    const reels = await store.getAllReelsAdmin();
    return { reels };
  });

  // Admin: Create or edit reel
  fastify.post('/api/v1/admin/reels', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const body = request.body as any;
    if (!body.title || !body.videoUrl) {
      return reply.code(400).send({ error: 'Title and Video URL are required' });
    }

    const saved = await store.saveReel({
      id: body.id || `reel-${Date.now()}`,
      title: body.title,
      videoUrl: body.videoUrl,
      posterUrl: body.posterUrl || '',
      productId: body.productId || null,
      productName: body.productName || 'Spectra Frame',
      productPrice: body.productPrice ? Number(body.productPrice) : 2999,
      likesCount: body.likesCount ? Number(body.likesCount) : 1000,
      sharesCount: body.sharesCount ? Number(body.sharesCount) : 50,
      badgeText: body.badgeText || 'Verified Purchase',
      reviews: body.reviews || [],
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      createdAt: new Date(),
    });

    return reply.send({ success: true, reel: saved });
  });
};
