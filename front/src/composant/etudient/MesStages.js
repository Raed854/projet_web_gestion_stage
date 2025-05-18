import React, { useState, useEffect } from 'react';
import './MesStages.css';

const MesStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwt');
        const response = await fetch(`http://localhost:5000/stages/etudiant/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer les stages');
        }

        const data = await response.json();
        setStages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Erreur lors du chargement des stages');
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  const createChat = async (encadrantId) => {
    try {
      const token = localStorage.getItem('jwt');
      const currentUserId = localStorage.getItem('userId');
      
      const response = await fetch('http://localhost:5000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          participant1Id: Number(currentUserId),
          participant2Id: Number(encadrantId)
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du chat');
      }

      showNotification('Chat créé avec succès');
    } catch (error) {
      console.error('Error creating chat:', error);
      showNotification('Erreur lors de la création du chat', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Chargement des stages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="mes-stages">
      <h2>Mes Stages</h2>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="stages-grid">
        {stages.length === 0 ? (
          <div className="no-stages">Aucun stage trouvé</div>
        ) : (
          stages.map((stage) => (
            <div key={stage.id} className="stage-card">
              <div className="stage-header">
                <h3>{stage.intitule}</h3>
                <span className={`status ${stage.status?.toLowerCase()}`}>
                  {stage.status}
                </span>
              </div>              <div className="stage-info">
                <div className="stage-details">
                  <div className="stage-main-info">
                    <p><strong>Entreprise:</strong> {stage.entreprise}</p>
                    <div className="stage-dates">
                      <p><strong>Période:</strong> 
                        <span>
                          {new Date(stage.dateDebut).toLocaleDateString()} - {new Date(stage.dateFin).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  {stage.encadrant && (
                    <div className="encadrant-info">
                      <div className="encadrant-header">
                        <div className="encadrant-avatar">
                          {stage.encadrant.nom.charAt(0)}{stage.encadrant.prenom.charAt(0)}
                        </div>
                        <div className="encadrant-details">
                          <h4>Encadrant</h4>
                          <p>{stage.encadrant.nom} {stage.encadrant.prenom}</p>
                        </div>
                        <button 
                          className="chat-button"
                          onClick={() => createChat(stage.encadrant.id)}
                        >
                          Contacter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MesStages;
