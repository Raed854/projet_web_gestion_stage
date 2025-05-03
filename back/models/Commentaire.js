const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Commentaire = sequelize.define('Commentaire', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contenu: DataTypes.STRING,
  date: DataTypes.DATE
}, {
  tableName: 'commentaires',
  timestamps: false
});

module.exports = Commentaire;