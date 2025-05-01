import React, { useState } from 'react';
import { Table, Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import './encadrant.css';
import SideBar from "../sidebar/sidebar";

const EncadrantInterface = () => {
  const [stagiaires, setStagiaires] = useState([
    {
      id: 1,
      nom: 'Stagiaire 1',
      progression: '60%',
      rapport: '',
      email: 'stagiaire1@email.com',
      niveau: 'Licence',
      entreprise: 'Entreprise A',
      duree: '6 mois',
      dateDebut: '01/03/2024',
      dateFin: '31/08/2024',
      tuteurEntreprise: 'M. Dupont',
      description: 'Développement d\'une application web fullstack'
    },
    {
      id: 2,
      nom: 'Stagiaire 2',
      progression: '80%',
      rapport: '',
      email: 'stagiaire2@email.com',
      niveau: 'Master',
      entreprise: 'Entreprise B',
      duree: '4 mois',
      dateDebut: '15/04/2024',
      dateFin: '15/08/2024',
      tuteurEntreprise: 'Mme. Martin',
      description: 'Analyse de données et machine learning'
    }
  ]);

  const [selectedStagiaire, setSelectedStagiaire] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const selectStagiaire = (stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setCommentaire(stagiaire.rapport || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStagiaire(null);
    setCommentaire('');
    setMessage('');
  };

  const handleValidation = (action) => {
    if (selectedStagiaire) {
      const updatedStagiaires = stagiaires.map((stagiaire) =>
        stagiaire.id === selectedStagiaire.id
          ? { ...stagiaire, rapport: action === 'valider' ? 'Validé' : 'Refusé' }
          : stagiaire
      );
      setStagiaires(updatedStagiaires);
      setShowModal(false);
    }
  };

  const handleMessageSend = () => {
    if (selectedStagiaire && message.trim() !== '') {
      alert(`Message envoyé à ${selectedStagiaire.nom}: ${message}`);
      setMessage('');
    }
  };

  return (
    <Container fluid className="encadrant-container">
      <Row>
        <SideBar />
        <Col md={12} className="main-content">
          <h3 className="mb-4">Liste des Stagiaires</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Entreprise</th>
                <th>Durée</th>
                <th>Progression</th>
                <th>Statut Rapport</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((stagiaire) => (
                <tr key={stagiaire.id}>
                  <td className="clickable-name" onClick={() => selectStagiaire(stagiaire)}>
                    {stagiaire.nom}
                  </td>
                  <td>{stagiaire.entreprise}</td>
                  <td>{stagiaire.duree}</td>
                  <td>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: stagiaire.progression }}
                        aria-valuenow={parseInt(stagiaire.progression)}
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
                        {stagiaire.progression}
                      </div>
                    </div>
                  </td>
                  <td>{stagiaire.rapport || 'En attente'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modale pour afficher les détails du stagiaire */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        centered 
        size="lg"
        className="detail-modal"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStagiaire && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nom du stagiaire</Form.Label>
                    <Form.Control value={selectedStagiaire.nom} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Niveau d'études</Form.Label>
                    <Form.Control value={selectedStagiaire.niveau} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Entreprise d'accueil</Form.Label>
                    <Form.Control value={selectedStagiaire.entreprise} readOnly />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tuteur entreprise</Form.Label>
                    <Form.Control value={selectedStagiaire.tuteurEntreprise} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de début</Form.Label>
                    <Form.Control value={selectedStagiaire.dateDebut} readOnly />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date de fin</Form.Label>
                    <Form.Control value={selectedStagiaire.dateFin} readOnly />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Durée totale</Form.Label>
                    <Form.Control value={selectedStagiaire.duree} readOnly />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description du stage</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={selectedStagiaire.description} 
                  readOnly 
                />
              </Form.Group>

              <hr />

              <h5 className="mb-3">Évaluation du rapport</h5>
              <Form.Group className="mb-3">
                <Form.Label>Commentaires</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder="Ajouter vos commentaires..."
                />
              </Form.Group>

              <div className="mb-3 d-flex justify-content-between">
                <Button variant="success" onClick={() => handleValidation('valider')}>
                  Valider le rapport
                </Button>
                <Button variant="danger" onClick={() => handleValidation('refuser')}>
                  Refuser le rapport
                </Button>
              </div>

              <hr />

              <Form.Group className="mb-3">
                <Form.Label>Envoyer un message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Votre message au stagiaire..."
                />
                <div className="mt-2 d-flex justify-content-end">
                  <Button 
                    variant="primary" 
                    onClick={handleMessageSend}
                    disabled={!message.trim()}
                  >
                    Envoyer
                  </Button>
                </div>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EncadrantInterface;
