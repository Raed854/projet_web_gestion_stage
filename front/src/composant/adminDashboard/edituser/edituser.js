import React, { useState, useEffect } from "react";
import "./edituser.css";
import { toast } from 'react-toastify';

const EditUser = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    classe: "",
    role: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        classe: user.classe || "",
        role: user.role || ""
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    return nameRegex.test(name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleSubmit = () => {
    // Only validate format if values are provided
    if (formData.nom?.trim() && !validateName(formData.nom)) {
      toast.error("Le nom ne doit contenir que des lettres");
      return;
    }

    if (formData.prenom?.trim() && !validateName(formData.prenom)) {
      toast.error("Le prénom ne doit contenir que des lettres");
      return;
    }

    if (formData.email?.trim() && !validateEmail(formData.email)) {
      toast.error("Veuillez fournir une adresse email valide");
      return;
    }

    onSave({ ...user, ...formData });
  };

  if (!user) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3>Modifier l'utilisateur</h3>

        <div className="inputBox">
          <label>Nom:</label>
          <input 
            name="nom"
            value={formData.nom} 
            onChange={handleChange}
          />
        </div>

        <div className="inputBox">
          <label>Prénom:</label>
          <input 
            name="prenom"
            value={formData.prenom} 
            onChange={handleChange}
          />
        </div>

        <div className="inputBox">
          <label>Email:</label>
          <input 
            type="email"
            name="email"
            value={formData.email} 
            onChange={handleChange}
          />
        </div>

        <div className="inputBox">
          <label>Classe:</label>
          <input 
            name="classe"
            value={formData.classe} 
            onChange={handleChange}
          />
        </div>

        <div className="inputBox">
          <label>Rôle:</label>
          <select 
            name="role"
            value={formData.role} 
            onChange={handleChange}
          >
            <option value="">-- Sélectionner un rôle --</option>
            <option value="admin">Admin</option>
            <option value="encadrant">Encadrant</option>
            <option value="etudiant">Etudiant</option>
          </select>
        </div>

        <div className="modalButtons">
          <button onClick={handleSubmit}>Enregistrer</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
