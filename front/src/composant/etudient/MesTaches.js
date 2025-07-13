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
  const [selectedFile, setSelectedFile] = useState(null);
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
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nom', newSubmission.nom);
      formDataToSend.append('type', newSubmission.type);
      formDataToSend.append('statut', newSubmission.statut);
      formDataToSend.append('stageId', selectedTache.stageId);
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await fetch('http://localhost:5000/compteRendus', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la soumission');
      }

      const result = await response.json();
      showNotification('Compte-rendu soumis avec succès');

      // Reset form and close modal
      setNewSubmission({
        nom: '',
        type: 'Rapport',
        statut: 'En attente'
      });
      setSelectedFile(null);
      setShowSubmissionModal(false);
      setSelectedTache(null);
      
      // Refresh taches
      fetchTaches();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification(error.message || 'Erreur lors de la soumission du compte-rendu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmissionModal = (tache) => {
    setSelectedTache(tache);
    setSelectedFile(null); // Reset file selection
    setNewSubmission({
      nom: '',
      type: 'Rapport',
      statut: 'En attente'
    });
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
            <form onSubmit={handleSubmitCompteRendu} encType="multipart/form-data">
              <div className="form-group">
                <label>Nom du compte-rendu:</label>
                <input
                  type="text"
                  value={newSubmission.nom}
                  onChange={(e) => setNewSubmission({...newSubmission, nom: e.target.value})}
                  required
                  placeholder="Entrez le nom du compte-rendu"
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

              <div className="form-group">
                <label>Fichier (optionnel):</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleFileChange}
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-input-button">
                    Choisir un fichier
                  </label>
                </div>
                <small className="file-info">
                  Formats acceptés: PDF, DOC, DOCX, TXT, RTF (max 10MB)
                </small>
                {selectedFile && (
                  <div className="selected-file-info">
                    <p><strong>Fichier sélectionné:</strong> {selectedFile.name}</p>
                    <p><strong>Taille:</strong> {formatFileSize(selectedFile.size)}</p>
                  </div>
                )}
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
