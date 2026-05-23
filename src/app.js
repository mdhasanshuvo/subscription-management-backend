const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const ApiError = require('./utils/ApiError');
const { successResponse, errorResponse } = require('./middlewares/responseFormatter');
const routes = require('./routes');
const getSwaggerSpec = require('./docs/swagger');

const app = express();

// Required for proxy environments like Vercel so req.ip is resolved correctly.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health',
  }),
);
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Dynamic Swagger API endpoint
app.get('/api/swagger-spec.json', (req, res) => {
  const host = req.get('host') || 'localhost:5000';
  const swaggerSpec = getSwaggerSpec(host);
  res.json(swaggerSpec);
});

// Swagger UI endpoint
app.get('/api-docs', (req, res) => {
  const host = req.get('host') || 'localhost:5000';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const specUrl = `${protocol}://${host}/api/swagger-spec.json`;

  res.type('html').send(`<!DOCTYPE html>
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
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
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
  </script>
</body>
</html>`);
});
app.use('/', routes);

app.get('/health', (req, res) => {
  res.status(200).json(successResponse('Server is healthy', { uptime: process.uptime() }));
});

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const details = err.details || null;

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json(errorResponse(message, details, statusCode));
});

module.exports = app;
