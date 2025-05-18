import React, { useState, useEffect } from "react";
import "../../adminDashboard/adminDashboard.css";
import SideBar from "../../sidebar/sidebar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const createChat = async (userId) => {
    try {
      const token = localStorage.getItem('jwt');
      const currentUserId = localStorage.getItem('userId');
      
      const response = await fetch('http://localhost:5000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          participant1Id: Number(currentUserId),
          participant2Id: Number(userId)
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du chat');
      }

      showNotification('Chat créé avec succès');
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification('Erreur lors de la création du chat', 'error');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/etudiants", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="dashboardLayout">
      <SideBar />
      <div className="mainContent">
        <h2>Liste des utilisateurs</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Classe</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.nom}</td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td>{u.classe}</td>
                <td>{u.role}</td>              <td>
                  <div className="button-group">
                    <button onClick={() => setSelectedUser(u)}>Détails</button>
                    <button onClick={() => createChat(u.id)}>Nouveau Chat</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {selectedUser && (
          <div className="popup">
            <div className="popupContent">
              <h3>Détails de l'utilisateur</h3>
              <p><strong>Nom:</strong> {selectedUser.nom}</p>
              <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Classe:</strong> {selectedUser.classe}</p>
              <p><strong>Rôle:</strong> {selectedUser.role}</p>
              <div className="modalButtons">
                <button onClick={() => setSelectedUser(null)}>Fermer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
