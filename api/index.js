const serverless = require('serverless-http');
const app = require('../src/app');
const connectDatabase = require('../src/config/database');

const handler = serverless(app);

module.exports = async function vercelHandler(req, res) {
	await connectDatabase();
	return handler(req, res);
};
