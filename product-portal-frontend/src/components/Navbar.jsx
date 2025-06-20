import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ role }) => {
  const base = role === "Admin" ? "/admin-dashboard" : "/customer-dashboard";

  return (
    <nav className="navbar">
      <Link to={`${base}/home`}>Home</Link>

      {role === "Admin" && <Link to={`${base}/users`}>Users</Link>}
      <Link to={`${base}/products`}>Products</Link>
      <Link to={`${base}/profile`}>Profile</Link>
    </nav>
  );
};

export default Navbar;
