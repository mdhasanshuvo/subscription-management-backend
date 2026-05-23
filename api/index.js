const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');

const handler = serverless(app);

module.exports = async function vercelHandler(req, res) {
  const requestPath = req.url || '';

  if (requestPath.startsWith('/health')) {
    return res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: {
        uptime: process.uptime(),
      },
    });
  }

  if (!requestPath.startsWith('/api-docs')) {
    await connectDatabase();
  }

  return handler(req, res);
};
