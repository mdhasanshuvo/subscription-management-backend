const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');

const handler = serverless(app);

module.exports = async function vercelHandler(req, res) {
  const requestPath = (req.url || req.path || req.originalUrl || '').split('?')[0].toLowerCase();

  if (requestPath === '/health' || requestPath.endsWith('/health')) {
    return res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: {
        uptime: process.uptime(),
      },
    });
  }

  // Only routes that actually touch MongoDB should establish a DB connection.
  const dbRoutePrefixes = ['/auth', '/plans', '/subscriptions', '/analytics', '/webhook'];
  const shouldConnectDatabase = dbRoutePrefixes.some((prefix) => requestPath.startsWith(prefix));

  if (shouldConnectDatabase) {
    await connectDatabase();
  }

  return handler(req, res);
};
