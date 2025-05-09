import React, { useState } from "react";
import "./stage.css"; 
import Create from './create';
import SideBar from "../../sidebar/sidebar"// Assurez-vous que le chemin est correct

const StagePage = () => {
  
  const [stages, setStages] = useState([
    { id: 1, type: "Observation", etudiant: "Ahmed Ben Ali", encadrant: "Khaled Mansour", statut: "Validé", startDate: "2025-06-01", endDate: "2025-06-30", description: "Stage observation." },
    { id: 2, type: "FinEtudes", etudiant: "Sonia Trabelsi", encadrant: "Noura Haddad", statut: "En attente", startDate: "2025-07-01", endDate: "2025-09-30", description: "Stage de fin d'études." }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(null); 

  
  const openModal = () => {
    setCurrentStage(null); 
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fonction pour supprimer un stage
  const handleDelete = (id) => {
    setStages(stages.filter(stage => stage.id !== id));
  };

  // Fonction pour modifier un stage
  const handleEdit = (stage) => {
    setCurrentStage(stage); // Remplir le formulaire avec les données du stage à modifier
    setIsModalOpen(true);
  };

  // Fonction pour ajouter ou mettre à jour un stage
  const handleSave = (newStage) => {
    if (currentStage) {
      // Mise à jour d'un stage existant
      setStages(stages.map(stage => (stage.id === currentStage.id ? newStage : stage)));
    } else {
      // Ajout d'un nouveau stage
      setStages([...stages, { ...newStage, id: stages.length + 1 }]);
    }
    closeModal();
  };

  return (
    <div className="stage-page-container">
         <SideBar />
      <h2>Liste des Stages</h2>

      {/* Bouton Ajouter */}
      <button className="add-button" onClick={openModal}>Ajouter un stage</button>

      {/* Table des stages */}
      <table className="stage-table">
      
        <thead>
          <tr>
            <th>Type</th>
            <th>Étudiant</th>
            <th>Encadrant</th>
            <th>Statut</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage.id}>
              <td>{stage.type}</td>
              <td>{stage.etudiant}</td>
              <td>{stage.encadrant}</td>
              <td>{stage.statut}</td>
              <td>{stage.startDate}</td>
              <td>{stage.endDate}</td>
              <td>
                <button onClick={() => handleEdit(stage)}>Modifier</button>
                <button onClick={() => handleDelete(stage.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

  
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            <Create stage={currentStage} onSave={handleSave} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StagePage;
