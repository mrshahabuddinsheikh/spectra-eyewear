import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { store } from '../db/store.js';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;

    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    const user = await store.findUserByEmail(email);
    if (!user) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const token = fastify.jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      { expiresIn: '7d' }
    );

    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });

  fastify.get('/api/v1/auth/me', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    return { user: (request as any).user };
  });
};
