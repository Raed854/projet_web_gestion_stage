import React, { useState, useEffect } from 'react';
import './CompteRenduEvaluation.css';

const CompteRenduEvaluation = () => {
  const [compteRendus, setCompteRendus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompteRendu, setSelectedCompteRendu] = useState(null);
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState(null);
  const [sortBy, setSortBy] = useState('id');
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

  // Helper function to format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date non disponible';
      }
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Date non disponible';
    }
  };

  // Helper function to check if file exists
  const hasFile = (compteRendu) => {
    return (compteRendu.filePath && 
            compteRendu.filePath !== null && 
            compteRendu.filePath !== '' &&
            compteRendu.filePath !== 'null') ||
           (compteRendu.fileName && 
            compteRendu.fileName !== null && 
            compteRendu.fileName !== '' &&
            compteRendu.fileName !== 'null');
  };

  // Helper function to get file name safely
  const getFileName = (compteRendu) => {
    if (compteRendu.fileName) return compteRendu.fileName;
    if (compteRendu.filePath) return compteRendu.filePath.split('/').pop();
    return null;
  };

  const fetchCompteRendus = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch('http://localhost:5000/compteRendus', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de récupérer les comptes rendus');
      }

      const data = await response.json();
      
      // Fetch comments for each compte rendu
      const compteRendusWithComments = await Promise.all(
        data.map(async (cr) => {
          try {
            const commentResponse = await fetch(`http://localhost:5000/commentaires/compteRendu/${cr.id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (commentResponse.ok) {
              const comments = await commentResponse.json();
              return { ...cr, commentaires: comments };
            }
            
            return { ...cr, commentaires: [] };
          } catch (error) {
            console.error(`Erreur lors du chargement des commentaires pour CR ${cr.id}:`, error);
            return { ...cr, commentaires: [] };
          }
        })
      );

      setCompteRendus(compteRendusWithComments);
      
      // Console log all compte rendus for debugging
      console.log('All Compte Rendus:', compteRendusWithComments);
      console.log('Total count:', compteRendusWithComments.length);
      
      // Log each compte rendu individually for detailed inspection
      compteRendusWithComments.forEach((cr, index) => {
        console.log(`Compte Rendu ${index + 1}:`, {
          id: cr.id,
          nom: cr.nom,
          type: cr.type,
          statut: cr.statut,
          stageId: cr.stageId,
          filePath: cr.filePath,
          fileName: cr.fileName,
          createdAt: cr.createdAt,
          commentaires: cr.commentaires,
          hasFileCheck: hasFile(cr),
          fileNameExtracted: getFileName(cr),
          // Additional file field checks
          hasFilePath: cr.filePath ? true : false,
          hasFileName: cr.fileName ? true : false
        });
      });
      
      // Fetch stage details for each compte rendu
      compteRendusWithComments.forEach(compteRendu => {
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
      const response = await fetch(`http://localhost:5000/compteRendus/${id}/${status}`, {
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

  // Add download functionality
  const downloadFile = async (compteRenduId, fileName) => {
    if (!fileName) {
      showNotification('Nom de fichier non disponible', 'error');
      return;
    }

    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5000/compteRendus/${compteRenduId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Fichier non trouvé');
        }
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      const blob = await response.blob();
      
      // Check if blob is empty
      if (blob.size === 0) {
        throw new Error('Le fichier est vide');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification('Fichier téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      showNotification(error.message || 'Erreur lors du téléchargement du fichier', 'error');
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
      const response = await fetch(`http://localhost:5000/compteRendus/${compteRenduId}/comments/${commentId}`, {
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
      const response = await fetch(`http://localhost:5000/compteRendus/${compteRenduId}/comments/${commentId}`, {
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
            <div key={compteRendu.id} className="compte-rendu-card">
              <div className="compte-rendu-header">
                <h3>{compteRendu.nom}</h3>
                <span className={`status ${compteRendu.statut.toLowerCase()}`}>
                  {compteRendu.statut}
                </span>
              </div>

              <div className="compte-rendu-info">
                <p><strong>Type:</strong> {compteRendu.type}</p>
                <p><strong>Stage:</strong> {stages[compteRendu.stageId] || 'Chargement...'}</p>
                
                {hasFile(compteRendu) ? (
                  <div className="file-info">
                    <p><strong>Document:</strong></p>
                    <div className="file-download-section">
                      <span className="file-name">{getFileName(compteRendu)}</span>
                      <button
                        className="download-button"
                        onClick={() => downloadFile(compteRendu.id, getFileName(compteRendu))}
                      >
                        Télécharger
                      </button>
                    </div>
                  </div>
                ) : (
                  <p><strong>Document:</strong> Aucun fichier attaché</p>
                )}
              </div>

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

        {/* Details Modal */}
        {showDetailsModal && selectedCompteRendu && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Détails du compte-rendu</h2>
              </div>
              
              <div className="modal-body">
                <div className="submission-details">
                  <p><strong>Nom:</strong> {selectedCompteRendu.nom}</p>
                  <p><strong>Type:</strong> {selectedCompteRendu.type}</p>
                  <p><strong>Statut:</strong> 
                    <span className={`status ${selectedCompteRendu.statut.toLowerCase()}`}>
                      {selectedCompteRendu.statut}
                    </span>
                  </p>
                  <p><strong>Stage:</strong> {stages[selectedCompteRendu.stageId] || 'Chargement...'}</p>
                  <p><strong>Date de soumission:</strong> {formatDate(selectedCompteRendu.createdAt)}</p>
                  
                  {hasFile(selectedCompteRendu) ? (
                    <div className="file-info">
                      <p><strong>Document:</strong></p>
                      <div className="file-download-section">
                        <span className="file-name">{getFileName(selectedCompteRendu)}</span>
                        <button
                          className="download-button"
                          onClick={() => downloadFile(selectedCompteRendu.id, getFileName(selectedCompteRendu))}
                        >
                          Télécharger le fichier
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p><strong>Document:</strong> Aucun fichier attaché</p>
                  )}
                </div>

                <div className="commentaires-section">
                  <h3>Commentaires</h3>
                  {selectedCompteRendu.commentaires?.length > 0 ? (
                    <div className="commentaires-list">
                      {selectedCompteRendu.commentaires.map((commentaire, index) => (
                        <div key={commentaire.id || index} className="commentaire">
                          <p>{commentaire.contenu}</p>
                          <div className="commentaire-metadata">
                            <span className="comment-author">{commentaire.encadrant_nom}</span>
                            <span className="comment-date">{new Date(commentaire.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="commentaire-actions">
                            <button 
                              className="edit-comment-button"
                              onClick={() => {
                                setComment(commentaire.contenu);
                                setShowDetailsModal(false);
                                setShowCommentModal(true);
                              }}
                            >
                              Modifier
                            </button>
                            <button 
                              className="delete-comment-button"
                              onClick={() => handleCommentDelete(selectedCompteRendu.id, commentaire.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-comments">Aucun commentaire pour le moment</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                {selectedCompteRendu.statut === 'En attente' && (
                  <>
                    <button 
                      className="accept-button"
                      onClick={() => {
                        handleStatusChange(selectedCompteRendu.id, 'accept');
                        setShowDetailsModal(false);
                      }}
                    >
                      Accepter
                    </button>
                    <button 
                      className="refuse-button"
                      onClick={() => {
                        handleStatusChange(selectedCompteRendu.id, 'refuse');
                        setShowDetailsModal(false);
                      }}
                    >
                      Refuser
                    </button>
                  </>
                )}
                
                <button 
                  className="comment-button"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowCommentModal(true);
                  }}
                >
                  Ajouter un commentaire
                </button>
                
                <button 
                  className="close-button"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
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
