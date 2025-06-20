import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "./AdminDashboard.css"; // dodaj novi fajl za layout

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="top-right-shape"></div>
      <div className="bottom-left-shape"></div>
      <div className="profile-badge">
        <img src="/profile-placeholder.png" alt="Profile" />
      </div>
      <Navbar role="Admin" />
      <div className="dashboard-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
