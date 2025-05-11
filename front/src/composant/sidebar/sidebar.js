import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    navigate("/");
  };

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
          <Link to="/adminstage">
            <FontAwesomeIcon icon={faCog} /> Gestion des Stages
          </Link>
        </li>
        <li>
          <Link to="/users">
            <FontAwesomeIcon icon={faCog} /> Gérer Comptes
          </Link>
        </li>
      </ul>
      <button
        className="logOutButton"
        onClick={handleLogout}
        style={{ marginTop: "2rem", width: "100%" }}
      >
        Logout
      </button>
    </div>
  );
};

export default SideBar;
