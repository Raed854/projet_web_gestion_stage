import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../sidebar/sidebar';
import './EtudiantLayout.css';

const EtudiantLayout = () => {
  return (
    <div className="etudiant-layout">
      <SideBar />
      <div className="etudiant-content">
        <Outlet />
      </div>
    </div>
  );
};

export default EtudiantLayout;
