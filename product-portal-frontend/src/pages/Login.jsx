import React, { useState } from "react";
import "./Login.css";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/Auth/login", formData);
      const token = res.data.token;

      login(token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role; // 

      if (role === "Admin") {
        navigate("/admin-dashboard/home");
      } else {
        navigate("/customer-dashboard");
      }

    } catch (err) {
      setError("Pogrešan username ili lozinka.");
    }
  };

  return (
    <div className="login-page">
      <div className="top-right-shape"></div>
      <div className="bottom-left-shape"></div>

      <div className="login-box">
        <h1 className="login-title">
          <span
            style={{
              background: "linear-gradient(to right, #EECE13, #B210FF)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Hello
          </span>
        </h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
          <Link to="/forgot-password" className="forgot-password">
            Forgot your password?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
