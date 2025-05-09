import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  TextareaAutosize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import './etusdient.css';
import SideBar from "../sidebar/sidebar";
import CloseIcon from '@mui/icons-material/Close';

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
      jalons: [
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
      jalons: [
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
    <div className="tableau-bord-conteneur">
      <SideBar />
      <div className="contenu-tableau-bord">
        <h2 className="titre-tableau-bord">Liste des stages</h2>
        <table className="tableau-stages">
          <thead>
            <tr>
              <th>Nom du stage</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Message</th>
              <th>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.id}>
                <td>
                  <button 
                    className="lien-stage"
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
            {selectedStage && <TableauStage stage={selectedStage} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const TableauStage = ({ stage }) => {
  const [soumissions, setSoumissions] = useState([]);
  const [jalonChoisi, setJalonChoisi] = useState("");
  const [fichier, setFichier] = useState(null);
  const [commentaire, setCommentaire] = useState("");

  const handleSoumettre = () => {
    if (jalonChoisi && fichier) {
      const nouvelleSoumission = {
        jalon: jalonChoisi,
        date: new Date().toISOString().split("T")[0],
        commentaire,
        nomFichier: fichier.name,
        statut: "En attente"
      };
      setSoumissions([...soumissions, nouvelleSoumission]);
      setJalonChoisi("");
      setFichier(null);
      setCommentaire("");
    }
  };

  return (
    <div className="tableau-stage">
      <h2 className="titre-stage">Tableau de bord du stage</h2>

      <Card>
        <CardContent className="info-stage">
          <p><strong>Nom :</strong> {stage.nom}</p>
          <p><strong>Dates :</strong> {stage.dateDebut} → {stage.dateFin}</p>
          <p><strong>Objectifs :</strong> {stage.objectifs}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="section-jalons">
          <h3 className="titre-section">Jalons</h3>
          <ul className="liste-jalons">
            {stage.jalons.map((m) => (
              <li key={m.id}>
                {m.title} (échéance : {m.deadline}) — <span className="statut-jalon">{m.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="formulaire-soumission">
          <h3 className="titre-section">Soumettre un rapport</h3>
          <div className="conteneur-formulaire">
            <label>Jalon :</label>
            <select
              className="selection-jalon"
              value={jalonChoisi}
              onChange={(e) => setJalonChoisi(e.target.value)}
            >
              <option value="">-- Choisir un jalon --</option>
              {stage.jalons.map((m) => (
                <option key={m.id} value={m.title}>{m.title}</option>
              ))}
            </select>

            <label>Commentaire :</label>
            <TextareaAutosize 
              value={commentaire} 
              onChange={(e) => setCommentaire(e.target.value)}
              className="zone-commentaire"
            />

            <label>Fichier :</label>
            <Input 
              type="file" 
              onChange={(e) => setFichier(e.target.files[0])}
              className="champ-fichier"
            />

            <Button 
              onClick={handleSoumettre}
              className="bouton-soumettre"
              disabled={!jalonChoisi || !fichier}
            >
              Soumettre
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="historique-soumissions">
          <h3 className="titre-section">Historique des soumissions</h3>
          {soumissions.length === 0 ? (
            <p className="aucune-soumission">Aucune soumission pour le moment.</p>
          ) : (
            <ul className="liste-soumissions">
              {soumissions.map((s, i) => (
                <li key={i} className="soumission-item">
                  <strong>{s.jalon}</strong> — soumis le {s.date} <br />
                  Fichier : {s.nomFichier} <br />
                  Commentaire : {s.commentaire} <br />
                  Statut : <span className="statut-soumission">{s.statut}</span>
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
