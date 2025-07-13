const bcrypt = require('bcrypt');
const sequelize = require('./db');

// Import models with associations
require('./models/index');
const User = require('./models/User');

async function createAdminUser() {
  try {
    // Connect to database and sync models
    await sequelize.sync();
    console.log('Database connection established.');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@admin.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Login credentials:');
      console.log('Email: admin@admin.com');
      console.log('Password: admin123');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = await User.create({
      nom: 'Admin',
      prenom: 'System',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      classe: null // Admin doesn't need a class
    });

    console.log('Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the function
createAdminUser();
