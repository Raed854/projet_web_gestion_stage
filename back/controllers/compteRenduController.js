const CompteRendu = require('../models/CompteRendu');

// CRUD operations
exports.createCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.create(req.body);
    res.status(201).json(compteRendu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCompteRendus = async (req, res) => {
  try {
    const compteRendus = await CompteRendu.findAll();
    res.status(200).json(compteRendus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCompteRenduById = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) return res.status(404).send('CompteRendu not found');
    res.status(200).json(compteRendu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(compteRendu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCompteRendu = async (req, res) => {
  try {
    await CompteRendu.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      return res.status(404).json({ error: 'Compte rendu not found' });
    }

    await compteRendu.update({ statut: 'Accepté' });
    res.status(200).json({ message: 'Compte rendu accepted successfully', compteRendu });
  } catch (error) {
    console.error('Error accepting compte rendu:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.refuseCompteRendu = async (req, res) => {
  try {
    const compteRendu = await CompteRendu.findByPk(req.params.id);
    if (!compteRendu) {
      return res.status(404).json({ error: 'Compte rendu not found' });
    }

    await compteRendu.update({ statut: 'Refusé' });
    res.status(200).json({ message: 'Compte rendu refused successfully', compteRendu });
  } catch (error) {
    console.error('Error refusing compte rendu:', error);
    res.status(400).json({ error: error.message });
  }
};