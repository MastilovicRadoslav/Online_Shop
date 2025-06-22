import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [imageUrl, setImageUrl] = useState("");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImageUrl(res.data.imageUrl); // ✅ dobavljanje iz baze
      } catch (err) {
        console.error("Greška pri dohvatanju korisnika:", err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="customer-dashboard">
      <div className="top-right-shape"></div>
      <div className="bottom-left-shape"></div>

      <div className="profile-badge">
        <img
          src={`/images/${imageUrl || "profile-placeholder.png"}`}
          alt="Profile"
          className="profile-image"
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
