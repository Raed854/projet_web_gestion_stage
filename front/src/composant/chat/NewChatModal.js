import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewChatModal({ onClose, onCreateChat, existingChats }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:5000/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const currentUserId = Number(localStorage.getItem('userId'));
  
  const filteredUsers = users.filter(user => {
    const userFullName = `${user.nom} ${user.prenom}`.toLowerCase();
    const matchesSearch = userFullName.includes(searchTerm.toLowerCase());
    const notCurrentUser = user.id !== currentUserId;
    const chatNotExists = !existingChats.some(chat => 
      chat.participant1Id === user.id || chat.participant2Id === user.id
    );
    return matchesSearch && notCurrentUser && chatNotExists;
  });

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-loading">Chargement des utilisateurs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nouvelle conversation</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-search">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error ? (
          <div className="modal-error">{error}</div>
        ) : (
          <div className="users-list">
            {filteredUsers.length === 0 ? (
              <div className="no-users-message">
                {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
              </div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="user-item"
                  onClick={() => onCreateChat(user.id)}
                >                  <div className="user-avatar">{user.nom.charAt(0)}</div>
                  <div className="user-info">
                    <h3>{user.nom} {user.prenom}</h3>
                    <p>{user.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
