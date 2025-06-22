import React, { useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./AddProductModal.css";

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: ""
  });

  const [error, setError] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/product", product, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onProductAdded(); // osvježi prikaz
      onClose();        // zatvori modal
    } catch (err) {
      console.error(err);
      setError("Greška prilikom dodavanja proizvoda.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={product.category}
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
            name="price"
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
          />
          <label className="image-upload-label">
            {selectedImageName || "Upload Image"}
            <input
              type="file"
              name="imageUrl"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file) {
                    const filename = file.name.split("\\").pop().split("/").pop(); // izvuče samo ime, bez puta
                    setProduct({ ...product, imageUrl: filename });
                    setSelectedImageName(filename);
                  }

                }
              }}
            />
          </label>

          {error && <p className="error-msg">{error}</p>}
          <button type="submit">Add</button>
        </form>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default AddProductModal;
