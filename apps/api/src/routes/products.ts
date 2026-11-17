import { FastifyPluginAsync } from 'fastify';
import { store } from '../db/store.js';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  // Public list
  fastify.get('/api/v1/products', async (request, reply) => {
    const products = await store.getProducts();
    return reply.send({ products });
  });

  // Public single product by slug
  fastify.get('/api/v1/products/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const product = await store.getProductBySlug(slug);
    if (!product) {
      return reply.code(404).send({ error: 'Product not found' });
    }
    return reply.send({ product });
  });

  // Admin list
  fastify.get('/api/v1/admin/products', {
    onRequest: [fastify.authenticate],
  }, async () => {
    const products = await store.getAllProductsAdmin();
    return { products };
  });

  // Admin save (create/update)
  fastify.post('/api/v1/admin/products', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const body = request.body as any;
    if (!body.name || !body.basePrice || !body.frameShape || !body.frameMaterial) {
      return reply.code(400).send({ error: 'Missing required product fields' });
    }

    const id = body.id || `prd-${Date.now()}`;
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const saved = await store.saveProduct({
      id,
      name: body.name,
      slug,
      tagline: body.tagline || '',
      description: body.description || '',
      basePrice: Number(body.basePrice),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      frameShape: body.frameShape,
      frameMaterial: body.frameMaterial,
      recommendedFaceShapes: body.recommendedFaceShapes || 'round,oval,square',
      images: body.images || ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
      isBestseller: Boolean(body.isBestseller),
      isNew: Boolean(body.isNew),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      stock: body.stock !== undefined ? Number(body.stock) : 50,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    });

    return reply.send({ success: true, product: saved });
  });

  // Admin delete
  fastify.delete('/api/v1/admin/products/:id', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await store.deleteProduct(id);
    return reply.send({ success: true });
  });
};
