import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../sidebar/sidebar";
import "./modifierStage.css";

const ModifierStagePage = () => {
  const navigate = useNavigate();

  // Données statiques (prédéfinies pour modification)
  const [formData, setFormData] = useState({
    type: "Observation",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    description: "Stage d'observation dans une entreprise de technologie.",
    etudiant: "Ahmed Ben Ali",
    encadrant: "Khaled Mansour",
    statut: "Validé",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Stage modifié :", formData);
    alert("Stage modifié avec succès !");
    navigate("/stages");
  };

  return (
    <div className="modifier-stage-page">
      <SideBar />
      <div className="contenu-formulaire">
        <h2>Modifier le Stage</h2>
        <form onSubmit={handleSubmit}>
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">-- Sélectionner --</option>
            <option value="Observation">Observation</option>
            <option value="FinEtudes">Fin d'études</option>
          </select>

          <label>Date de début</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

          <label>Date de fin</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />

          <label>Étudiant</label>
          <input type="text" name="etudiant" value={formData.etudiant} onChange={handleChange} required />

          <label>Encadrant</label>
          <input type="text" name="encadrant" value={formData.encadrant} onChange={handleChange} required />

          <label>Statut</label>
          <select name="statut" value={formData.statut} onChange={handleChange} required>
            <option value="">-- Sélectionner --</option>
            <option value="En attente">En attente</option>
            <option value="Validé">Validé</option>
            <option value="Terminé">Terminé</option>
          </select>

          <div className="btn-group">
            <button type="submit">Sauvegarder</button>
            <button type="button" onClick={() => navigate("/stages")}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierStagePage;
