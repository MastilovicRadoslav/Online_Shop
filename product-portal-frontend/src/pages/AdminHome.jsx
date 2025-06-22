import React, { useEffect, useState, useContext } from "react";
import "./AdminHome.css";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import AddProductModal from "../components/AddProductModal";
import AnalyticsSection from "../pages/AnalyticsSection";


const AdminHome = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);


  const productBoxClass = totalProducts > 100 ? "stat-box yellow" : "stat-box purple";
  const userBoxClass = activeUsers > 100 ? "stat-box yellow" : "stat-box purple";

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAnalyticsClick = () => {
    setShowAnalytics(true);
  };

  const fetchData = async () => {
    try {
      const productRes = await api.get("/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalProducts(productRes.data.length);

      const userRes = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const customers = userRes.data.filter((u) => u.role === "Customer");
      setActiveUsers(customers.length);
    } catch (error) {
      console.error("Greška prilikom dohvaćanja podataka:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="admin-home">
      {!showAnalytics ? (

        <div className="dashboard-content">
          {/* RED 1 */}
          <div className="row">
            <div className={productBoxClass}>
              <h1>{totalProducts}</h1>
              <p>Total Products</p>
            </div>
            <div className={userBoxClass}>
              <h1>{activeUsers}</h1>
              <p>Active Users</p>
            </div>
          </div>

          {/* RED 2 */}
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="row">
              <div className="action-box" onClick={handleOpenModal}>
                <div className="icon">＋</div>
                <p>Add Products</p>
              </div>
              <div className="action-box" onClick={handleAnalyticsClick}>
                <div className="icon">📈</div>
                <p>Analytics</p>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <AnalyticsSection />
      )}

      {/* MODAL ZA DODAVANJE */}
      {showModal && (
        <AddProductModal
          onClose={handleCloseModal}
          onProductAdded={fetchData} // osvježi broj proizvoda nakon dodavanja
        />
      )}
    </div>
  );
};

export default AdminHome;
