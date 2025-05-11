import React from "react";
import './Forbidden.css';

const Forbidden = () => (
  <div className="forbidden-container">
    <div className="forbidden-code">403</div>
    <div className="forbidden-title">Accès refusé</div>
    <div className="forbidden-message">
      Vous n'avez pas la permission d'accéder à cette page.
    </div>
    <a href="/" className="forbidden-link">Retour à l'accueil</a>
  </div>
);

export default Forbidden;
