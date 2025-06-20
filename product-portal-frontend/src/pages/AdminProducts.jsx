// File: src/pages/AdminProducts.jsx

import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (!window.confirm("Da li ste sigurni da želite obrisati proizvod?")) return;

        try {
            await api.delete(`/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(products.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Greška pri brisanju proizvoda:", err);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/product", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(res.data);
            } catch (err) {
                setError("Greška pri dohvatanju proizvoda.");
                console.error(err);
            }
        };

        fetchProducts();
    }, [token]); // token je dependency ako ga koristiš u headerima

    return (
        <>
            <div className="page-container">
                <div className="products-header">
                    <h2>Active Products</h2>
                    <div className="products-stats">
                        <div className="stat-box purple">
                            <h1>{products.length}</h1>
                            <p>Total</p>
                        </div>
                        <div className="add-product-box">
                            <button className="add-button" onClick={() => navigate("add")}>➕ Add Products</button>
                        </div>
                    </div>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <div>
                                <p className="product-name">{product.name}</p>
                                <p>${product.price.toFixed(2)}</p>
                            </div>
                            <div className="product-actions">
                                <button className="edit-btn" onClick={() => alert("Edit funkcionalnost dolazi uskoro")}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdminProducts;
