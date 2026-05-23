const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');
const getSwaggerSpec = require('../src/docs/swagger');

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

  // Serve Swagger spec directly without middleware delay
  if (requestPath === '/api/swagger-spec.json') {
    const host = req.headers.host || 'localhost:5000';
    const swaggerSpec = getSwaggerSpec(host);
    return res.status(200).set('Content-Type', 'application/json').json(swaggerSpec);
  }

  // Serve Swagger UI directly without middleware delay
  if (requestPath === '/api-docs' || requestPath === '/api-docs/') {
    const host = req.headers.host || 'localhost:5000';
    const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    const specUrl = `${protocol}://${host}/api/swagger-spec.json`;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; background: #f6f7fb; }
    #swagger-ui { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"><\/script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: ${JSON.stringify(specUrl)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout'
      });
    };
  <\/script>
</body>
</html>`;
    return res.status(200).set('Content-Type', 'text/html').send(html);
  }

  // Only routes that actually touch MongoDB should establish a DB connection.
  const dbRoutePrefixes = ['/auth', '/plans', '/subscriptions', '/analytics', '/webhook'];
  const shouldConnectDatabase = dbRoutePrefixes.some((prefix) => requestPath.startsWith(prefix));

  if (shouldConnectDatabase) {
    await connectDatabase();
  }

  return handler(req, res);
};
