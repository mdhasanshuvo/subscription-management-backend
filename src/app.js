const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const ApiError = require('./utils/ApiError');
const { successResponse, errorResponse } = require('./middlewares/responseFormatter');
const routes = require('./routes');
const getSwaggerSpec = require('./docs/swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Dynamic Swagger setup based on request host
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res) => {
  const host = req.get('host');
  const swaggerSpec = getSwaggerSpec(host);
  res.send(swaggerUi.generateHTML(swaggerSpec));
});
app.use('/api-docs/swagger.json', (req, res) => {
  const host = req.get('host');
  const swaggerSpec = getSwaggerSpec(host);
  res.json(swaggerSpec);
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
