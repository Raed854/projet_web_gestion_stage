import React from 'react';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ChatWindow({
  chat,
  messages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  messagesEndRef
}) {
  const getOtherParticipant = (chat) => {
    const currentUserId = Number(localStorage.getItem('userId'));
    return chat.participant1Id === currentUserId ? chat.participant2 : chat.participant1;
  };

  const formatMessageDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        console.error('Invalid date:', dateString);
        return 'Date invalide';
      }
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const formatMessageTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        console.error('Invalid date:', dateString);
        return '--:--';
      }
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(message => {
      const date = formatMessageDate(message.createdAt || message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();
  const otherParticipant = getOtherParticipant(chat);

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-participant-info">
          <div className="participant-avatar">
            {otherParticipant.nom.charAt(0)}
          </div>
          <h3>{otherParticipant.nom} {otherParticipant.prenom}</h3>
        </div>
      </div>

      <div className="messages-container">
        {Object.entries(messageGroups).map(([date, groupMessages]) => (
          <div key={date} className="message-group">
            <div className="message-date">{date}</div>
            {groupMessages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isCurrentUser ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {message.content || message.contenu}
                  <span className="message-time">
                    {formatMessageTime(message.createdAt || message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={onSendMessage}>
        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={messageInput}
          onChange={(e) => onMessageInputChange(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!messageInput.trim()}
          className={`send-button ${!messageInput.trim() ? 'disabled' : ''}`}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
