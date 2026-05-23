const app = require('./app');
const connectDatabase = require('./config/database');
const { port } = require('./config/env');

async function bootstrap() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
