import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import "./EditProductModal.css";

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        imageUrl: product.imageUrl || ""
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imageUrl: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/product/${product.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error("Greška prilikom izmjene proizvoda:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Tablets">Tablets</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Cameras">Cameras</option>
            <option value="Gaming">Gaming</option>
            <option value="Audio">Audio</option>
            <option value="Wearables">Wearables</option>
            <option value="Accessories">Accessories</option>
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label className="image-upload-label">
            {form.imageUrl || "Add Image"}
            <input
              type="file"
              name="imageUrl"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>

          <button type="submit">Edit</button>
        </form>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default EditProductModal;
