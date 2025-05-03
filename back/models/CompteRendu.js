const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Commentaire = require('./Commentaire');

const CompteRendu = sequelize.define('CompteRendu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: DataTypes.STRING,
  type: {
    type: DataTypes.ENUM('Rapport', 'Livrable')
  },
  statut: {
    type: DataTypes.ENUM('Accepté', 'Refusé', 'En attente')
  }
}, {
  tableName: 'compte_rendus',
  timestamps: false
});

// One CompteRendu has one Commentaire
CompteRendu.hasOne(Commentaire, {
  foreignKey: 'compteRenduId',
  as: 'commentaire'
});
Commentaire.belongsTo(CompteRendu, {
  foreignKey: 'compteRenduId',
  as: 'compteRendu'
});

module.exports = CompteRendu;