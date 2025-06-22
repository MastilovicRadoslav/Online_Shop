// src/pages/CustomerProducts.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./CustomerProducts.css";

const CustomerProducts = () => {
    const [products, setProducts] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/product", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProducts(res.data);
            } catch (error) {
                console.error("Greška prilikom dohvatanja proizvoda:", error);
            }
        };

        fetchProducts();
    }, [token]);

    return (
        <div className="page-container">
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img
                            src={`/images/${product.imageUrl}`}
                            alt={product.name}
                        />
                        <div className="product-info">
                            <p className="product-name">{product.name}</p>
                            <p className="product-price">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerProducts;
