import React, { useState } from 'react';
import { Button, Card, Table, Form } from 'react-bootstrap';
import SideBar from '../../sidebar/sidebar';
const ReportGeneratorBootstrap = () => {
  const [reportType, setReportType] = useState('stages');

  const mockData = {
    stages: [
      { id: 1, nom: 'Stage Dev', etudiant: 'Ali', societe: 'TechCorp' },
      { id: 2, nom: 'Stage Design', etudiant: 'Sami', societe: 'DesignX' },
    ],
    stats: [
      { categorie: 'Utilisateurs actifs', total: 120 },
      { categorie: 'Stagiaires inscrits', total: 45 },
    ],
  };

  const handleExport = (format) => {
    alert(`Exportation ${format.toUpperCase()} du rapport : ${reportType}`);
  };

  return (
    <Card className="p-3">
      <SideBar/>
      <Card.Body>
        <h3>Génération de rapport</h3>

        <Form.Group className="mb-3 mt-3" controlId="reportSelect">
          <Form.Label>Type de rapport</Form.Label>
          <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="stages">Liste des stages</option>
            <option value="stats">Statistiques des utilisateurs</option>
          </Form.Select>
        </Form.Group>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {reportType === 'stages' ? (
                <>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Étudiant</th>
                  <th>Société</th>
                </>
              ) : (
                <>
                  <th>Catégorie</th>
                  <th>Total</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(reportType === 'stages' ? mockData.stages : mockData.stats).map((item, index) => (
              <tr key={index}>
                {reportType === 'stages' ? (
                  <>
                    <td>{item.id}</td>
                    <td>{item.nom}</td>
                    <td>{item.etudiant}</td>
                    <td>{item.societe}</td>
                  </>
                ) : (
                  <>
                    <td>{item.categorie}</td>
                    <td>{item.total}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex gap-3 mt-3">
          <Button variant="primary" onClick={() => handleExport('pdf')}>
            Exporter PDF
          </Button>
          <Button variant="success" onClick={() => handleExport('excel')}>
            Exporter Excel
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReportGeneratorBootstrap;
