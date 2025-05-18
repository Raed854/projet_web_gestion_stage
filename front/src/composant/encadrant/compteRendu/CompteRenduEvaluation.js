import React, { useState, useEffect } from 'react';
import './CompteRenduEvaluation.css';

const CompteRenduEvaluation = () => {
  const [compteRendus, setCompteRendus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCompteRendu, setSelectedCompteRendu] = useState(null);
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState(null);  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stages, setStages] = useState({});

  useEffect(() => {
    fetchCompteRendus();
  }, []);

  const fetchStageDetails = async (stageId) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5000/stages/${stageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer les détails du stage');
      }

      const data = await response.json();
      setStages(prevStages => ({
        ...prevStages,
        [stageId]: data.intitule
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des détails du stage:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchCompteRendus = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch('http://localhost:5000/compterendus', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer les comptes rendus');
      }      const data = await response.json();
      setCompteRendus(data);
      // Fetch stage details for each compte rendu
      data.forEach(compteRendu => {
        if (compteRendu.stageId) {
          fetchStageDetails(compteRendu.stageId);
        }
      });
    } catch (error) {
      setError('Erreur lors du chargement des comptes rendus');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5000/compterendus/${id}/${status}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du changement de statut`);
      }

      showNotification(`Compte rendu ${status === 'accept' ? 'accepté' : 'refusé'} avec succès`);
      fetchCompteRendus();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors du changement de statut', 'error');
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
    const response = await fetch(`http://localhost:5000/commentaires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        compteRenduId: selectedCompteRendu.id,
        contenu: comment,
        date: new Date().toISOString()
      })
    });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire');
      }

      showNotification('Commentaire ajouté avec succès');
      setShowCommentModal(false);
      setComment('');
      fetchCompteRendus();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de l\'ajout du commentaire', 'error');
    }
  };

  const handleCommentUpdate = async (compteRenduId, commentId) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5000/compterendus/${compteRenduId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du commentaire');
      }

      showNotification('Commentaire modifié avec succès');
      setShowCommentModal(false);
      setComment('');
      fetchCompteRendus();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la modification du commentaire', 'error');
    }
  };

  const handleCommentDelete = async (compteRenduId, commentId) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5000/compterendus/${compteRenduId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du commentaire');
      }

      showNotification('Commentaire supprimé avec succès');
      fetchCompteRendus();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('Erreur lors de la suppression du commentaire', 'error');
    }
  };

  const sortedCompteRendus = [...compteRendus].sort((a, b) => {
    if (sortBy === 'id') {
      return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="compte-rendu-evaluation">
        <div className="stage-detail-container">
          <div className="loading">Chargement des comptes rendus...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="compte-rendu-evaluation">
        <div className="stage-detail-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="compte-rendu-evaluation">
      <div className="stage-detail-container">
        <h1 className="page-title">Évaluation des Comptes Rendus</h1>
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="controls-container">
          <div className="filter-controls">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="desc">Plus récent d'abord</option>
              <option value="asc">Plus ancien d'abord</option>
            </select>
          </div>
        </div>

        <div className="comptes-rendus-grid">
          {sortedCompteRendus.map((compteRendu) => (
            <div key={compteRendu.id} className="compte-rendu-card">              <div className="compte-rendu-header">
                <h3>{compteRendu.nom}</h3>
                <span className={`status ${compteRendu.statut.toLowerCase()}`}>
                  {compteRendu.statut}
                </span>
              </div>              <div className="compte-rendu-info">
                <p><strong>Type:</strong> {compteRendu.type}</p>
                <p><strong>Stage:</strong> {stages[compteRendu.stageId] || 'Chargement...'}</p>
              </div>

              {compteRendu.commentaires && compteRendu.commentaires.length > 0 && (
                <div className="commentaires">
                  <h4>Commentaires:</h4>
                  {compteRendu.commentaires.map((commentaire) => (                    <div key={commentaire.id} className="commentaire">
                      <p>{commentaire.contenu}</p>
                      <div className="commentaire-metadata">
                        <span className="comment-date">{commentaire.date}</span>
                      </div>
                      <div className="commentaire-actions">
                        <button onClick={() => {
                          setSelectedCompteRendu(compteRendu);
                          setComment(commentaire.contenu);
                          setShowCommentModal(true);
                        }}>Modifier</button>
                        <button onClick={() => handleCommentDelete(compteRendu.id, commentaire.id)}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="compte-rendu-actions">
                {compteRendu.statut === 'En attente' && (
                  <>
                    <button 
                      className="accept-button"
                      onClick={() => handleStatusChange(compteRendu.id, 'accept')}
                    >
                      Accepter
                    </button>
                    <button 
                      className="refuse-button"
                      onClick={() => handleStatusChange(compteRendu.id, 'refuse')}
                    >
                      Refuser
                    </button>
                  </>
                )}
                <button 
                  className="comment-button"
                  onClick={() => {
                    setSelectedCompteRendu(compteRendu);
                    setShowCommentModal(true);
                  }}
                >
                  Ajouter un commentaire
                </button>
              </div>
            </div>
          ))}
        </div>

        {showCommentModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{comment ? 'Modifier le commentaire' : 'Ajouter un commentaire'}</h2>
              <form onSubmit={handleCommentSubmit}>
                <div className="form-group">
                  <label>Commentaire:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows="4"
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="submit-button">
                    {comment ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowCommentModal(false);
                      setComment('');
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompteRenduEvaluation;
