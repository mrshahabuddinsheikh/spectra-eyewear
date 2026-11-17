import { FastifyPluginAsync } from 'fastify';
import { store } from '../db/store.js';

// Phone normalization for Pakistan
export function normalizePakPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) {
    return '0' + digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith('3')) {
    return '0' + digits;
  }
  return digits;
}

// Risk Analysis Engine for COD Orders
export function evaluateCodRisk(order: {
  customerPhone: string;
  customerName: string;
  shippingAddress: string;
  city: string;
  total: number;
  existingOrders?: any[];
}): { riskScore: 'low' | 'medium' | 'high'; riskReason: string } {
  const cleanPhone = normalizePakPhone(order.customerPhone);
  
  // 1. Repetitive / Fake digits check
  if (/^03(\d)\1{7}$/.test(cleanPhone) || cleanPhone === '03000000000' || cleanPhone === '03123456789') {
    return {
      riskScore: 'high',
      riskReason: 'Suspicious repetitive/dummy mobile number pattern',
    };
  }

  // 2. Length check for Pak mobile
  if (!/^03[0-4]\d{8}$/.test(cleanPhone)) {
    return {
      riskScore: 'high',
      riskReason: 'Invalid Pakistani mobile format (Must start with 03xx and contain 11 digits)',
    };
  }

  // 3. Short / Vague address check
  if (order.shippingAddress.trim().length < 12) {
    return {
      riskScore: 'medium',
      riskReason: 'Incomplete or brief address (courier may struggle with delivery)',
    };
  }

  // 4. Name check
  if (order.customerName.trim().length < 3 || /test|fake|asdf|xyz/i.test(order.customerName)) {
    return {
      riskScore: 'high',
      riskReason: 'Suspicious or placeholder customer name',
    };
  }

  // 5. High value COD cart check
  if (order.total > 15000) {
    return {
      riskScore: 'medium',
      riskReason: 'High ticket COD volume (> Rs. 15,000) - phone confirmation advised before dispatch',
    };
  }

  return {
    riskScore: 'low',
    riskReason: 'Clean phone format, complete address & valid city delivery profile',
  };
}

export const orderRoutes: FastifyPluginAsync = async (fastify) => {
  // 1-Page Frictionless COD Checkout
  fastify.post('/api/v1/orders/checkout', async (request, reply) => {
    const body = request.body as any;

    if (!body.customerName || !body.customerPhone || !body.city || !body.shippingAddress || !body.items || body.items.length === 0) {
      return reply.code(400).send({ error: 'Please provide all required checkout details' });
    }

    const cleanPhone = normalizePakPhone(body.customerPhone);
    if (cleanPhone.length < 10) {
      return reply.code(400).send({ error: 'Please enter a valid Pakistani mobile number (e.g. 0300 1234567)' });
    }

    // Subtotal calculation
    let subtotal = 0;
    const validatedItems = body.items.map((item: any) => {
      const price = Number(item.price) || 2999;
      const qty = Number(item.quantity) || 1;
      subtotal += price * qty;
      return {
        productId: item.productId,
        name: item.name || 'Custom Spectra Frame',
        frameShape: item.frameShape || 'wayfarer',
        frameMaterial: item.frameMaterial || 'acetate',
        lensTint: item.lensTint || 'polarized',
        frameColor: item.frameColor || 'Black',
        quantity: qty,
        price,
        image: item.image,
      };
    });

    const discount = Number(body.discount) || 0;
    // Shipping logic: Free shipping over Rs. 3,000, otherwise flat Rs. 200
    const shippingFee = subtotal >= 3000 ? 0 : 200;
    const total = Math.max(0, subtotal + shippingFee - discount);

    // Evaluate COD Risk
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
      customerEmail: body.customerEmail ? body.customerEmail.trim() : null,
      city: body.city.trim(),
      shippingAddress: body.shippingAddress.trim(),
      specialInstructions: body.specialInstructions ? body.specialInstructions.trim() : null,
      prescriptionUrl: body.prescriptionUrl || null,
      prescriptionData: body.prescriptionData || null,
      subtotal,
      shippingFee,
      discount,
      total,
      status: 'pending',
      courier: 'TCS',
      trackingNumber: null,
      paymentMethod: 'COD',
      riskScore,
      riskReason,
      source: body.source || 'web',
      items: validatedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await store.createOrder(newOrder);

    // Also register a social proof event from this real order
    await store.saveSocialProofEvent({
      id: `spe-${Date.now()}`,
      customerName: body.customerName.split(' ')[0] || 'Someone',
      city: body.city,
      productName: validatedItems[0]?.name || 'Spectra Eyewear',
      timeAgo: 'Just now',
      isActive: true,
    });

    return reply.code(201).send({
      success: true,
      order: newOrder,
      message: 'Order placed successfully! Cash on Delivery confirmed.',
    });
  });

  // Live Order Tracking Endpoint
  fastify.get('/api/v1/orders/track/:orderNumber', async (request, reply) => {
    const { orderNumber } = request.params as { orderNumber: string };
    const order = await store.getOrderByNumber(orderNumber);

    if (!order) {
      return reply.code(404).send({ error: 'Order not found. Please check your order reference number.' });
    }

    // Milestones mapping
    const milestones = [
      { key: 'placed', label: 'Order Placed', completed: true, timestamp: order.createdAt },
      { key: 'confirmed', label: 'Confirmed & Prescription Verified', completed: ['confirmed', 'shipped', 'delivered'].includes(order.status) },
      { key: 'dispatched', label: `Handed to Courier (${order.courier || 'TCS'})`, completed: ['shipped', 'delivered'].includes(order.status) },
      { key: 'transit', label: 'In Transit to Destination City', completed: ['shipped', 'delivered'].includes(order.status) },
      { key: 'out_for_delivery', label: 'Out for Delivery (Rider Assigned)', completed: order.status === 'delivered' },
      { key: 'delivered', label: 'Delivered · Cash Collected', completed: order.status === 'delivered' },
    ];

    return reply.send({
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      city: order.city,
      total: order.total,
      paymentMethod: order.paymentMethod,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
      items: order.items,
      milestones,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  });

  // Admin Order Desk: List all orders
  fastify.get('/api/v1/admin/orders', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const orders = await store.getOrders();
    return { orders };
  });

  // Admin Order Desk: Update status & assign courier
  fastify.patch('/api/v1/admin/orders/:orderNumber/status', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { orderNumber } = request.params as { orderNumber: string };
    const { status, courier, trackingNumber } = request.body as any;

    if (!status) {
      return reply.code(400).send({ error: 'Status is required' });
    }

    const updated = await store.updateOrderStatus(orderNumber, status, courier, trackingNumber);
    if (!updated) {
      return reply.code(404).send({ error: 'Order not found' });
    }

    return reply.send({ success: true, order: updated });
  });

  // Admin Risk Analysis Overview
  fastify.get('/api/v1/admin/orders/risk-analysis', {
    onRequest: [fastify.authenticate],
  }, async () => {
    const orders = await store.getOrders();
    const highRisk = orders.filter(o => o.riskScore === 'high');
    const mediumRisk = orders.filter(o => o.riskScore === 'medium');
    const lowRisk = orders.filter(o => o.riskScore === 'low');

    return {
      summary: {
        totalOrders: orders.length,
        highRiskCount: highRisk.length,
        mediumRiskCount: mediumRisk.length,
        lowRiskCount: lowRisk.length,
        fraudPreventionRate: `${Math.round(((orders.length - highRisk.length) / (orders.length || 1)) * 100)}%`,
      },
      flaggedOrders: highRisk,
    };
  });
};
