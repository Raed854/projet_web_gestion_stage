const Stage = require('../models/Stage');
const User = require('../models/User');
// CRUD operations
exports.createStage = async (req, res) => {
  try {
    const stage = await Stage.create(req.body);
    res.status(201).json(stage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStages = async (req, res) => {
  try {
    const stages = await Stage.findAll();
    res.status(200).json(stages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStageById = async (req, res) => {
  try {
    const stage = await Stage.findByPk(req.params.id);
    if (!stage) return res.status(404).send('Stage not found');
    res.status(200).json(stage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    const stage = await Stage.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(stage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStage = async (req, res) => {
  try {
    await Stage.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get stages by etudiantId
exports.getStagesByEtudiantId = async (req, res) => {
  try {
    const stages = await Stage.findAll({
      where: { etudiantId: req.params.etudiantId },
      include: [
        {
          model: User,
          as: 'etudiant',
          attributes: ['id', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'encadrant',
          attributes: ['id', 'nom', 'prenom']
        }
      ]
    });

    if (stages.length === 0) {
      return res.status(200).json([]); // Return empty array if no stages found
    }

    res.status(200).json(stages);
  } catch (error) {
    console.error('Error fetching stages by etudiant:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getStageProgress = async (req, res) => {
  try {
    const stage = await Stage.findByPk(req.params.id);
    if (!stage) return res.status(404).send('Stage not found');

    const Tache = require('../models/Tache');

    // Count total tasks for the stage
    const totalTasks = await Tache.count({
      where: { stageId: req.params.id }
    });

    // Count completed tasks (status === true/1)
    const completedTasks = await Tache.count({
      where: {
        stageId: req.params.id,
        statut: true
      }
    });

    if (totalTasks === 0) {
      return res.status(200).json({ progress: 0 }); // No tasks means 0% progress
    }

    // Calculate progress percentage
    let progress = (completedTasks / totalTasks) * 100;

    // Cap progress at 100%
    progress = Math.min(progress, 100);

    res.status(200).json({
      totalTasks,
      completedTasks,
      progress: Math.round(progress) // Round to nearest integer
    });

  } catch (error) {
    console.error('Error calculating stage progress:', error);
    res.status(400).json({ error: error.message });
  }
};