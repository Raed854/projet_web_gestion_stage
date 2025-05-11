import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import SideBar from "../sidebar/sidebar";
import EditUser from "./edituser/edituser";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newUser, setNewUser] = useState({ nom: "", prenom: "", email: "", classe: "", role: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          // Not JSON, show error and redirect if token is missing or invalid
          if (
            text.includes("Token is required") ||
            response.status === 403 ||
            response.status === 401
          ) {
            alert(text);
            window.location = "/forbidden";
            return;
          }
          throw new Error(text);
        }
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);


  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return nameRegex.test(name);
  };

  const validateUser = (user) => {
    // Removed validation requirements but keep format validation if values are provided
    if (user.nom?.trim() && !validateName(user.nom)) {
      toast.error("Le nom ne doit contenir que des lettres");
      return false;
    }

    if (user.prenom?.trim() && !validateName(user.prenom)) {
      toast.error("Le prénom ne doit contenir que des lettres");
      return false;
    }

    if (user.email?.trim() && !validateEmail(user.email)) {
      toast.error("Veuillez fournir une adresse email valide");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));

    // Immediate validation feedback
    if (name === 'nom' && value && !validateName(value)) {
      toast.warn("Le nom ne doit contenir que des lettres");
    }
    if (name === 'prenom' && value && !validateName(value)) {
      toast.warn("Le prénom ne doit contenir que des lettres");
    }
    if (name === 'email' && value && !validateEmail(value)) {
      toast.warn("Format d'email invalide");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("Utilisateur supprimé avec succès");
      } else {
        toast.error("Échec de la suppression de l'utilisateur");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleUpdate = (id) => {
    const userToEdit = users.find((u) => u.id === id);
    setEditingUser(userToEdit);
  };

  const handleSaveUser = async (updatedUser) => {
    if (!validateUser(updatedUser)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUsers(users.map((u) => (u.id === updatedData.id ? updatedData : u)));
        setEditingUser(null);
        toast.success("Utilisateur mis à jour avec succès");
      } else {
        toast.error("Échec de la mise à jour de l'utilisateur");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    // Prevent creation if any field is empty
    if (!newUser.nom.trim() || !newUser.prenom.trim() || !newUser.email.trim() || !newUser.role.trim()) {
      toast.error("Tous les champs obligatoires doivent être remplis.");
      return;
    }
    if (!validateUser(newUser)) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setShowCreatePopup(false);
        setNewUser({ nom: "", prenom: "", email: "", classe: "", role: "" });
        toast.success("Utilisateur créé avec succès");
      } else {
        toast.error("Échec de la création de l'utilisateur");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Erreur lors de la création de l'utilisateur");
    }
  };

  return (
    <div className="dashboardLayout">
      <SideBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="mainContent">
        <h2>Liste des utilisateurs</h2>
        <button onClick={() => setShowCreatePopup(true)}>Créer un utilisateur</button>
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

        {showCreatePopup && (
          <div className="popup">
            <div className="popupContent">
              <h3>Créer un utilisateur</h3>
              <form onSubmit={handleCreateUser}>
                <div className="inputBox">
                  <label>Nom:</label>
                  <input
                    type="text"
                    name="nom"
                    value={newUser.nom}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputBox">
                  <label>Prénom:</label>
                  <input
                    type="text"
                    name="prenom"
                    value={newUser.prenom}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputBox">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputBox">
                  <label>Classe:</label>
                  <input
                    type="text"
                    name="classe"
                    value={newUser.classe}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="inputBox">
                  <label>Rôle:</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Sélectionner un rôle --</option>
                    <option value="admin">Admin</option>
                    <option value="encadrant">Encadrant</option>
                    <option value="etudiant">Etudiant</option>
                  </select>
                </div>
                <div className="modalButtons">
                  <button type="submit">Créer</button>
                  <button type="button" onClick={() => setShowCreatePopup(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
