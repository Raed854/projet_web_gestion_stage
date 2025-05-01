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
    <div className="signupContainer">
      <div className="signupCard">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
            />
            <span>Nom</span>
          </div>
          <div className="inputBox">
            <input
              type="text"
              name="prenom"
              required
              value={formData.prenom}
              onChange={handleChange}
            />
            <span>Prénom</span>
          </div>
          <div className="inputBox">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
            <span>Photo</span>
          </div>
          <div className="inputBox">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <span>Email</span>
          </div>
          <div className="inputBox">
            <input
              type="tel"
              name="telephone"
              required
              value={formData.telephone}
              onChange={handleChange}
            />
            <span>Téléphone</span>
          </div>
          <div className="inputBox">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <span>Mot de passe</span>
          </div>
          <button type="submit" className="enters">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
