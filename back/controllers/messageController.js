const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.createMessage = async (req, res) => {
  try {
    const { chatId, contenu } = req.body;
    const senderId = req.userId; // From JWT token

    // Verify chat exists and user is participant
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is participant in chat
    if (chat.participant1Id !== senderId && chat.participant2Id !== senderId) {
      return res.status(403).json({ error: 'Not authorized to send messages in this chat' });
    }

    const message = await Message.create({
      chatId,
      senderId,
      contenu
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
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