/**
 * Universal Production Entry Point for cPanel, CloudLinux & Phusion Passenger
 * 
 * 1. Automatically spawns Fastify API on internal port 4000
 * 2. Binds Next.js frontend to Passenger port / socket or default port 3000
 * 3. Reverse proxies /api/v1 traffic directly to Fastify without CORS restrictions
 */

const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const INTERNAL_API_PORT = process.env.INTERNAL_API_PORT || 4000;
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Ensure Passenger restart directory exists
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

console.log('🚀 [Universal Server] Starting Spectra Eyewear Unified Host...');
console.log(`📍 Environment: NODE_ENV=${process.env.NODE_ENV || 'production'}`);
console.log(`🔌 Public Port/Socket: ${PORT}`);
console.log(`⚡ Internal API Port: ${INTERNAL_API_PORT}`);

// 1. Spawn Fastify Backend
const apiServerPath = path.join(__dirname, 'apps', 'api', 'dist', 'server.js');
let apiProcess = null;

if (fs.existsSync(apiServerPath)) {
  console.log(`📦 Launching standalone Fastify backend from: ${apiServerPath}`);
  apiProcess = spawn(process.execPath, [apiServerPath], {
    env: {
      ...process.env,
      PORT: String(INTERNAL_API_PORT),
      HOST: '127.0.0.1',
    },
    stdio: 'inherit',
  });

  apiProcess.on('error', (err) => {
    console.error('❌ Failed to spawn Fastify backend:', err);
  });

  apiProcess.on('exit', (code, signal) => {
    console.log(`⚠️ Fastify backend exited with code ${code} / signal ${signal}`);
  });
} else {
  console.warn(`⚠️ Warning: ${apiServerPath} not found. Ensure "npm run build:api" was executed.`);
}

// 2. Initialize Next.js Production App
const next = require('next');
const app = next({
  dev: false,
  dir: path.join(__dirname, 'apps', 'web'),
});
const handle = app.getRequestHandler();

// Wait for Next.js to prepare, then start HTTP proxy server
app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    // Reverse proxy /api/v1 directly to Fastify
    if (req.url && req.url.startsWith('/api/v1')) {
      const options = {
        hostname: '127.0.0.1',
        port: INTERNAL_API_PORT,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          'x-forwarded-host': req.headers.host || '',
          'x-forwarded-proto': req.headers['x-forwarded-proto'] || 'http',
        },
      };

      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy error to Fastify:', err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Fastify API gateway unavailable', message: err.message }));
        }
      });

      req.pipe(proxyReq, { end: true });
      return;
    }

    // Pass everything else to Next.js
    handle(req, res);
  });

  // Support numeric port or Phusion Passenger named pipe / UNIX socket
  if (typeof PORT === 'string' && isNaN(Number(PORT))) {
    server.listen(PORT, () => {
      console.log(`✅ Spectra Eyewear listening on socket: ${PORT}`);
    });
  } else {
    server.listen(Number(PORT), HOST, () => {
      console.log(`✅ Spectra Eyewear listening on http://${HOST}:${PORT}`);
    });
  }

  // Graceful shutdown
  const shutdown = () => {
    console.log('🛑 Graceful shutdown initiated...');
    if (apiProcess) {
      apiProcess.kill('SIGTERM');
    }
    server.close(() => {
      console.log('👋 Universal Server stopped');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}).catch((err) => {
  console.error('❌ Failed to prepare Next.js app:', err);
  if (apiProcess) apiProcess.kill();
  process.exit(1);
});
