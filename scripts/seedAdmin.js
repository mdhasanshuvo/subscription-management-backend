require('dotenv').config();

const connectDatabase = require('../src/config/database');
const User = require('../src/models/User');

async function seedAdmin() {
  await connectDatabase();

  const name = process.env.ADMIN_SEED_NAME || 'System Admin';
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.role = 'Admin';
    existingAdmin.isActive = true;
    existingAdmin.password = password;
    await existingAdmin.save();
    console.log(`Admin user updated: ${email}`);
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: 'Admin',
  });

  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user', error);
  process.exit(1);
});
