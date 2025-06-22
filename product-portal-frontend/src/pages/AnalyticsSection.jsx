import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "./AnalyticsSection.css";

const AnalyticsSection = () => {
    const { token } = useContext(AuthContext);
    const [categoryData, setCategoryData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const catRes = await api.get("/statistics/by-category", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategoryData(catRes.data);

                const priceRes = await api.get("/statistics/by-price-range", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formattedPrice = [
                    { range: "Under $50", value: priceRes.data.low },
                    { range: "$50-$99", value: priceRes.data.mid },
                    { range: "Over $100", value: priceRes.data.high },
                ];
                setPriceData(formattedPrice);

                const countRes = await api.get("/statistics/counts", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalProducts(countRes.data.products);
                setActiveUsers(countRes.data.users);
            } catch (err) {
                console.error("Greška pri dohvatanju analitike:", err);
            }
        };

        fetchAnalytics();
    }, [token]);

    const categoryColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4", "#ff69b4", "#a4de6c"];

    return (
        <div className="analytics-content">
            <div className="left-analytics">
                <div className="analytics-box">
                    <h3>Top Categories Performance</h3>
                    <ul className="category-list">
                        {categoryData.map((cat, index) => {
                            const percentage = ((cat.count / totalProducts) * 100).toFixed(1);
                            const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6961"];
                            return (
                                <li key={cat.category} className="category-row">
                                    <div className="category-left">
                                        <span className="dot" style={{ backgroundColor: colors[index % colors.length] }}></span>
                                        <span className="category-name">{cat.category}</span>
                                    </div>
                                    <div className="category-info">
                                        <div className="product-count">{cat.count} products</div>
                                        <div className="category-percentage">{percentage}% of total</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>


                </div>

                <div className="analytics-box">
                    <h3>Price Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={priceData}>
                            <XAxis dataKey="range" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" barSize={35} />
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </div>

            <div className="right-stats">
                <div className={`stat-box ${totalProducts > 100 ? "yellow" : "purple"}`}>
                    <h1>{totalProducts}</h1>
                    <p>Total Products</p>
                </div>
                <div className={`stat-box ${activeUsers > 100 ? "yellow" : "purple"}`}>
                    <h1>{activeUsers}</h1>
                    <p>Active Users</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
