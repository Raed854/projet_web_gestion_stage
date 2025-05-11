import React, { useState, useEffect } from "react";
import "../../adminDashboard/adminDashboard.css";
import SideBar from "../../sidebar/sidebar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
                <td>{u.role}</td>
                <td>
                  <button onClick={() => setSelectedUser(u)}>Détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
