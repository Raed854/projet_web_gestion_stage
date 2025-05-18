import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ChatList({ chats, activeChat, onChatSelect, onNewChat }) {
  const [searchTerm, setSearchTerm] = useState('');

  const getOtherParticipant = (chat) => {
    const currentUserId = Number(localStorage.getItem('userId'));
    return chat.participant1Id === currentUserId ? chat.participant2 : chat.participant1;
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat);
    return `${otherParticipant.nom} ${otherParticipant.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Messages</h2>
        <div className="chat-search">
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="chat-list-content">
        {filteredChats.length === 0 ? (
          <div className="no-chats-message">
            {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
          </div>
        ) : (
          filteredChats.map(chat => {
            const otherParticipant = getOtherParticipant(chat);
            return (
              <div
                key={chat.id}
                className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="chat-item-avatar">
                  {otherParticipant.nom.charAt(0)}
                </div>
                <div className="chat-item-content">
                  <div className="chat-item-header">
                    <h3>{otherParticipant.nom} {otherParticipant.prenom}</h3>
                    <span className="chat-item-time">
                      {formatDistanceToNow(new Date(chat.lastMessage?.timestamp || chat.createdAt), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                  </div>
                  <p className="chat-item-preview">
                    {chat.lastMessage?.content || 'Aucun message'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="unread-badge">{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
