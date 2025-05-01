import React, { useState } from "react";
import "./adminDashboard.css";
import SideBar from "../sidebar/sidebar";
import EditUser from "./edituser/edituser";

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      nom: "Doe",
      prenom: "John",
      email: "john.doe@example.com",
      photo: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      nom: "Smith",
      prenom: "Anna",
      email: "anna.smith@example.com",
      photo: "https://via.placeholder.com/80",
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleUpdate = (id) => {
    const userToEdit = users.find((u) => u.id === id);
    setEditingUser(userToEdit);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  return (
    <div className="dashboardLayout">
      <SideBar />
      <div className="mainContent">
        <h2>Liste des utilisateurs</h2>
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><img src={u.photo} alt="Profil" width={80} /></td>
                <td>{u.nom}</td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => handleUpdate(u.id)}>Modifier</button>
                  <button onClick={() => handleDelete(u.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <EditUser
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleSaveUser}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
