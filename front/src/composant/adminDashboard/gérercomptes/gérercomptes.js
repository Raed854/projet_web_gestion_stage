import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Card, Table } from "react-bootstrap";
import { Pencil, Trash2, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditUser from "../edituser/edituser";
import SideBar from "../../sidebar/sidebar";
export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, nom: "Dupont", prenom: "Jean", email: "jean@example.com" },
    { id: 2, nom: "Martin", prenom: "Claire", email: "claire@example.com" },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleUpdate = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null); 
  };

  return (
    <Card className="shadow p-3 mb-5 bg-body rounded">
      <SideBar/>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestion des utilisateurs</h2>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} className="me-2" /> Ajouter
          </Button>
        </div>

      
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
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

        {/* Tableau utilisateurs */}
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
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleUpdate(user)}
                  >
                    <Pencil size={14} /> Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={14} /> Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal Modifier utilisateur */}
        <Modal show={!!editingUser} onHide={() => setEditingUser(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier l'utilisateur</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingUser && (
              <EditUser
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onSave={handleSaveUser}
              />
            )}
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
}
