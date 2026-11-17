import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

async function build() {
  console.log('⚡ Compiling Fastify standalone server bundle with esbuild...');
  
  // Main server bundle
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/server.js',
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    sourcemap: true,
    minify: false,
    external: [
      'mysql2',
      'bcryptjs'
    ],
    logLevel: 'info',
  });

  // Seed bundle
  await esbuild.build({
    entryPoints: ['src/db/seed.ts'],
    outfile: 'dist/seed.js',
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    sourcemap: false,
    external: [
      'mysql2',
      'bcryptjs'
    ],
    logLevel: 'info',
  });

  console.log('✅ Fastify standalone compilation complete: dist/server.js & dist/seed.js');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
