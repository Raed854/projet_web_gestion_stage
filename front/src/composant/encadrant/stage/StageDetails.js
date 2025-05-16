import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StageDetail.css';

const StageDetail = () => {
  const { id } = useParams();
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taches, setTaches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTache, setNewTache] = useState({ nom: '', description: '', statut: 'À faire', ddl: '' });
  const [editingTache, setEditingTache] = useState(null);

  useEffect(() => {
    const fetchStageDetails = async () => {
      const token = localStorage.getItem('jwt'); // Récupérer le JWT du localStorage
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:5000/stages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // Ajouter le JWT dans l'en-tête Authorization
          }
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer les détails du stage');
        }

        const data = await response.json();
        setStage(data);
        setError(null);
        
        // Fetch taches for this stage
        fetchTaches(token);
      } catch (error) {
        console.error(error);
        setError('Erreur lors du chargement des détails du stage');
      } finally {
        setLoading(false);
      }
    };

    fetchStageDetails();
  }, [id]);

  const fetchTaches = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/taches/stage/${id}`, {
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
      console.error('Erreur lors du chargement des tâches:', error);
    }
  };

  const handleAddTache = async () => {
    const token = localStorage.getItem('jwt');
    
    try {
      const response = await fetch(`http://localhost:5000/taches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newTache, stageId: id })
      });

      if (!response.ok) {
        throw new Error('Impossible d\'ajouter la tâche');
      }

      const addedTache = await response.json();
      setTaches([...taches, addedTache]);
      setNewTache({ nom: '', description: '', statut: 'À faire', ddl: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  };

  const handleUpdateTache = async () => {
    if (!editingTache) return;
    
    const token = localStorage.getItem('jwt');
    
    try {
      const response = await fetch(`http://localhost:5000/taches/${editingTache.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingTache)
      });

      if (!response.ok) {
        throw new Error('Impossible de mettre à jour la tâche');
      }

      const updatedTaches = taches.map(tache => 
        tache.id === editingTache.id ? editingTache : tache
      );
      
      setTaches(updatedTaches);
      setEditingTache(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  const handleDeleteTache = async (tacheId) => {
    const token = localStorage.getItem('jwt');
    
    try {
      const response = await fetch(`http://localhost:5000/taches/${tacheId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de supprimer la tâche');
      }

      setTaches(taches.filter(tache => tache.id !== tacheId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Chargement des détails...</div>
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

  if (!stage) return null;

  return (
    <div className="stage-detail-container">
      <h1 className="stage-title">{stage.intitule}</h1>
      
      <div className="stage-info-grid">
        <div className="info-item">
          <span className="info-label">Type :</span>
          <span className="info-value">{stage.typeStage}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Période :</span>
          <span className="info-value">{formatDate(stage.dateDebut)} - {formatDate(stage.dateFin)}</span>
        </div>
        
        <div className="info-item status">
          <span className="info-label">Statut :</span>
          <span className={`status-badge ${stage.statut ? 'active' : 'inactive'}`}>
            {stage.statut ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </div>
      
      <div className="description-section">
        <h2 className="section-title">Description</h2>
        <p className="description-text">{stage.description}</p>
      </div>

      {/* Section des tâches */}
      <div className="tasks-section">
        <div className="tasks-header">
          <h2 className="section-title">Tâches</h2>
          <button 
            className="add-task-button"
            onClick={() => setShowAddForm(true)}
          >
            + Ajouter une tâche
          </button>
        </div>

        {taches.length === 0 ? (
          <p className="no-tasks">Aucune tâche associée à ce stage</p>
        ) : (
          <div className="tasks-list">
            {taches.map(tache => (
                              <div key={tache.id} className="task-item">
                {editingTache && editingTache.id === tache.id ? (
                  <div className="task-edit-form">
                    <div className="form-group">
                      <label>Nom:</label>
                      <input
                        type="text"
                        value={editingTache.nom}
                        onChange={(e) => setEditingTache({...editingTache, nom: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        value={editingTache.description}
                        onChange={(e) => setEditingTache({...editingTache, description: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date limite:</label>
                      <input
                        type="date"
                        value={editingTache.ddl}
                        onChange={(e) => setEditingTache({...editingTache, ddl: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Statut:</label>
                      <select
                        value={editingTache.statut}
                        onChange={(e) => setEditingTache({...editingTache, statut: e.target.value})}
                      >
                        <option value="0">À faire</option>
                        <option value="1">Terminé</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      <button className="save-button" onClick={handleUpdateTache}>Enregistrer</button>
                      <button className="cancel-button" onClick={() => setEditingTache(null)}>Annuler</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <div className="task-header">
                        <h3 className="task-title">{tache.nom}</h3>
                        <span className={`task-status ${tache.statut ? "terminé":"a-faire"}`}>
                          {tache.statut ? "terminé":"À faire"}
                        </span>
                      </div>
                      <p className="task-description">{tache.description}</p>
                      {tache.ddl && (
                        <p className="task-deadline">
                          <span className="deadline-label">Date limite:</span> {formatDate(tache.ddl)}
                        </p>
                      )}
                    </div>
                    <div className="task-actions">
                      <button 
                        className="edit-button"
                        onClick={() => setEditingTache(tache)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteTache(tache.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal d'ajout de tâche */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Ajouter une nouvelle tâche</h3>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  value={newTache.nom}
                  onChange={(e) => setNewTache({...newTache, nom: e.target.value})}
                  placeholder="Nom de la tâche"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newTache.description}
                  onChange={(e) => setNewTache({...newTache, description: e.target.value})}
                  placeholder="Décrivez la tâche..."
                />
              </div>
              <div className="form-group">
                <label>Date limite:</label>
                <input
                  type="date"
                  value={newTache.ddl}
                  onChange={(e) => setNewTache({...newTache, ddl: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Statut:</label>
                <select
                  value={newTache.statut}
                  onChange={(e) => setNewTache({...newTache, statut: e.target.value})}
                >
                  <option value="0">À faire</option>
                  <option value="1">Terminé</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="add-button" onClick={handleAddTache}>Ajouter</button>
                <button className="cancel-button" onClick={() => setShowAddForm(false)}>Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageDetail;