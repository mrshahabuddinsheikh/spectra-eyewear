import { FastifyPluginAsync } from 'fastify';
import { exec } from 'child_process';
import path from 'path';

export const deployRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/deploy-webhook', async (request, reply) => {
    const token =
      (request.headers['x-deploy-token'] as string) || (request.query as any)?.token;
    const expected = process.env.DEPLOY_TOKEN || 'spectra_secure_deploy_2026';

    if (!token || token !== expected) {
      return reply.code(403).send({ error: 'Forbidden: Invalid deployment token' });
    }

    // Determine application root directory
    const appRoot = path.resolve(__dirname, '..', '..', '..');
    const releaseUrl =
      'https://github.com/mrshahabuddinsheikh/spectra-eyewear/releases/download/latest/spectra-release.tar.gz';

    // Command to download verified pre-built bundle, extract, and touch restart
    const cmd = `cd "${appRoot}" && curl -s -L "${releaseUrl}" -o spectra-release.tar.gz && tar -xzf spectra-release.tar.gz && rm -f spectra-release.tar.gz && mkdir -p tmp && touch tmp/restart.txt`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Auto-deploy error:', error.message);
      } else {
        console.log('✅ Auto-deploy extracted and Passenger restart triggered:', stdout);
      }
    });

    return reply.send({
      success: true,
      message: 'Automated deployment triggered. Release downloading and server reloading.',
      timestamp: new Date().toISOString(),
    });
  });
};
