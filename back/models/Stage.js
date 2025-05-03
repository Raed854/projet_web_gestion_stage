const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const CompteRendu = require('./CompteRendu');
const Tache = require('./Tache');

const Stage = sequelize.define('Stage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  intitule: DataTypes.STRING,
  typeStage: {
    type: DataTypes.ENUM("Stage d'été", "PFE")
  },
  dateDebut: DataTypes.DATE,
  dateFin: DataTypes.DATE,
  description: DataTypes.STRING,
  statut: DataTypes.BOOLEAN
}, {
  tableName: 'stages',
  timestamps: false
});

// One Stage has many CompteRendus
Stage.hasMany(CompteRendu, {
  foreignKey: 'stageId',
  as: 'comptesRendus'
});
CompteRendu.belongsTo(Stage, {
  foreignKey: 'stageId',
  as: 'stage'
});

// One Stage has many Taches
Stage.hasMany(Tache, {
  foreignKey: 'stageId',
  as: 'taches'
});
Tache.belongsTo(Stage, {
  foreignKey: 'stageId',
  as: 'stage'
});

module.exports = Stage;