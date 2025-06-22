import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./EditUserModal.css";

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    contactNumber: "",
    imageUrl: "",
  });

  // Kada se modal otvori, učitaj podatke korisnika
  useEffect(() => {
    if (user) {
      console.log("User data:", user); // Logujemo korisničke podatke
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        imageUrl: user.imageUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, imageUrl: file.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Poslati PUT zahtev za ažuriranje korisničkih podataka
      const res = await api.put(`/user/${user.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate(res.data);  // Osvježiti korisnike nakon izmene
      onClose();            // Zatvoriti modal
    } catch (err) {
      console.error("Greška pri izmjeni korisnika:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            required
          />

          <label className="image-upload-label">
            {form.imageUrl || "Upload Image"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>

          <button type="submit">Edit</button>
        </form>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default EditUserModal;
