import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
import "./encadrant.css"; // Optional for extra layout styling

const Layout = () => {
  return (
    <div className="layout-container">
      <SideBar />
        <Outlet />
    </div>
  );
};

export default Layout;
