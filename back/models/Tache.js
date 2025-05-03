const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Tache = sequelize.define('Tache', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: DataTypes.STRING,
  intitule: DataTypes.STRING,
  description: DataTypes.STRING,
  ddl: DataTypes.DATE,
  statut: DataTypes.BOOLEAN
}, {
  tableName: 'taches',
  timestamps: false
});

module.exports = Tache;