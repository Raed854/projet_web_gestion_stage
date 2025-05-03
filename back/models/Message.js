const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  destinataire: {
    type: DataTypes.INTEGER
  },
  date: DataTypes.DATE,
  contenu: DataTypes.STRING
}, {
  tableName: 'messages',
  timestamps: false
});

module.exports = Message;