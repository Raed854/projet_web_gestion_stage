import React, { useState, useEffect } from 'react';
import './MesCompteRendus.css';

const MesCompteRendus = () => {
  const [compteRendus, setCompteRendus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompteRendu, setSelectedCompteRendu] = useState(null);
  const [notification, setNotification] = useState(null);

  // New state for filtering and sorting
  const [filterStatus, setFilterStatus] = useState('tous');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCompteRendus();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  const fetchCompteRendus = async () => {
    const token = localStorage.getItem('jwt');
    try {
      // Fetch compte rendus
      const crResponse = await fetch('http://localhost:5000/compterendus', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!crResponse.ok) {
        throw new Error('Impossible de récupérer les comptes rendus');
      }

      const crData = await crResponse.json();
      
      // Fetch commentaires for each compte rendu
      const compteRendusWithComments = await Promise.all(
        crData.map(async (cr) => {
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
        })
      );

      setCompteRendus(compteRendusWithComments);
    } catch (error) {
      setError('Erreur lors du chargement des comptes rendus');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = (compteRendu) => {
    setSelectedCompteRendu(compteRendu);
    setShowDetailsModal(true);
  };

  // Filtering and sorting functions
  const filteredAndSortedCompteRendus = () => {
    let filtered = [...compteRendus];
    
    // Apply status filter
    if (filterStatus !== 'tous') {
      filtered = filtered.filter(cr => cr.statut.toLowerCase() === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;      if (sortBy === 'date') {
        comparison = b.id - a.id; // Sort by ID instead of date since we don't have dates
      } else if (sortBy === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortBy === 'statut') {
        comparison = a.statut.localeCompare(b.statut);
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  };

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCompteRendus().length / itemsPerPage);
  const paginatedCompteRendus = filteredAndSortedCompteRendus().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="mes-comptes-rendus-wrapper">
        <div className="stage-detail-container">
          <div className="loading">Chargement des comptes rendus...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mes-comptes-rendus-wrapper">
        <div className="stage-detail-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-comptes-rendus-wrapper">
      <div className="stage-detail-container">
        <h1 className="page-title">Mes Comptes Rendus</h1>
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <div className="controls-container">
          <div className="filter-controls">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en-attente">En attente</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Trier par date</option>
              <option value="type">Trier par type</option>
              <option value="statut">Trier par statut</option>
            </select>

            <button 
              className="sort-order-button"
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="comptes-rendus-grid">
          {paginatedCompteRendus.map((compteRendu) => (
            <div 
              key={compteRendu.id} 
              className="compte-rendu-card"
              onClick={() => openDetailsModal(compteRendu)}
            >
              <div className="compte-rendu-header">
                <h3>{compteRendu.nom}</h3>
                <span className={`status ${compteRendu.statut.toLowerCase()}`}>
                  {compteRendu.statut}
                </span>
              </div>              <div className="compte-rendu-info">
                <p><strong>Type:</strong> {compteRendu.type}</p>
                <p className="comments-preview">
                  <strong>Commentaires:</strong> {compteRendu.commentaires?.length || 0}
                </p>
              </div>

              <button className="view-details-button">
                Voir les détails
              </button>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {showDetailsModal && selectedCompteRendu && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCompteRendu.nom}</h2>
                <span className={`status ${selectedCompteRendu.statut.toLowerCase()}`}>
                  {selectedCompteRendu.statut}
                </span>
              </div>

              <div className="modal-body">                <div className="submission-details">                  
                  <p><strong>Type:</strong> {selectedCompteRendu.type}</p>
                  {selectedCompteRendu.fichierUrl && (
                    <p>
                      <strong>Document:</strong>
                      <a 
                        href={selectedCompteRendu.fichierUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="document-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Voir le document
                      </a>
                    </p>
                  )}
                </div>

                <div className="commentaires-section">
                  <h3>Commentaires de l'encadrant</h3>
                  {selectedCompteRendu.commentaires?.length > 0 ? (
                    <div className="commentaires-list">                      {selectedCompteRendu.commentaires.map((commentaire, index) => (
                        <div key={commentaire.id || index} className="commentaire">                          <p>{commentaire.contenu}</p>
                          <div className="commentaire-metadata">
                            <span className="comment-author">{commentaire.encadrant_nom}</span>
                            <span className="comment-date">{commentaire.date}</span>
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
      </div>
    </div>
  );
};

export default MesCompteRendus;
