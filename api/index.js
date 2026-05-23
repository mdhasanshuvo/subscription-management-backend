const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');

const handler = serverless(app);

module.exports = async function vercelHandler(req, res) {
  const requestPathRaw = req.url || req.path || '';
  const requestPath = requestPathRaw.startsWith('http')
    ? new URL(requestPathRaw).pathname
    : requestPathRaw.split('?')[0];

  if (requestPath.startsWith('/health')) {
    return res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: {
        uptime: process.uptime(),
      },
    });
  }

  if (!requestPath.startsWith('/api-docs') && !requestPath.startsWith('/api/swagger-spec.json')) {
    await connectDatabase();
  }

  return handler(req, res);
};
