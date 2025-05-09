import React, { useState } from "react";
import "./rendu.css";

const CompteRenduForm = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    statut: "",
  });

  const types = ["Technique", "Scientifique", "Administratif"];
  const statuts = ["En cours", "Validé", "Rejeté"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Compte rendu :", formData);
    onSave && onSave(formData);
  };

  return (
    <div className="formulaire-compte-rendu">
      <h2>Créer un compte rendu</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        <div className="ligne-selects">
          <div className="groupe-champ">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="groupe-champ">
            <label>Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              {statuts.map((statut, index) => (
                <option key={index} value={statut}>
                  {statut}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="groupe-boutons">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompteRenduForm;
