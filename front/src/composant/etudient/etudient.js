import React, { useState } from "react";
import { Card, CardContent, Button, Input, TextareaAutosize, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import './etusdient.css';
import SideBar from "../sidebar/sidebar";
import CloseIcon from '@mui/icons-material/Close'; // For closing dialog

const DashboardPage = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const stages = [
    {
      id: 1,
      nom: "Développement d'une application web",
      dateDebut: "2025-04-01",
      dateFin: "2025-07-01",
      objectifs: "Découvrir l'environnement professionnel, développer un projet web.",
      milestones: [
        { id: 1, title: "Rapport d'avancement", deadline: "2025-05-15", status: "Non soumis" },
        { id: 2, title: "Rapport final", deadline: "2025-06-30", status: "Non soumis" }
      ]
    },
    {
      id: 2,
      nom: "Analyse des données marketing",
      dateDebut: "2025-03-01",
      dateFin: "2025-06-01",
      objectifs: "Étudier les comportements clients, créer des rapports de performance.",
      milestones: [
        { id: 1, title: "Rapport initial", deadline: "2025-03-15", status: "Non soumis" },
        { id: 2, title: "Présentation finale", deadline: "2025-05-30", status: "Non soumis" }
      ]
    }
  ];

  const handleOpenDialog = (stage) => {
    setSelectedStage(stage);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStage(null);
  };

  return (
    <div className="dashboard-container">
      <SideBar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Liste des stages</h2>
        <table className="stages-table">
          <thead>
            <tr>
              <th>Nom du stage</th>
              <th>Date de début</th>
              <th>Date de fin</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.id}>
                <td>
                  <button 
                    className="stage-link"
                    onClick={() => handleOpenDialog(stage)}
                  >
                    {stage.nom}
                  </button>
                </td>
                <td>{stage.dateDebut}</td>
                <td>{stage.dateFin}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            Détails du stage
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedStage && <DashboardStage stage={selectedStage} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const DashboardStage = ({ stage }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");

  if (!stage) return null;

  const handleSubmit = () => {
    if (selectedMilestone && file) {
      const newSubmission = {
        milestone: selectedMilestone,
        date: new Date().toISOString().split("T")[0],
        comment,
        fileName: file.name,
        status: "En attente"
      };
      setSubmissions([...submissions, newSubmission]);
      setSelectedMilestone("");
      setFile(null);
      setComment("");
    }
  };

  return (
    <div className="stage-dashboard">
      <h2 className="stage-title">Tableau de bord du stage</h2>

      <Card>
        <CardContent className="stage-info">
          <p><strong>Nom :</strong> {stage.nom}</p>
          <p><strong>Dates :</strong> {stage.dateDebut} → {stage.dateFin}</p>
          <p><strong>Objectifs :</strong> {stage.objectifs}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="milestones-section">
          <h3 className="section-title">Jalons</h3>
          <ul className="milestones-list">
            {stage.milestones.map((m) => (
              <li key={m.id}>
                {m.title} (échéance : {m.deadline}) — <span className="milestone-status">{m.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="submission-form">
          <h3 className="section-title">Soumettre un rapport</h3>
          <div className="form-container">
            <label>Jalon :</label>
            <select
              className="milestone-select"
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
            >
              <option value="">-- Choisir un jalon --</option>
              {stage.milestones.map((m) => (
                <option key={m.id} value={m.title}>{m.title}</option>
              ))}
            </select>

            <label>Commentaire :</label>
            <TextareaAutosize 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              className="comment-textarea"
            />

            <label>Fichier :</label>
            <Input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />

            <Button 
              onClick={handleSubmit}
              className="submit-button"
              disabled={!selectedMilestone || !file}
            >
              Soumettre
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="submissions-history">
          <h3 className="section-title">Historique des soumissions</h3>
          {submissions.length === 0 ? (
            <p className="no-submissions">Aucune soumission pour le moment.</p>
          ) : (
            <ul className="submissions-list">
              {submissions.map((s, i) => (
                <li key={i} className="submission-item">
                  <strong>{s.milestone}</strong> — soumis le {s.date} <br />
                  Fichier : {s.fileName} <br />
                  Commentaire : {s.comment} <br />
                  Statut : <span className="submission-status">{s.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
