import React, { useState, useEffect } from "react";
import "./create.css";

const FormulaireStage = ({ onCancel, onSave, stage }) => {
  const [formulaire, setFormulaire] = useState({
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    etudiant: "",
    encadrant: "",
    statut: "",
  });

  useEffect(() => {
    if (stage) {
      setFormulaire(stage);
    }
  }, [stage]);

  const etudiants = [
    { id: 1, nom: "Ben Ali", prenom: "Ahmed" },
    { id: 2, nom: "Trabelsi", prenom: "Sonia" },
  ];

  const encadrants = [
    { id: 1, nom: "Mansour", prenom: "Khaled" },
    { id: 2, nom: "Haddad", prenom: "Noura" },
  ];

  const changerValeur = (e) => {
    const { name, value } = e.target;
    setFormulaire((prev) => ({ ...prev, [name]: value }));
  };

  const soumettre = (e) => {
    e.preventDefault();
    onSave(formulaire);
  };

  return (
    <div className="formulaire-stage">
      <h2>{stage ? "Modifier le stage" : "Ajouter un nouveau stage"}</h2>
      <form className="formulaire-contenu" onSubmit={soumettre}>
        <label>Type de stage</label>
        <select name="type" value={formulaire.type} onChange={changerValeur} required>
          <option value="">-- Sélectionner --</option>
          <option value="Observation">Stage d’observation</option>
          <option value="FinEtudes">Stage de fin d’études</option>
        </select>

        <label>Date de début</label>
        <input type="date" name="startDate" value={formulaire.startDate} onChange={changerValeur} required />

        <label>Date de fin</label>
        <input type="date" name="endDate" value={formulaire.endDate} onChange={changerValeur} required />

        <label>Description</label>
        <textarea name="description" value={formulaire.description} onChange={changerValeur} required />

        {/* Étudiant + Encadrant sur la même ligne */}
        <div className="ligne-selects">
          <div className="groupe-champ">
            <label>Étudiant</label>
            <select name="etudiant" value={formulaire.etudiant} onChange={changerValeur} required>
              <option value="">-- Choisir un étudiant --</option>
              {etudiants.map((e) => (
                <option key={e.id} value={e.nom + " " + e.prenom}>
                  {e.nom} {e.prenom}
                </option>
              ))}
            </select>
          </div>

          <div className="groupe-champ">
            <label>Encadrant</label>
            <select name="encadrant" value={formulaire.encadrant} onChange={changerValeur} required>
              <option value="">-- Choisir un encadrant --</option>
              {encadrants.map((e) => (
                <option key={e.id} value={e.nom + " " + e.prenom}>
                  {e.nom} {e.prenom}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Statut</label>
        <select name="statut" value={formulaire.statut} onChange={changerValeur} required>
          <option value="">-- Sélectionner un statut --</option>
          <option value="En attente">En attente</option>
          <option value="Validé">Validé</option>
          <option value="Terminé">Terminé</option>
        </select>

        <div className="groupe-boutons">
          <button type="submit">{stage ? "Modifier" : "Ajouter le stage"}</button>
  
        </div>
      </form>
    </div>
  );
};

export default FormulaireStage;
