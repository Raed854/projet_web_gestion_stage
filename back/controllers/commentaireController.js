const Commentaire = require('../models/Commentaire');

// CRUD operations
exports.createCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.create(req.body);
    res.status(201).json(commentaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommentaires = async (req, res) => {
  try {
    const commentaires = await Commentaire.findAll();
    res.status(200).json(commentaires);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommentaireById = async (req, res) => {
  try {
    const commentaire = await Commentaire.findByPk(req.params.id);
    if (!commentaire) return res.status(404).send('Commentaire not found');
    res.status(200).json(commentaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCommentaire = async (req, res) => {
  try {
    const commentaire = await Commentaire.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(commentaire);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCommentaire = async (req, res) => {
  try {
    await Commentaire.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommentairesByCompteRenduId = async (req, res) => {
  try {
    const commentaires = await Commentaire.findAll({
      where: { compteRenduId: req.params.compteRenduId }
    });

    if (commentaires.length === 0) {
      return res.status(200).json([]); // Return empty array if no comments found
    }

    res.status(200).json(commentaires);
  } catch (error) {
    console.error('Error fetching commentaires by compte rendu:', error);
    res.status(400).json({ error: error.message });
  }
};