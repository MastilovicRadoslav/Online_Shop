import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  return (
    <div className="customer-dashboard">
      <div className="top-right-shape"></div>
      <div className="bottom-left-shape"></div>

      <div className="profile-badge">
        <img
          src="/profile-placeholder.png"
          alt="Profile"
          onClick={() => (window.location.href = "/customer-dashboard/profile")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <Navbar role="Customer" />
      <div className="dashboard-container">
        <Outlet />
      </div>
    </div>
  );
};


export default CustomerDashboard;
