import React, { useState, useEffect, useContext } from "react";
import "./Profile.css";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaCamera, FaImage } from "react-icons/fa";  // Dodaj import za ikone



const Profile = () => {
  const { token, logout } = useContext(AuthContext); // ✅ Dodan logout
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    contactNumber: "",
    password: "",
  });

  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Greška pri dohvaćanju profila:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put("/user/me", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Podaci su uspješno sačuvani.");
      setEditing(false);
    } catch (err) {
      console.error("Greška pri ažuriranju profila:", err);
    }
  };

  const handleLogout = () => {
    logout();             // ✅ Briše token i kontekst
    navigate("/");        // ✅ Prebaci na login
  };

  const uploadImage = async (imageName) => {
    try {
      await api.put("/user/me/photo", imageName, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Slika uspješno postavljena!");
      setShowUpload(false);
    } catch (err) {
      console.error("Greška pri uploadu slike:", err);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-sidebar">
        <ul>
          <li>Personal information settings</li>
          <li style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Edit Profile</h2>
          <div className="profile-image-wrapper" onClick={() => setShowUpload(!showUpload)}>
            {userData.imageUrl ? (
              <img src={`/images/${userData.imageUrl}`} alt="Profile" />
            ) : (
              <FaUserCircle size={80} color="#b210ff" />
            )}
          </div>
        </div>

        {!showUpload ? (
          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            <div className="profile-form-group double">
              <div>
                <label>First Name</label>
                <input
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>


            <div className="profile-form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <input
                  name="email"
                  type="email"
                  value={userData.email}
                  disabled
                />
                <FaCheckCircle className="green-check-icon" />
              </div>
            </div>



            <div className="profile-form-group">
              <label>Username</label>
              <input
                name="username"
                value={userData.username}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="profile-form-group">
              <label>Contact Number</label>
              <input
                name="contactNumber"
                value={userData.contactNumber}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="profile-form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <input
                  name="password"
                  type="password"
                  value={userData.password}
                  disabled
                />
                <FaCheckCircle className="green-check-icon" />
              </div>
            </div>



            <div className="profile-buttons">
              {editing ? (
                <>
                  <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="save-btn" onClick={handleSave}>Save</button>
                </>
              ) : (
                <button className="save-btn" onClick={() => setEditing(true)}>Edit</button>
              )}
            </div>

            {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
          </form>
        ) : (
          <div className="upload-section">
            <div className="upload-options">
              <div className="upload-option-text">
                <FaCamera size={40} /> {/* Ikona kamere */}
              </div>
              <div className="upload-option-text">
                Take photo with camera
              </div>
              <div className="upload-option-text">
                <FaImage size={40} /> {/* Ikona slike */}
              </div>
              <div className="upload-option-text">
                Upload Photo from your phone
              </div>
            </div>

            <div className="upload-buttons">
              <button className="upload-btn" onClick={() => document.getElementById("fileInput").click()}>
                Upload
              </button>
              <button className="skip-btn" onClick={() => setShowUpload(false)}>
                Skip
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="fileInput"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  uploadImage(file.name);
                }
              }}
            />
          </div>

        )}
      </div>
    </div>
  );
};

export default Profile;
