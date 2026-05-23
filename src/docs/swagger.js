const { deploymentUrl, appName } = require('../config/env');

const getSwaggerSpec = (host) => {
  // Detect if running on localhost
  const isLocalhost = host && (host.includes('localhost') || host.includes('127.0.0.1'));
  const serverUrl = isLocalhost ? `http://${host}` : (deploymentUrl || 'http://localhost:5000');

  return {
    openapi: '3.0.3',
    info: {
      title: appName,
      version: '1.0.0',
      description: 'Subscription and billing backend API for SaaS-style subscription management.',
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {},
        },
      },
      UserAuth: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['User', 'Admin'] },
            },
          },
        },
      },
      Plan: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          planName: { type: 'string' },
          price: { type: 'number' },
          durationInDays: { type: 'number' },
          features: { type: 'array', items: { type: 'string' } },
          activeStatus: { type: 'boolean' },
        },
      },
      Subscription: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          plan: { $ref: '#/components/schemas/Plan' },
          priceAtPurchase: { type: 'number' },
          startDate: { type: 'string', format: 'date-time' },
          expiryDate: { type: 'string', format: 'date-time' },
          status: { type: 'string' },
          paymentStatus: { type: 'string' },
          autoRenew: { type: 'boolean' },
        },
      },
      Analytics: {
        type: 'object',
        properties: {
          totalUsers: { type: 'number' },
          totalActiveSubscriptions: { type: 'number' },
          totalRevenue: { type: 'number' },
          expiredSubscriptions: { type: 'number' },
          subscriptionsByPlan: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                planId: { type: 'string' },
                planName: { type: 'string' },
                count: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'User created' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Logged in' } },
      },
    },
    '/auth/me': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'Current user profile',
        responses: { 200: { description: 'Current user' } },
      },
    },
    '/plans': {
      get: {
        summary: 'List active plans',
        responses: { 200: { description: 'List of plans' } },
      },
      post: {
        security: [{ bearerAuth: [] }],
        summary: 'Create plan (admin)',
        responses: { 201: { description: 'Plan created' } },
      },
    },
    '/plans/admin/all': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'List all plans (admin)',
        responses: { 200: { description: 'List of plans' } },
      },
    },
    '/plans/{id}': {
      put: {
        security: [{ bearerAuth: [] }],
        summary: 'Update plan (admin)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Plan updated' } },
      },
      delete: {
        security: [{ bearerAuth: [] }],
        summary: 'Deactivate plan (admin)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Plan deactivated' } },
      },
    },
    '/subscriptions/purchase': {
      post: {
        security: [{ bearerAuth: [] }],
        summary: 'Purchase subscription',
        responses: { 201: { description: 'Subscription created' } },
      },
    },
    '/subscriptions/upgrade': {
      post: {
        security: [{ bearerAuth: [] }],
        summary: 'Upgrade subscription',
        responses: { 201: { description: 'Subscription upgraded' } },
      },
    },
    '/subscriptions/downgrade': {
      post: {
        security: [{ bearerAuth: [] }],
        summary: 'Downgrade subscription',
        responses: { 201: { description: 'Subscription downgraded' } },
      },
    },
    '/subscriptions/cancel': {
      patch: {
        security: [{ bearerAuth: [] }],
        summary: 'Cancel active subscription',
        responses: { 200: { description: 'Subscription cancelled' } },
      },
    },
    '/subscriptions/me/history': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'Subscription history',
        responses: { 200: { description: 'History list' } },
      },
    },
    '/subscriptions/me/current': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'Current active subscription',
        responses: { 200: { description: 'Current subscription' } },
      },
    },
    '/subscriptions/admin/all': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'List all subscriptions (admin)',
        responses: { 200: { description: 'All subscriptions' } },
      },
    },
    '/analytics/admin/dashboard': {
      get: {
        security: [{ bearerAuth: [] }],
        summary: 'Admin analytics dashboard',
        responses: { 200: { description: 'Analytics summary' } },
      },
    },
    '/webhook/payment-update': {
      post: {
        summary: 'Process payment webhook update',
        parameters: [
          {
            name: 'x-webhook-secret',
            in: 'header',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { 200: { description: 'Webhook processed' } },
      },
    },
  },
  };
};

module.exports = getSwaggerSpec;
