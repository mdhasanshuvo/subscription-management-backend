const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');

const handler = serverless(app);
const publicPaths = ['/health', '/api-docs'];

module.exports = async function vercelHandler(req, res) {
  const requestPath = req.url || '';

  if (!publicPaths.some((path) => requestPath.startsWith(path))) {
    await connectDatabase();
  }

  return handler(req, res);
};
