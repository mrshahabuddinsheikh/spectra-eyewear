import { FastifyPluginAsync } from 'fastify';
import { store } from '../db/store.js';

export const opticianAiRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/optician/chat', async (request, reply) => {
    const { message, faceShape } = request.body as any;

    if (!message || typeof message !== 'string') {
      return reply.code(400).send({ error: 'Message is required' });
    }

    const query = message.toLowerCase().trim();

    // Check for order tracking query (e.g. SP-2026-8492 or phone or "track SP-...")
    const orderMatch = query.match(/sp-2026-\d{4}/i);
    if (orderMatch) {
      const order = await store.getOrderByNumber(orderMatch[0].toUpperCase());
      if (order) {
        return reply.send({
          reply: `🔍 **Order Found: ${order.orderNumber}**\n\n• **Status:** ${order.status.toUpperCase()}\n• **Destination:** ${order.city}\n• **Courier:** ${order.courier || 'TCS'}${order.trackingNumber ? ` (Tracking: \`${order.trackingNumber}\`)` : ' (Booking pending)'}\n• **Total:** Rs. ${order.total.toLocaleString()} (Cash on Delivery)\n\nNeed assistance with your delivery rider? Reply anytime!`,
          recommendedFrames: [],
        });
      } else {
        return reply.send({
          reply: `I searched our system for reference \`${orderMatch[0].toUpperCase()}\` but could not locate it. Please double-check your order SMS or enter your 11-digit mobile number.`,
          recommendedFrames: [],
        });
      }
    }

    // Face shape questions
    if (query.includes('face') || query.includes('shape') || faceShape) {
      const targetShape = faceShape || (
        query.includes('round') ? 'round' :
        query.includes('square') ? 'square' :
        query.includes('oval') ? 'oval' :
        query.includes('diamond') ? 'diamond' : 'general'
      );

      if (targetShape === 'round') {
        return reply.send({
          reply: `For a **Round Face Shape**, the optical rule is to add strong horizontal contrast! Angular frames such as **Wayfarer**, **Hexagonal**, or **Square Browline** sharpen your soft contours and make your facial structure look longer and more defined. Avoid tiny round frames.`,
          recommendedFrames: ['wayfarer-bold-acetate', 'hexagonal-geometric-edge'],
          faceShapeTip: 'Choose wide, angular frames that sit slightly wider than your cheekbones.',
        });
      }

      if (targetShape === 'square') {
        return reply.send({
          reply: `For a **Square Face Shape** (prominent jawline and wide forehead), you want to soften angular features. **Round Vintage**, **Aviator Classic**, or **Cat-Eye** frames create wonderful visual balance by balancing out bold angles.`,
          recommendedFrames: ['round-classic-vintage', 'aviator-skymaster-titanium'],
          faceShapeTip: 'Select curved rims or teardrop aviator silhouettes to complement your jawline.',
        });
      }

      if (targetShape === 'oval') {
        return reply.send({
          reply: `Lucky you! An **Oval Face Shape** is universally balanced. You can confidently pull off almost any style: from dramatic **Cat-Eye** to bold **Wayfarers** or minimalist **Rimless Titanium Air** frames.`,
          recommendedFrames: ['wayfarer-bold-acetate', 'cat-eye-st-tropez-luxe', 'rimless-titanium-air-minimalist'],
          faceShapeTip: 'Look for frames that are as wide as or slightly wider than the broadest part of your face.',
        });
      }

      if (targetShape === 'diamond') {
        return reply.send({
          reply: `For a **Diamond Face Shape** (narrow forehead, dramatic high cheekbones, tapered chin), **Clubmaster Browline** and subtle **Cat-Eye** frames highlight your eyes and soften high cheekbones beautifully!`,
          recommendedFrames: ['clubmaster-retro-browline', 'cat-eye-st-tropez-luxe'],
          faceShapeTip: 'Browline frames bring focus upward and harmonize cheekbone width.',
        });
      }

      return reply.send({
        reply: `Tell me your face shape (**Round**, **Oval**, **Square**, or **Diamond**), and I will calculate the ideal lens width and bridge dimensions for your profile! You can also use our interactive 3D Customizer to test frame shapes in real time.`,
        recommendedFrames: ['wayfarer-bold-acetate', 'aviator-skymaster-titanium'],
      });
    }

    // Lens technology questions (Blue-cut, Polarized, Photochromic)
    if (query.includes('blue') || query.includes('screen') || query.includes('computer') || query.includes('laptop')) {
      return reply.send({
        reply: `💻 **Blue-Cut Computer Optics:**\nOur high-index blue-cut lenses feature a specialized multi-layer anti-reflective (AR) coating that filters 95% of harmful 415-455nm high-energy visible (HEV) blue light from phones and monitors. Ideal for coders, designers, gamers, and office professionals prone to dry eyes or sleep disruptions!`,
        recommendedFrames: ['round-classic-vintage', 'clubmaster-retro-browline'],
      });
    }

    if (query.includes('polar') || query.includes('sun') || query.includes('uv') || query.includes('glare') || query.includes('drive')) {
      return reply.send({
        reply: `☀️ **Polarized UV400 Technology:**\nStandard tinted sunglasses only dim light, whereas our polarized lenses use an optical micro-filter layer that blocks horizontal glare reflected off roads, car hoods, water, and sand. Experience razor-sharp clarity and zero squinting while driving under Pakistan's summer sun.`,
        recommendedFrames: ['aviator-skymaster-titanium', 'wayfarer-bold-acetate'],
      });
    }

    if (query.includes('photochromic') || query.includes('transition')) {
      return reply.send({
        reply: `🌗 **Photochromic Transition Lenses:**\nThese smart lenses stay crystal clear indoors (15% base tint) and automatically react to ambient UV rays outdoors, darkening to a deep 85% sun tint within 30 seconds. One pair for both office and driving!`,
        recommendedFrames: ['hexagonal-geometric-edge'],
      });
    }

    // Return policy & COD questions
    if (query.includes('return') || query.includes('exchange') || query.includes('warranty') || query.includes('refund')) {
      return reply.send({
        reply: `🛡️ **7-Day Hassle-Free Exchange Policy:**\nWe offer a 7-day no-questions-asked replacement policy across Pakistan. If the frame doesn't fit your face or you want a different color, simply WhatsApp our support team at **0300-SPECTRA** and our courier will swap it at your doorstep.`,
        recommendedFrames: [],
      });
    }

    if (query.includes('cod') || query.includes('cash') || query.includes('delivery') || query.includes('shipping')) {
      return reply.send({
        reply: `📦 **Cash on Delivery (COD) across Pakistan:**\n• **Shipping Fee:** Free delivery on orders above Rs. 3,000 (flat Rs. 200 below).\n• **Transit Times:** 24-48 hours in Karachi, Lahore, Islamabad/Rawalpindi; 2-3 business days for other cities via TCS & Leopards Courier.\n• **Payment:** Inspect your parcel and pay cash to the rider upon delivery.`,
        recommendedFrames: [],
      });
    }

    // Default optician guidance
    return reply.send({
      reply: `Hello! I am **Spectra AI Optician**. How can I help you today? I can recommend frames tailored to your face shape, explain our Blue-Cut vs Polarized lenses, check your Cash on Delivery tracking, or help you upload a prescription!`,
      recommendedFrames: ['wayfarer-bold-acetate', 'aviator-skymaster-titanium', 'round-classic-vintage'],
    });
  });
};
