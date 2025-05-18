import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Row, Col, Modal, Nav } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './stage.css';
import SideBar from "../../sidebar/sidebar";
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import axios from 'axios';
import UserSelector from '../../Login/UserSelector';

const EncadrantInterface = () => {
  const [activeTab, setActiveTab] = useState('stages');
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState("");
  const [selectedEncadrant, setSelectedEncadrant] = useState("");
  const [editStage, setEditStage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userCache, setUserCache] = useState({});

  const allowedTypes = ["PFE", "Stage d'été"];
  // Fetch stages from backend on mount
  useEffect(() => {
    const fetchStages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/stages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        
        // Fetch progress for each stage
        const stagesWithProgress = await Promise.all(
          response.data.map(async (stage) => {
            try {
              const progressResponse = await axios.get(`http://localhost:5000/stages/${stage.id}/progress`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwt')}`
                }
              });
              return { ...stage, progress: progressResponse.data.progress };
            } catch (error) {
              console.error(`Error fetching progress for stage ${stage._id}:`, error);
              return { ...stage, progress: 0 };
            }
          })
        );
        setStages(stagesWithProgress);
      } catch (error) {
        toast.error("Erreur lors du chargement des stages");
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  const validateStage = (stage) => {
    const startDate = parseISO(stage.dateDebut);
    const endDate = parseISO(stage.dateFin);
    
    if (!stage.intitule?.trim()) {
      toast.error("Le titre du stage est requis");
      return false;
    }

    if (!stage.typeStage?.trim()) {
      toast.error("Le type de stage est requis");
      return false;
    }

    if (isAfter(startDate, endDate)) {
      toast.error("La date de début doit être antérieure à la date de fin");
      return false;
    }

    if (isBefore(startDate, new Date())) {
      toast.warning("Attention: La date de début est dans le passé");
    }

    return true;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStage(null);
  };

  const selectStage = (stage) => {
    if (validateStage(stage)) {
      setSelectedStage(stage);
      setShowModal(true);
    }
  };

  // Add stage (backend)
  const handleAddStage = async (stageData) => {
    try {
      const response = await axios.post('http://localhost:5000/stages', stageData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      setStages(prev => [...prev, response.data]);
      toast.success("Stage créé avec succès");
      setActiveTab('stages');
    } catch (error) {
      toast.error("Erreur lors de la création du stage");
    }
  };

  // Update stage (backend)
  const handleUpdateStage = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/stages/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      setStages(prev => prev.map(s => s._id === id ? response.data : s));
      toast.success("Stage mis à jour");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du stage");
    }
  };

  // Delete stage (backend)
  const handleDeleteStage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/stages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      toast.success("Stage supprimé");
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de la suppression du stage");
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const getUserName = async (id) => {
    if (!id) return '';
    if (userCache[id]) return userCache[id];
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      const user = response.data;
      const name = user.nom + ' ' + (user.prenom || '');
      setUserCache(prev => ({ ...prev, [id]: name }));
      return name;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    // Preload all user names for displayed stages
    const preloadUsers = async () => {
      const ids = new Set();
      stages.forEach(s => {
        if (s.etudiantId) ids.add(s.etudiantId);
        if (s.encadrantId) ids.add(s.encadrantId);
      });
      for (const id of ids) {
        if (!userCache[id]) await getUserName(id);
      }
    };
    if (stages.length) preloadUsers();
    // eslint-disable-next-line
  }, [stages]);

  const renderContent = () => {
    switch(activeTab) {
      case 'create':
        return (
          <Form onSubmit={e => {
            e.preventDefault();
            const form = e.target;
            const stageData = {
              intitule: form.intitule.value,
              typeStage: form.typeStage.value,
              dateDebut: form.dateDebut.value,
              dateFin: form.dateFin.value,
              description: form.description.value,
              etudiantId: selectedEtudiant,
              encadrantId: selectedEncadrant,
              statut: true
            };
            if (!allowedTypes.includes(stageData.typeStage)) {
              toast.error("Le type de stage doit être 'PFE' ou 'Stage d'été'");
              return;
            }
            if (!stageData.etudiantId || !stageData.encadrantId) {
              toast.error("Veuillez sélectionner un étudiant et un encadrant.");
              return;
            }
            if (validateStage(stageData)) handleAddStage(stageData);
          }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Intitulé *</Form.Label>
                  <Form.Control name="intitule" type="text" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type de Stage *</Form.Label>
                  <Form.Select name="typeStage" required>
                    <option value="">Sélectionner un type</option>
                    <option value="PFE">PFE</option>
                    <option value="Stage d'été">Stage d'été</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de début *</Form.Label>
                  <Form.Control name="dateDebut" type="date" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date de fin *</Form.Label>
                  <Form.Control name="dateFin" type="date" required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <UserSelector type="etudiants" label="Étudiant" onSelect={setSelectedEtudiant} />
              </Col>
              <Col md={6}>
                <UserSelector type="encadrants" label="Encadrant" onSelect={setSelectedEncadrant} />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" as="textarea" rows={3} />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setActiveTab('stages')} className="me-2">
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Créer le stage
              </Button>
            </div>
          </Form>
        );
      case 'stages':
        if (loading) return <div>Chargement...</div>;
        return (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Intitulé</th>                  <th>Type de Stage</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Étudiant</th>
                  <th>Encadrant</th>
                  <th>Progression</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr key={stage._id}>
                    <td className="clickable-name">{stage.intitule}</td>
                    <td>{stage.typeStage}</td>
                    <td>{formatDate(stage.dateDebut)}</td>                    <td>{formatDate(stage.dateFin)}</td>
                    <td>{userCache[stage.etudiantId] || <span>...</span>}</td>
                    <td>{userCache[stage.encadrantId] || <span>...</span>}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${stage.progress}%` }}
                        />
                        <span className="progress-text">{stage.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${stage.statut ? 'active' : 'inactive'}`}>
                        {stage.statut ? 'en cours' : 'complet'}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEditStage(stage)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteStage(stage._id || stage.id)}
                        className="ms-2"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Modal show={showEditModal} onHide={handleEditModalClose} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Modifier le Stage</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {editStage && (
                  <Form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target;
                    const updatedStage = {
                      ...editStage,
                      intitule: form.intitule.value,
                      typeStage: form.typeStage.value,
                      dateDebut: form.dateDebut.value,
                      dateFin: form.dateFin.value,
                      description: form.description.value,
                      etudiantId: editStage.etudiantId,
                      encadrantId: editStage.encadrantId
                    };
                    await handleEditModalSave(updatedStage);
                  }}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Intitulé</Form.Label>
                          <Form.Control name="intitule" defaultValue={editStage.intitule} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Type de Stage</Form.Label>
                          <Form.Select name="typeStage" defaultValue={editStage.typeStage} required>
                            <option value="PFE">PFE</option>
                            <option value="Stage d'été">Stage d'été</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date de début</Form.Label>
                          <Form.Control name="dateDebut" type="date" defaultValue={editStage.dateDebut?.slice(0,10)} required />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Date de fin</Form.Label>
                          <Form.Control name="dateFin" type="date" defaultValue={editStage.dateFin?.slice(0,10)} required />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <UserSelector
                          type="etudiants"
                          label="Étudiant"
                          onSelect={id => setEditStage(prev => ({ ...prev, etudiantId: id }))}
                        />
                      </Col>
                      <Col md={6}>
                        <UserSelector
                          type="encadrants"
                          label="Encadrant"
                          onSelect={id => setEditStage(prev => ({ ...prev, encadrantId: id }))}
                        />
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control name="description" as="textarea" rows={3} defaultValue={editStage.description} />
                    </Form.Group>
                    <div className="text-end">
                      <Button variant="secondary" onClick={handleEditModalClose} className="me-2">
                        Annuler
                      </Button>
                      <Button type="submit" variant="primary">
                        Enregistrer
                      </Button>
                    </div>
                  </Form>
                )}
              </Modal.Body>
            </Modal>
          </>
        );
      default:
        return null;
    }
  };

  const handleEditStage = (stage) => {
    setEditStage(stage);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditStage(null);
  };

  const handleEditModalSave = async (updatedStage) => {
    try {
      const response = await axios.put(`http://localhost:5000/stages/${updatedStage.id}`, updatedStage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      toast.success("Stage modifié avec succès");
      setShowEditModal(false);
      setEditStage(null);
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de la modification du stage");
    }
  };

  return (
    <Container fluid className="encadrant-container">
      <SideBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Row>
        <Col md={12} className="main-content">
          <div className="mb-4">
            <h3 className="float-start">Gestion des Stages</h3>
            <Nav variant="tabs" className="mb-3 nav-tabs">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'stages'}
                  onClick={() => setActiveTab('stages')}
                >
                  Liste des stages
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'create'}
                  onClick={() => setActiveTab('create')}
                >
                  Créer un stage
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {renderContent()}
        </Col>
      </Row>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered 
        size="lg"
        className="detail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStage && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Intitulé</Form.Label>
                    <Form.Control value={selectedStage.intitule} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type de Stage</Form.Label>
                    <Form.Control value={selectedStage.typeStage} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control value={formatDate(selectedStage.dateDebut)} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control value={formatDate(selectedStage.dateFin)} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={selectedStage.description} 
                  readOnly 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Statut</Form.Label>
                <div>
                  <span className={`status-badge ${selectedStage.statut ? 'active' : 'inactive'}`}>
                    {selectedStage.statut ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EncadrantInterface;
