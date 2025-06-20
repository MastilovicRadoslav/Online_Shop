import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Greška prilikom preuzimanja korisnika:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati korisnika?")) return;
    try {
      await api.delete(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Greška prilikom brisanja korisnika:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page-container">
      <h2>Active Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            user.role !== "Admin" ? (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => alert("Uredi korisnika")} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;