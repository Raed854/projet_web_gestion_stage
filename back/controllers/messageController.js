const Message = require('../models/Message');

// CRUD operations
exports.createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).send('Message not found');
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};