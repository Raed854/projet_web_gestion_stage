import React, { useState, useEffect } from "react";
import "./edituser.css";

const EditUser = ({ user, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [photo, setPhoto] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setNom(user.nom);
      setPrenom(user.prenom);
      setPhoto(user.photo || "");
      setTelephone(user.telephone || "");
      setPassword(user.password || "");
    }
  }, [user]);

  const handleSave = () => {
    onSave({
      ...user,
      email,
      nom,
      prenom,
      photo,
      telephone,
      password,
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
          <label>Photo (URL):</label>
          <input value={photo} onChange={(e) => setPhoto(e.target.value)} />
        </div>

        <div className="inputBox">
          <label>Téléphone:</label>
          <input value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        </div>

        <div className="inputBox">
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
