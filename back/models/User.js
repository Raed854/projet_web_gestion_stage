const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  classe: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'utilisateurs',
  timestamps: false
});

const Stage = require('./Stage');
const Message = require('./Message');

// A Utilisateur (Etudiant) can effectuer many Stages
User.hasMany(Stage, {
  foreignKey: 'etudiantId',
  as: 'stagesEffectues'
});
Stage.belongsTo(User, {
  foreignKey: 'etudiantId',
  as: 'etudiant'
});

// A Utilisateur (Encadrant) can encadrer many Stages
User.hasMany(Stage, {
  foreignKey: 'encadrantId',
  as: 'stagesEncadres'
});
Stage.belongsTo(User, {
  foreignKey: 'encadrantId',
  as: 'encadrant'
});

// A Utilisateur can send many Messages
User.hasMany(Message, {
  foreignKey: 'destinataire',
  as: 'messagesRecus'
});
Message.belongsTo(User, {
  foreignKey: 'destinataire',
  as: 'utilisateur'
});

module.exports = User;
