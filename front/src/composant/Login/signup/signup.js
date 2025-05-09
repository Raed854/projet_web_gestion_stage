// src/composant/Signup/SignUp.js
import React, { useState } from "react";
import "./signup.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données d'inscription :", formData);
    alert("Inscription simulée !");
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-form-card">
        <h2 className="signup-title">Créer un compte</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
            />
            <span className="form-label">Nom</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="prenom"
              required
              value={formData.prenom}
              onChange={handleChange}
            />
            <span className="form-label">Prénom</span>
          </div>
          <div className="form-group">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
            <span className="form-label">Photo</span>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <span className="form-label">Email</span>
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="telephone"
              required
              value={formData.telephone}
              onChange={handleChange}
            />
            <span className="form-label">Téléphone</span>
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <span className="form-label">Mot de passe</span>
          </div>
          <button type="submit" className="signup-button">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
