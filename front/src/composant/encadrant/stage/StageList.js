import { useEffect, useState } from 'react';
import './StageList.css';

const StageList = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStages = async () => {
      const token = localStorage.getItem('jwt');
      setLoading(true);

      try {
        const response = await fetch('http://localhost:5000/stages', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Échec de récupération des stages');
        }

        const data = await response.json();
        setStages(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Impossible de charger les stages. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  // Fonction pour déterminer la classe du badge de statut
  const getStatusBadgeClass = (statut) => {
    return statut ? "status-badge active" : "status-badge inactive";
  };

  // Fonction de formatage de date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Chargement des stages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  const renderStageCard = (stage) => (
    <div 
      key={stage.id}
      className="stage-card"
      onClick={() => window.location.href = `/encadrant/stages/${stage.id}`}
    >
      <div className="stage-header">
        <h2 className="stage-title">{stage.intitule}</h2>
        <span className="stage-type">{stage.typeStage}</span>
      </div>
      
      <div className="stage-content">
        <div className="stage-info">
          <div className="stage-period">
            <span className="period-label">Période :</span>
            <div className="period-dates">
              {formatDate(stage.dateDebut)} - {formatDate(stage.dateFin)}
            </div>
          </div>
          <span className={getStatusBadgeClass(stage.statut)}>
            {stage.statut ? 'Actif' : 'Inactif'}
          </span>
        </div>
        
        <p className="stage-description">{stage.description}</p>
        
        <div className="view-details">
          <span className="details-link">
            Voir détails
            <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="stage-list-container">
      <h1 className="page-title">Stages Disponibles</h1>
      
      {stages.length === 0 ? (
        <div className="empty-state">
          <p>Aucun stage disponible pour le moment.</p>
        </div>
      ) : (
        <div className="stage-grid">
          {stages.map(stage => renderStageCard(stage))}
        </div>
      )}
    </div>
  );
};

export default StageList;