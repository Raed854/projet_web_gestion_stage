import React, { useState, useEffect } from "react";
import './Bilanrapide.css';
import SideBar from "../../sidebar/sidebar";
import axios from 'axios';
import html2canvas from 'html2canvas';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: { size: 12 }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

const captureDashboard = async () => {
  const dashboardElement = document.querySelector('.dashboard-container');
  if (!dashboardElement) return;

  try {
    const canvas = await html2canvas(dashboardElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#f8f9fa'
    });

    // Create download link
    const link = document.createElement('a');
    link.download = `tableau-de-bord-${new Date().toLocaleDateString('fr-FR')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error capturing dashboard:', error);
  }
};

export default function DashboardSummary() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, etudiants: 0, encadrants: 0 },
    stages: { total: 0, enCours: 0, termines: 0 },
    compteRendus: { total: 0, enAttente: 0, acceptes: 0, refuses: 0 },
    taches: { total: 0, completed: 0, inProgress: 0 }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('jwt');
      const headers = { Authorization: `Bearer ${token}` };      try {
        const [usersResponse, stagesResponse, compteRendusResponse, tachesResponse] = await Promise.all([
          axios.get('http://localhost:5000/users', { headers }),
          axios.get('http://localhost:5000/stages', { headers }),
          axios.get('http://localhost:5000/compterendus', { headers }),
          axios.get('http://localhost:5000/taches', { headers })
        ]);        const users = usersResponse.data;
        const stages = stagesResponse.data;
        const compteRendus = compteRendusResponse.data;
        const taches = tachesResponse.data;

        setDashboardData({
          users: {
            total: users.length,
            etudiants: users.filter(u => u.role === 'etudiant').length,
            encadrants: users.filter(u => u.role === 'encadrant').length
          },
          stages: {
            total: stages.length,
            enCours: stages.filter(s => s.statut === true).length,
            termines: stages.filter(s => s.statut === false).length
          },
          compteRendus: {
            total: compteRendus.length,
            enAttente: compteRendus.filter(cr => cr.statut === 'En attente').length,
            acceptes: compteRendus.filter(cr => cr.statut === 'Accepté').length,
            refuses: compteRendus.filter(cr => cr.statut === 'Refusé').length
          },          taches: {
            total: taches.length,
            completed: taches.filter(t => t.statut === true).length,
            inProgress: taches.filter(t => t.statut === false).length
          }
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Erreur lors du chargement des données du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <SideBar />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <SideBar />
      <div className="dashboard-container">        <div className="dashboard-header">
          <h1 className="dashboard-title">Tableau de Bord</h1>
        </div><section className="stats-section">
          <div className="section-header">
            <h2 className="section-title">Statistiques Globales</h2>
            <div className="section-actions">
              <button className="refresh-button" onClick={() => window.location.reload()}>
                Actualiser
              </button>
              <button 
                className="refresh-button" 
                style={{ backgroundColor: '#805ad5' }}
                onClick={captureDashboard}
              >
                Télécharger le Rapport
              </button>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Utilisateurs</h3>
              <div className="stat-numbers">
                <div className="main-stat">{dashboardData.users.total}</div>
                <div className="sub-stats">
                  <span data-value={dashboardData.users.etudiants}>Étudiants</span>
                  <span data-value={dashboardData.users.encadrants}>Encadrants</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Stages</h3>
              <div className="stat-numbers">
                <div className="main-stat">{dashboardData.stages.total}</div>
                <div className="sub-stats">
                  <span data-value={dashboardData.stages.enCours}>En cours</span>
                  <span data-value={dashboardData.stages.termines}>Terminés</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Comptes Rendus</h3>
              <div className="stat-numbers">
                <div className="main-stat">{dashboardData.compteRendus.total}</div>
                <div className="sub-stats">
                  <span data-value={dashboardData.compteRendus.enAttente}>En attente</span>
                  <span data-value={dashboardData.compteRendus.acceptes}>Acceptés</span>
                  <span data-value={dashboardData.compteRendus.refuses}>Refusés</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <h3>Tâches</h3>
              <div className="stat-numbers">
                <div className="main-stat">{dashboardData.taches.total}</div>
                <div className="sub-stats">
                  <span data-value={dashboardData.taches.completed}>Terminées</span>
                  <span data-value={dashboardData.taches.inProgress}>En cours</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="charts-section">
          <h2 className="section-title">Visualisations</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>État des Stages</h3>
              <div className="chart-container">
                <Pie 
                  data={{
                    labels: ['En cours', 'Terminés'],
                    datasets: [{
                      data: [dashboardData.stages.enCours, dashboardData.stages.termines],
                      backgroundColor: ['#4299e1', '#48bb78'],
                      borderWidth: 0,
                      hoverOffset: 4
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>État des Comptes Rendus</h3>
              <div className="chart-container">
                <Bar
                  data={{
                    labels: ['En attente', 'Acceptés', 'Refusés'],
                    datasets: [{
                      label: 'Nombre de comptes rendus',
                      data: [
                        dashboardData.compteRendus.enAttente,
                        dashboardData.compteRendus.acceptes,
                        dashboardData.compteRendus.refuses
                      ],
                      backgroundColor: ['#ecc94b', '#48bb78', '#f56565'],
                      borderRadius: 6,
                      maxBarThickness: 50
                    }]
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          font: { size: 12 }
                        },
                        grid: {
                          display: true,
                          drawBorder: false,
                          color: '#e2e8f0'
                        }
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 12 } }
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="chart-card">
              <h3>Distribution des Utilisateurs</h3>
              <div className="chart-container">
                <Pie
                  data={{
                    labels: ['Étudiants', 'Encadrants'],
                    datasets: [{
                      data: [dashboardData.users.etudiants, dashboardData.users.encadrants],
                      backgroundColor: ['#4299e1', '#9f7aea'],
                      borderWidth: 0,
                      hoverOffset: 4
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}