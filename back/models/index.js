const User = require('./User');
const Chat = require('./Chat');
const Message = require('./Message');

// Chat associations
Chat.hasMany(Message, {
  foreignKey: 'chatId',
  as: 'messages'
});

Chat.belongsTo(User, {
  foreignKey: 'participant1Id',
  as: 'participant1'
});

Chat.belongsTo(User, {
  foreignKey: 'participant2Id',
  as: 'participant2'
});

// Message associations
Message.belongsTo(Chat, {
  foreignKey: 'chatId',
  as: 'chat'
});

Message.belongsTo(User, {
  foreignKey: 'senderId',
  as: 'sender'
});

// User associations with Chat
User.hasMany(Chat, {
  foreignKey: 'participant1Id',
  as: 'chatsAsParticipant1'
});

User.hasMany(Chat, {
  foreignKey: 'participant2Id',
  as: 'chatsAsParticipant2'
});

// User associations with Message
User.hasMany(Message, {
  foreignKey: 'senderId',
  as: 'sentMessages'
});

module.exports = {
  User,
  Chat,
  Message
};
