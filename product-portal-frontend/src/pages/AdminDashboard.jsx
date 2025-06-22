import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [imageUrl, setImageUrl] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImageUrl(res.data.imageUrl); // iz baze
      } catch (err) {
        console.error("Greška pri dohvatanju korisnika:", err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <div className="top-right-shape"></div>
      <div className="bottom-left-shape"></div>

      <div className="profile-badge">
        <img
          src={`/images/${imageUrl}`}
          alt="Profile"
          className="profile-image"
        />
      </div>

      <Navbar role="Admin" />
      <div className="dashboard-container">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
