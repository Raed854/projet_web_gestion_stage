import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { Pencil, Trash2, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserManagement() {
  const [users] = useState([
    { id: 1, nom: "Dupont", prenom: "Jean", email: "jean@example.com" },
    { id: 2, nom: "Martin", prenom: "Claire", email: "claire@example.com" },
  ]);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Card className="shadow p-3 mb-5 bg-body rounded">
      <Card.Body>
        {/* Entête de gestion des utilisateurs */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestion des utilisateurs</h2>

          {/* Bouton Ajouter utilisateur */}
          <Button variant="primary" className="d-flex align-items-center" onClick={handleShow}>
            <Plus size={16} className="mr-2" /> Ajouter
          </Button>
        </div>

        {/* Modal pour ajouter un utilisateur */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Créer un utilisateur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Cliquez ci-dessous pour accéder au formulaire d'inscription :
            <div className="mt-4">
              <Link to="/signup" className="text-primary">
                Accéder à la page d'inscription
              </Link>
            </div>
          </Modal.Body>
        </Modal>

        {/* Tableau des utilisateurs */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <Pencil size={14} /> Modifier
                  </Button>
                  <Button variant="danger" size="sm">
                    <Trash2 size={14} /> Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
