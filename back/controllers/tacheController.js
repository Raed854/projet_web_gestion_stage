const Tache = require('../models/Tache');
const Stage = require('../models/Stage');

// CRUD operations
exports.createTache = async (req, res) => {
  try {
    const tache = await Tache.create(req.body);
    res.status(201).json(tache);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTaches = async (req, res) => {
  try {
    const taches = await Tache.findAll();
    res.status(200).json(taches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTacheById = async (req, res) => {
  try {
    const tache = await Tache.findByPk(req.params.id);
    if (!tache) return res.status(404).send('Tache not found');
    res.status(200).json(tache);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTache = async (req, res) => {
  try {
    const tache = await Tache.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(tache);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTache = async (req, res) => {
  try {
    await Tache.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTachesByStageId = async (req, res) => {
  try {
    const taches = await Tache.findAll({
      where: { stageId: req.params.stageId }
    });

    if (taches.length === 0) return res.status(404).send('No taches found for this stageId');

    res.status(200).json(taches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTachesByEtudiantId = async (req, res) => {
  try {
    const taches = await Tache.findAll({
      include: [{
        model: Stage,
        as: 'stage',
        where: { etudiantId: req.params.etudiantId },
        attributes: ['id', 'intitule'] // Only include relevant stage info
      }]
    });

    if (taches.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(taches);
  } catch (error) {
    console.error('Error fetching taches by etudiant:', error);
    res.status(400).json({ error: error.message });
  }
};