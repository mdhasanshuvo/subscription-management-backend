const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

for (const envName of requiredEnvVars) {
  if (!process.env[envName]) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }
}

module.exports = {
  port: process.env.PORT || 5000,
  appName: process.env.APP_NAME || 'Subscription & Billing API System',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  deploymentUrl: process.env.DEPLOYMENT_URL || '',
};
