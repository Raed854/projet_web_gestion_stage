import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCog,
  faTasks,
  faFileAlt,
  faGraduationCap,
  faChartBar,
  faClipboardList,
  faSignOutAlt,
  faUserGraduate,
  faBook,
  faComments,
  faUser
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    navigate("/");
  };  const renderAdminLinks = () => (
    <>
      <li>
        <Link to="/admin/dashboard">
          <FontAwesomeIcon icon={faUsers} /> Tableau de bord
        </Link>
      </li>
      <li>
        <Link to="/admin/stage">
          <FontAwesomeIcon icon={faCog} /> Gestion des Stages
        </Link>
      </li>
      <li>
        <Link to="/admin/bilan">
          <FontAwesomeIcon icon={faChartBar} /> Bilan Rapide
        </Link>
      </li>
      <li>
        <Link to="/admin/profile">
          <FontAwesomeIcon icon={faUser} /> Mon Profil
        </Link>
      </li>
    </>
  );
  const renderEncadrantLinks = () => (
    <>
      <li>
        <Link to="/encadrant/stage">
          <FontAwesomeIcon icon={faClipboardList} /> Liste des Stages
        </Link>
      </li>
      <li>
        <Link to="/encadrant/stagiere">
          <FontAwesomeIcon icon={faUserGraduate} /> Liste des Étudiants
        </Link>
      </li>
      <li>
        <Link to="/encadrant/comptes-rendus">
          <FontAwesomeIcon icon={faBook} /> Comptes Rendus
        </Link>
      </li>
      <li>
        <Link to="/chat">
          <FontAwesomeIcon icon={faComments} /> Messages
        </Link>
      </li>
      <li>
        <Link to="/encadrant/profile">
          <FontAwesomeIcon icon={faUser} /> Mon Profil
        </Link>
      </li>
    </>
  );  const renderEtudiantLinks = () => (
    <>
      <li>
        <Link to="/etudiant/stages">
          <FontAwesomeIcon icon={faGraduationCap} /> Mes Stages
        </Link>
      </li>
      <li>
        <Link to="/etudiant/taches">
          <FontAwesomeIcon icon={faTasks} /> Mes Tâches
        </Link>
      </li>
      <li>
        <Link to="/etudiant/comptes-rendus">
          <FontAwesomeIcon icon={faBook} /> Comptes Rendus
        </Link>
      </li>
      <li>
        <Link to="/chat">
          <FontAwesomeIcon icon={faComments} /> Messages
        </Link>
      </li>
      <li>
        <Link to="/etudiant/profile">
          <FontAwesomeIcon icon={faUser} /> Mon Profil
        </Link>
      </li>
    </>
  );

  return (
    <div className="sidebar">
      <h3>Navigation</h3>
      <ul>
        {userRole === 'admin' && renderAdminLinks()}
        {userRole === 'encadrant' && renderEncadrantLinks()}
        {userRole === 'etudiant' && renderEtudiantLinks()}
      </ul>
      <button className="logOutButton" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
      </button>
    </div>
  );
};

export default SideBar;
