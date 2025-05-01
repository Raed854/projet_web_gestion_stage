import React from "react";
import './Bilanrapide.css';
import SideBar from "../../sidebar/sidebar";

export default function DashboardSummary() {
  return (
    <div className="dashboard-table-container">
      <SideBar/>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Valeur</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="category">Utilisateurs actifs</td>
            <td className="value">128</td>
            <td></td>
          </tr>
          <tr>
            <td className="category">Stages</td>
            <td className="value">63</td>
            <td className="secondary-value">
              En cours: 18 | Terminés: 45
            </td>
          </tr>
          <tr>
            <td>
              <span className="progress-indicator in-progress"></span>
              Projets en cours
            </td>
            <td className="value">35</td>
            <td></td>
          </tr>
          <tr>
            <td>
              <span className="progress-indicator completed"></span>
              Projets terminés
            </td>
            <td className="value">40</td>
            <td></td>
          </tr>
          <tr className="total">
            <td className="category">Total des projets</td>
            <td className="value">75</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}