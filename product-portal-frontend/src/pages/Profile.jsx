// File: src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import "./Profile.css";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData({
          username: res.data.username,
          email: res.data.email,
        });
      } catch (err) {
        console.error("Greška pri dohvaćanju profila:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

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

  return (
    <div className="profile-container">
      <h2 className="profile-title">Edit Profile</h2>

      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
          disabled={!editing}
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          disabled={!editing}
        />

        {editing ? (
          <div className="profile-buttons">
            <button className="cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        ) : (
          <div className="profile-buttons">
            <button className="save-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
          </div>
        )}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>

      <div className="upload-section">
        <p>Profile Photo</p>
        <div className="upload-options">
          <button onClick={() => alert("Upload sa kamere uskoro")}>Take photo with camera</button>
          <button onClick={() => alert("Upload sa telefona uskoro")}>Upload from phone</button>
          <button className="skip-btn" onClick={() => alert("Preskočeno")}>Skip</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
