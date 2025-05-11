import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
import "./encadrant.css"; // Optional for extra layout styling

const Layout = () => {
  return (
    <div className="layout-container">
      <SideBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
