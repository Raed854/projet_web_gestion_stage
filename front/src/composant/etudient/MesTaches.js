import React, { useState, useEffect } from 'react';
import './MesTaches.css';

const MesTaches = () => {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedTache, setSelectedTache] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newSubmission, setNewSubmission] = useState({
    nom: '',
    type: 'Rapport',
    statut: 'En attente'
  });

  useEffect(() => {
    fetchTaches();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchTaches = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch('http://localhost:5000/taches', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer les tâches');
      }

      const data = await response.json();
      setTaches(data);
    } catch (error) {
      setError('Erreur lors du chargement des tâches');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCompteRendu = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('jwt');

    try {
        console.log(selectedTache);
      const response = await fetch('http://localhost:5000/compterendus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: newSubmission.nom,
          type: newSubmission.type,
          statut: newSubmission.statut,
          stageId: selectedTache.stageId, // Changed from stageId to tacheId
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission');
      }

      showNotification('Compte-rendu soumis avec succès');

      // Reset form and close modal
      setNewSubmission({
        nom: '',
        type: 'Rapport',
        statut: 'En attente'
      });
      setShowSubmissionModal(false);
      setSelectedTache(null);
      
      // Refresh taches
      fetchTaches();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la soumission du compte-rendu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmissionModal = (tache) => {
    setSelectedTache(tache);
    setShowSubmissionModal(true);
  };

  if (loading) {
    return <div className="loading">Chargement des tâches...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="mes-taches-container">
      <h1 className="page-title">Mes Tâches</h1>
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="taches-grid">
        {taches.map((tache) => (
          <div key={tache.id} className="tache-card">
            <div className="tache-header">
              <h3 className="tache-title">{tache.nom}</h3>
              <span className={`tache-status ${tache.statut ? "complete" : "pending"}`}>
                {tache.statut ? "Terminé" : "À faire"}
              </span>
            </div>
            
            <p className="tache-description">{tache.description}</p>
            
            {tache.ddl && (
              <div className="tache-deadline">
                <span className="deadline-label">Date limite:</span>
                <span className="deadline-date">
                  {new Date(tache.ddl).toLocaleDateString()}
                </span>
              </div>
            )}
            
            <button 
              className="submit-button"
              onClick={() => openSubmissionModal(tache)}
            >
              Soumettre un compte-rendu
            </button>
          </div>
        ))}
      </div>

      {showSubmissionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Soumettre un compte-rendu</h2>
            <form onSubmit={handleSubmitCompteRendu}>
              <div className="form-group">
                <label>Nom du compte-rendu:</label>
                <input
                  type="text"
                  value={newSubmission.nom}
                  onChange={(e) => setNewSubmission({...newSubmission, nom: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type:</label>
                <select
                  value={newSubmission.type}
                  onChange={(e) => setNewSubmission({...newSubmission, type: e.target.value})}
                >
                  <option value="Rapport">Rapport</option>
                  <option value="Livrable">Livrable</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button" disabled={submitting}>
                  {submitting ? 'Soumission en cours...' : 'Soumettre'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowSubmissionModal(false)}
                  disabled={submitting}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesTaches;
