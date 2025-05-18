const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

// Create a new chat between two users
exports.createChat = async (req, res) => {
  try {
    const { participant2Id } = req.body;
    const participant1Id = req.userId; // From JWT token

    // Check if chat already exists between these users
    const existingChat = await Chat.findOne({
      where: {
        [Op.or]: [
          { participant1Id: participant1Id, participant2Id: participant2Id },
          { participant1Id: participant2Id, participant2Id: participant1Id }
        ]
      }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const chat = await Chat.create({
      participant1Id,
      participant2Id
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all chats for the current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      include: [
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'nom', 'prenom']
          }]
        },
        {
          model: User,
          as: 'participant1',
          attributes: ['id', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'participant2',
          attributes: ['id', 'nom', 'prenom']
        }
      ]
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get chat by ID with messages
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id, {
      include: [
        {
          model: Message,
          as: 'messages',
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'nom', 'prenom']
          }]
        },
        {
          model: User,
          as: 'participant1',
          attributes: ['id', 'nom', 'prenom']
        },
        {
          model: User,
          as: 'participant2',
          attributes: ['id', 'nom', 'prenom']
        }
      ],
      order: [[{ model: Message, as: 'messages' }, 'createdAt', 'ASC']]
    });

    if (!chat) return res.status(404).send('Chat not found');

    // Check if user is participant
    if (chat.participant1Id !== req.userId && chat.participant2Id !== req.userId) {
      return res.status(403).send('Not authorized to view this chat');
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(400).json({ error: error.message });
  }
};
