import React, { useEffect, useState, useContext } from "react";
import "./AdminHome.css";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";



const AdminHome = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const { token } = useContext(AuthContext);


  useEffect(() => {
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

    fetchData();
  }, [token]);

  return (
    <div className="admin-home">
      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-box purple">
            <h1>{totalProducts}</h1>
            <p>Total Products</p>
          </div>
          <div className="stat-box yellow">
            <h1>{activeUsers}</h1>
            <p>Active Users</p>
          </div>
        </div>

        <div className="quick-actions">
          <h4>Quick Actions</h4>
          <div className="actions">
            <div className="action-box">
              <div className="icon">＋</div>
              <p>Add Products</p>
            </div>
            <div className="action-box">
              <div className="icon">📈</div>
              <p>Analytics</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminHome;
