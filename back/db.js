const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // e.g. 'testdb'
  process.env.DB_USER,      // e.g. 'root'
  process.env.DB_PASSWORD,  // e.g. 'password'
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql', // 👈 REQUIRED
    logging: false, // optional: turns off SQL logging
  }
);

module.exports = sequelize;
