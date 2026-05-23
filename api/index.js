const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');

const handler = serverless(app);

module.exports = async function vercelHandler(req, res) {
  const requestPath = req.url || '';

  if (requestPath.includes('/health')) {
    return res.status(200).json({
      success: true,
      message: 'Server is healthy',
      data: {
        uptime: process.uptime(),
      },
    });
  }

  const isSwaggerRequest = requestPath.includes('/api-docs') || requestPath.includes('/api/swagger-spec.json');

  if (!isSwaggerRequest) {
    await connectDatabase();
  }

  return handler(req, res);
};
