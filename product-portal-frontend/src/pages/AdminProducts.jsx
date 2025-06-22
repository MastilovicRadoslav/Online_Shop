import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import "./AdminProducts.css";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { token } = useContext(AuthContext);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/product", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Greška pri dohvatanju proizvoda:", err);
        }
    };

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
        fetchProducts();
    }, [token]);

    const totalBoxClass = products.length > 100 ? "stat-box yellow" : "stat-box purple";

    return (
        <div className="admin-products-page">
            <div className="products-left-panel">
                <div className="product-list">
                    <div className="product-list-title">Active Products</div>
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <div>
                                <p className="product-name">{product.name}</p>
                                <p>${product.price.toFixed(2)}</p>
                            </div>
                            <div className="product-actions">
                                <button
                                    className="edit-btn gradient-btn"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setShowEditModal(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn gradient-btn"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div className="products-right-panel">
                <div className={totalBoxClass}>
                    <h1>{products.length}</h1>
                    <p>Total</p>
                </div>
                <div className="action-box add" onClick={() => setShowModal(true)}>
                    ➕
                    <p>Add Products</p>
                </div>
            </div>

            {showModal && (
                <AddProductModal
                    onClose={() => setShowModal(false)}
                    onProductAdded={fetchProducts}
                />
            )}

            {showEditModal && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    onUpdate={fetchProducts}
                />
            )}
        </div>
    );
};

export default AdminProducts;
