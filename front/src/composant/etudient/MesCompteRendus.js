import React, { useState, useEffect } from 'react';
import './MesCompteRendus.css';

const MesCompteRendus = () => {
  const [compteRendus, setCompteRendus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompteRendu, setSelectedCompteRendu] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nom: '',
    type: 'Rapport',
    statut: 'En attente'
  });
  const [updating, setUpdating] = useState(false);

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

  // Helper function to get file name
  const getFileName = (compteRendu) => {
    if (compteRendu.fileName) return compteRendu.fileName;
    if (compteRendu.filePath) return compteRendu.filePath.split('/').pop();
    return null;
  };

  // Handle file selection with validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        showNotification('Type de fichier non autorisé. Utilisez PDF, DOC, DOCX, TXT ou RTF.', 'error');
        event.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('Fichier trop volumineux. Taille maximale: 10MB.', 'error');
        event.target.value = ''; // Reset file input
        return;
      }
      
      setSelectedFile(file);
      showNotification(`Fichier sélectionné: ${file.name}`, 'success');
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Download file function
  const downloadFile = async (compteRenduId, fileName) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`http://localhost:5000/compteRendus/${compteRenduId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Create blob from response
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showNotification('Fichier téléchargé avec succès');
      } else {
        showNotification('Erreur lors du téléchargement', 'error');
      }
    } catch (error) {
      console.error('Download error:', error);
      showNotification('Erreur lors du téléchargement', 'error');
    }
  };
  const fetchCompteRendus = async () => {
    const token = localStorage.getItem('jwt');
    try {
      // Fetch compte rendus
      const crResponse = await fetch('http://localhost:5000/compteRendus', {
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
      
      // Console log all compte rendus for debugging
      console.log('All Compte Rendus (Student View):', compteRendusWithComments);
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
          fileSize: cr.fileSize,
          createdAt: cr.createdAt,
          updatedAt: cr.updatedAt,
          commentaires: cr.commentaires,
          hasFileCheck: hasFile(cr),
          fileNameExtracted: getFileName(cr),
          // Additional file field checks
          hasFilePath: cr.filePath ? true : false,
          hasFileName: cr.fileName ? true : false
        });
      });
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

  const openEditModal = (compteRendu) => {
    setSelectedCompteRendu(compteRendu);
    setEditFormData({
      nom: compteRendu.nom,
      type: compteRendu.type,
      statut: compteRendu.statut
    });
    setSelectedFile(null);
    setShowEditModal(true);
    setShowDetailsModal(false); // Close details modal if open
  };

  const handleUpdateCompteRendu = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const token = localStorage.getItem('jwt');

    console.log('Starting update for compte rendu:', selectedCompteRendu.id);
    console.log('Form data:', editFormData);
    console.log('Selected file:', selectedFile);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nom', editFormData.nom);
      formDataToSend.append('type', editFormData.type);
      formDataToSend.append('statut', editFormData.statut);
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
        console.log('File attached:', selectedFile.name);
      }

      console.log('Sending request to:', `http://localhost:5000/compteRendus/${selectedCompteRendu.id}`);

      const response = await fetch(`http://localhost:5000/compteRendus/${selectedCompteRendu.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formDataToSend
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
      showNotification('Compte-rendu mis à jour avec succès');

      // Reset form and close modal
      setEditFormData({
        nom: '',
        type: 'Rapport',
        statut: 'En attente'
      });
      setSelectedFile(null);
      setShowEditModal(false);
      setSelectedCompteRendu(null);
      
      // Refresh compte rendus
      fetchCompteRendus();
    } catch (error) {
      console.error('Update error:', error);
      showNotification(error.message || 'Erreur lors de la mise à jour du compte-rendu', 'error');
    } finally {
      setUpdating(false);
    }
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
            >
              <div className="compte-rendu-header">
                <h3>{compteRendu.nom}</h3>
                <span className={`status ${compteRendu.statut.toLowerCase()}`}>
                  {compteRendu.statut}
                </span>
              </div>
              
              <div className="compte-rendu-info">
                <p><strong>Type:</strong> {compteRendu.type}</p>
                <p className="comments-preview">
                  <strong>Commentaires:</strong> {compteRendu.commentaires?.length || 0}
                </p>
                {compteRendu.fileName && (
                  <p className="file-info">
                    <strong>Fichier:</strong> {compteRendu.fileName}
                  </p>
                )}
              </div>

              <div className="card-actions">
                <button 
                  className="view-details-button"
                  onClick={() => openDetailsModal(compteRendu)}
                >
                  Voir les détails
                </button>
                <button 
                  className="edit-button"
                  onClick={() => openEditModal(compteRendu)}
                >
                  Modifier
                </button>
              </div>
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

              <div className="modal-body">
                <div className="submission-details">                  
                  <p><strong>Type:</strong> {selectedCompteRendu.type}</p>
                  {hasFile(selectedCompteRendu) ? (
                    <div className="file-section">
                      <p><strong>Document:</strong> {getFileName(selectedCompteRendu)}</p>
                      {selectedCompteRendu.fileSize && (
                        <p><strong>Taille:</strong> {formatFileSize(selectedCompteRendu.fileSize)}</p>
                      )}
                      <button 
                        className="download-button"
                        onClick={() => downloadFile(selectedCompteRendu.id, getFileName(selectedCompteRendu))}
                      >
                        Télécharger le fichier
                      </button>
                    </div>
                  ) : (
                    <p><strong>Document:</strong> Aucun fichier attaché</p>
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
                  className="edit-button"
                  onClick={() => openEditModal(selectedCompteRendu)}
                >
                  Modifier
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

        {/* Edit Modal */}
        {showEditModal && selectedCompteRendu && (
          <div className="modal-overlay">
            <div className="edit-modal-content">
              <div className="modal-header">
                <h2>Modifier le compte-rendu</h2>
              </div>

              <form onSubmit={handleUpdateCompteRendu} className="edit-form">
                <div className="form-group">
                  <label htmlFor="nom" className="form-label">Nom du compte-rendu</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={editFormData.nom}
                    onChange={(e) => setEditFormData({...editFormData, nom: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type" className="form-label">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="Rapport">Rapport</option>
                    <option value="Livrable">Livrable</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="statut" className="form-label">Statut</label>
                  <select
                    id="statut"
                    name="statut"
                    value={editFormData.statut}
                    onChange={(e) => setEditFormData({...editFormData, statut: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="En attente">En attente</option>
                    <option value="Accepté">Accepté</option>
                    <option value="Refusé">Refusé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Document (optionnel)</label>
                  <div className="file-upload-section">
                    <input
                      type="file"
                      id="fileInput"
                      className="file-input"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.rtf"
                    />
                    <label htmlFor="fileInput" className="file-upload-button">
                      Choisir un nouveau fichier
                    </label>
                    <div className="file-upload-text">
                      PDF, DOC, DOCX, TXT, RTF (max 10MB)
                    </div>

                    {selectedFile && (
                      <div className="file-info">
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                      </div>
                    )}

                    {hasFile(selectedCompteRendu) && !selectedFile && (
                      <div className="current-file-info">
                        <div className="file-name">
                          Fichier actuel: {getFileName(selectedCompteRendu)}
                          <button
                            type="button"
                            className="download-button"
                            onClick={() => downloadFile(selectedCompteRendu.id, getFileName(selectedCompteRendu))}
                          >
                            Télécharger
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <div className="modal-actions-left">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setShowEditModal(false);
                        setSelectedFile(null);
                        setEditFormData({
                          nom: '',
                          type: 'Rapport',
                          statut: 'En attente'
                        });
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                  <div className="modal-actions-right">
                    <button
                      type="submit"
                      className={`save-button ${updating ? 'loading' : ''}`}
                      disabled={updating}
                    >
                      {updating ? 'Mise à jour...' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesCompteRendus;
