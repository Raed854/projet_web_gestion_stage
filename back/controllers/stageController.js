const Stage = require('../models/Stage');

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