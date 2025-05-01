import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h3>Admin Menu</h3>
      <ul>
        <li>
          <Link to="/Bilan">
            <FontAwesomeIcon icon={faUsers} /> Bilan Rapide
          </Link>
        </li>
        <li>
          <Link to="/compte">
            <FontAwesomeIcon icon={faCog} /> Gérer Comptes
          </Link>
        </li>
        <li>
          <Link to="/rapport">
            <FontAwesomeIcon icon={faCog} /> Rapport
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
