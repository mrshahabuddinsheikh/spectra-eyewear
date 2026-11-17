import { FastifyPluginAsync } from 'fastify';
import { store } from '../db/store.js';

export const socialProofRoutes: FastifyPluginAsync = async (fastify) => {
  // Public endpoint for frontend toast
  fastify.get('/api/v1/social-proof', async (request, reply) => {
    const settings = await store.getSocialProofSettings();
    const customEvents = await store.getSocialProofEvents();
    const realOrders = await store.getOrders();

    let combinedEvents: any[] = [];

    // Real orders converted to social proof notifications
    const autoEvents = realOrders.slice(0, 10).map((o) => {
      const minutesAgo = Math.max(1, Math.round((Date.now() - new Date(o.createdAt).getTime()) / 60000));
      const timeStr = minutesAgo < 60 ? `${minutesAgo} min ago` : `${Math.round(minutesAgo / 60)} hours ago`;
      const firstItem = o.items?.[0];
      const itemName = firstItem?.name || 'Spectra Eyewear';
      const lensInfo = firstItem?.lensTint ? ` (${firstItem.lensTint})` : '';

      return {
        id: `auto-${o.id}`,
        customerName: o.customerName.split(' ')[0] || 'Someone',
        city: o.city,
        productName: `${itemName}${lensInfo}`,
        timeAgo: timeStr,
        isRealOrder: true,
      };
    });

    if (settings.mode === 'auto') {
      combinedEvents = autoEvents.length > 0 ? autoEvents : customEvents;
    } else if (settings.mode === 'custom') {
      combinedEvents = customEvents;
    } else {
      // Hybrid mode: Interleave auto and custom
      combinedEvents = [...autoEvents, ...customEvents];
    }

    return reply.send({
      settings,
      events: combinedEvents,
    });
  });

  // Admin: Get settings & custom events
  fastify.get('/api/v1/admin/social-proof', {
    onRequest: [fastify.authenticate],
  }, async () => {
    const settings = await store.getSocialProofSettings();
    const events = await store.getSocialProofEvents();
    return { settings, events };
  });

  // Admin: Update settings
  fastify.put('/api/v1/admin/social-proof/settings', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const body = request.body as any;
    const updated = await store.updateSocialProofSettings(body);
    return reply.send({ success: true, settings: updated });
  });

  // Admin: Add custom event
  fastify.post('/api/v1/admin/social-proof/events', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const body = request.body as any;
    if (!body.city || !body.productName) {
      return reply.code(400).send({ error: 'City and product name are required' });
    }

    const saved = await store.saveSocialProofEvent({
      id: body.id || `spe-${Date.now()}`,
      customerName: body.customerName || 'A Customer',
      city: body.city,
      productName: body.productName,
      timeAgo: body.timeAgo || 'Just now',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return reply.send({ success: true, event: saved });
  });
};
