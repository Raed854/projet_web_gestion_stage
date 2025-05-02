import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import SideBar from "../sidebar/sidebar";
import EditUser from "./edituser/edituser";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = (id) => {
    const userToEdit = users.find((u) => u.id === id);
    setEditingUser(userToEdit);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUsers(users.map((u) => (u.id === updatedData.id ? updatedData : u)));
        setEditingUser(null);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
