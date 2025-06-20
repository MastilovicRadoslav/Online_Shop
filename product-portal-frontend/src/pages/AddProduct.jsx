// File: src/pages/AddProduct.jsx
import React, { useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "", category: "" });
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/product", product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/admin-dashboard/products");
    } catch (err) {
      console.error(err);
      setError("Greška prilikom dodavanja proizvoda.");
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={product.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          required
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
