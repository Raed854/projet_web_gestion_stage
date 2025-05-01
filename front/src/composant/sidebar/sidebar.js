// src/composant/sidebar/sidebar.js
import React from "react";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h3>Admin Menu</h3>
      <ul>
        <li>
          <FontAwesomeIcon icon={faUsers} /> Utilisateurs
        </li>
        <li>
          <FontAwesomeIcon icon={faCog} /> Paramètres
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
