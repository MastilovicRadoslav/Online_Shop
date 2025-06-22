import React, { useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./AddUserModal.css";

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    contactNumber: "",
    imageUrl: ""
  });

  const [selectedImageName, setSelectedImageName] = useState("");
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Auth/register", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUserAdded();
      onClose();
    } catch (err) {
      console.error("Greška:", err);
      setError("Greška prilikom registracije korisnika.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="modal-form" onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input name="username" placeholder="Username" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} required />
          
          <label className="image-upload-label">
            {selectedImageName || "Upload Image"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const filename = file.name;
                  setUser({ ...user, imageUrl: filename });
                  setSelectedImageName(filename);
                }
              }}
            />
          </label>

          {error && <p className="error-msg">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default AddUserModal;
