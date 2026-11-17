import { FastifyPluginAsync } from 'fastify';
import { store, memoryState } from '../db/store.js';

export const backupRoutes: FastifyPluginAsync = async (fastify) => {
  // One-click SQL / JSON bit-for-bit database snapshot download
  fastify.get('/api/v1/admin/backup/download', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const format = (request.query as any)?.format || 'sql';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    if (format === 'json') {
      const dump = store.generateBackupDump();
      reply.header('Content-Type', 'application/json');
      reply.header('Content-Disposition', `attachment; filename="spectra_backup_${timestamp}.json"`);
      return reply.send(JSON.stringify(dump, null, 2));
    }

    // Generate Bit-for-Bit SQL Dump
    let sqlDump = `-- Spectra Eyewear Bit-for-Bit MariaDB/MySQL Snapshot
-- Generated: ${new Date().toISOString()}
-- Monorepo Database Engine

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Table structure for table \`products\`
--
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` varchar(36) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`tagline\` varchar(255) DEFAULT NULL,
  \`description\` text DEFAULT NULL,
  \`base_price\` int(11) NOT NULL,
  \`compare_at_price\` int(11) DEFAULT NULL,
  \`frame_shape\` varchar(50) NOT NULL,
  \`frame_material\` varchar(50) NOT NULL,
  \`recommended_face_shapes\` text DEFAULT NULL,
  \`images\` json DEFAULT NULL,
  \`is_bestseller\` tinyint(1) DEFAULT 0,
  \`is_new\` tinyint(1) DEFAULT 0,
  \`is_active\` tinyint(1) DEFAULT 1,
  \`stock\` int(11) DEFAULT 50,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table \`products\`
--
`;

    for (const p of memoryState.products) {
      const escName = p.name.replace(/'/g, "''");
      const escTagline = (p.tagline || '').replace(/'/g, "''");
      const escDesc = (p.description || '').replace(/'/g, "''");
      const escImages = JSON.stringify(p.images || []).replace(/'/g, "''");
      sqlDump += `INSERT INTO \`products\` (\`id\`, \`name\`, \`slug\`, \`tagline\`, \`description\`, \`base_price\`, \`compare_at_price\`, \`frame_shape\`, \`frame_material\`, \`recommended_face_shapes\`, \`images\`, \`is_bestseller\`, \`is_new\`, \`is_active\`, \`stock\`) VALUES ('${p.id}', '${escName}', '${p.slug}', '${escTagline}', '${escDesc}', ${p.basePrice}, ${p.compareAtPrice || 'NULL'}, '${p.frameShape}', '${p.frameMaterial}', '${p.recommendedFaceShapes}', '${escImages}', ${p.isBestseller ? 1 : 0}, ${p.isNew ? 1 : 0}, ${p.isActive ? 1 : 0}, ${p.stock});\n`;
    }

    sqlDump += `\n--
-- Table structure for table \`orders\`
--
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` varchar(36) NOT NULL,
  \`order_number\` varchar(32) NOT NULL,
  \`customer_name\` varchar(255) NOT NULL,
  \`customer_phone\` varchar(50) NOT NULL,
  \`customer_email\` varchar(255) DEFAULT NULL,
  \`city\` varchar(100) NOT NULL,
  \`shipping_address\` text NOT NULL,
  \`subtotal\` int(11) NOT NULL,
  \`shipping_fee\` int(11) NOT NULL,
  \`discount\` int(11) DEFAULT 0,
  \`total\` int(11) NOT NULL,
  \`status\` varchar(50) DEFAULT 'pending',
  \`courier\` varchar(50) DEFAULT 'TCS',
  \`tracking_number\` varchar(100) DEFAULT NULL,
  \`payment_method\` varchar(50) DEFAULT 'COD',
  \`risk_score\` varchar(20) DEFAULT 'low',
  \`items\` json DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`order_number\` (\`order_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    for (const o of memoryState.orders) {
      const escName = o.customerName.replace(/'/g, "''");
      const escAddr = o.shippingAddress.replace(/'/g, "''");
      const escItems = JSON.stringify(o.items || []).replace(/'/g, "''");
      sqlDump += `INSERT INTO \`orders\` (\`id\`, \`order_number\`, \`customer_name\`, \`customer_phone\`, \`city\`, \`shipping_address\`, \`subtotal\`, \`shipping_fee\`, \`discount\`, \`total\`, \`status\`, \`courier\`, \`tracking_number\`, \`payment_method\`, \`risk_score\`, \`items\`) VALUES ('${o.id}', '${o.orderNumber}', '${escName}', '${o.customerPhone}', '${o.city}', '${escAddr}', ${o.subtotal}, ${o.shippingFee}, ${o.discount || 0}, ${o.total}, '${o.status}', '${o.courier || 'TCS'}', ${o.trackingNumber ? `'${o.trackingNumber}'` : 'NULL'}, '${o.paymentMethod}', '${o.riskScore}', '${escItems}');\n`;
    }

    sqlDump += `\nCOMMIT;\nSET FOREIGN_KEY_CHECKS=1;\n`;

    reply.header('Content-Type', 'application/sql');
    reply.header('Content-Disposition', `attachment; filename="spectra_backup_${timestamp}.sql"`);
    return reply.send(sqlDump);
  });
};
