import React, { useState, useEffect } from "react";
import "./edituser.css";

const EditUser = ({ user, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [classe, setClasse] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setNom(user.nom);
      setPrenom(user.prenom);
      setClasse(user.classe || "");
      setRole(user.role || "");
    }
  }, [user]);

  const handleSave = () => {
    onSave({
      ...user,
      email,
      nom,
      prenom,
      classe,
      role,
    });
    onClose();
  };

  if (!user) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3>Modifier l'utilisateur</h3>

        <div className="inputBox">
          <label>Nom:</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>

        <div className="inputBox">
          <label>Prénom:</label>
          <input value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        </div>

        <div className="inputBox">
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="inputBox">
          <label>Classe:</label>
          <input value={classe} onChange={(e) => setClasse(e.target.value)} />
        </div>

        <div className="inputBox">
          <label>Rôle:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="encadrant">Encadrant</option>
            <option value="etudiant">Etudiant</option>
          </select>
        </div>

        <div className="modalButtons">
          <button onClick={handleSave}>Enregistrer</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
