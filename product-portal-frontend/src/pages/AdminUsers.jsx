import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const { token } = useContext(AuthContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const totalBoxClass = users.length > 100 ? "stat-box yellow" : "stat-box purple";

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.filter((u) => u.role !== "Admin"));
    } catch (err) {
      console.error("Greška pri preuzimanju korisnika:", err);
    }
  };

  const handleSelect = (id) => {
    setSelectedUserIds([id]);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Da li ste sigurni da želite obrisati selektovane korisnike?")) return;

    try {
      await Promise.all(
        selectedUserIds.map((id) =>
          api.delete(`/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setUsers(users.filter((user) => !selectedUserIds.includes(user.id)));
      setSelectedUserIds([]);
    } catch (err) {
      console.error("Greška pri brisanju korisnika:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Da li ste sigurni da želite obrisati SVE korisnike?")) return;

    try {
      await api.delete("/user/delete-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([]);
      setSelectedUserIds([]);
    } catch (err) {
      console.error("Greška pri brisanju svih korisnika:", err);
    }
  };

  const openEditModal = () => {
    // Ako je selektovan jedan korisnik, setuj ga za editovanje
    const userToEdit = users.find(u => u.id === selectedUserIds[0]);
    setEditUser(userToEdit);  // Setujemo korisnika koji se uređuje
    setShowEditModal(true);   // Otvaramo modal
  };


  const refreshUsers = () => {
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users-container">
      <div className="user-list">
        <h3>Active Users</h3>
        <ul className="user-items">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleSelect(user.id)}
              />
              <img
                src={`/images/${user.imageUrl || "default.jpg"}`}
                alt="Profile"
                className="user-img"
              />
              <div className="user-info">
                <p className="username">{user.username}</p>
                <p className="date">13.06.2025.</p>
              </div>
              <span className="email">{user.email}</span>
            </li>
          ))}
        </ul>

        {selectedUserIds.length > 0 && (
          <div className="action-buttons-inline">
            <button onClick={handleDeleteSelected} className="deleteedit-btn">Delete</button>
            <button onClick={openEditModal} className="deleteedit-btn">Edit</button>
            <button onClick={() => setShowAddModal(true)} className="deleteedit-btn">Add</button>
          </div>
        )}
      </div>

      <div className="user-controls">
        <div className={totalBoxClass}>
          <h1>{users.length}</h1>
          <p>Total</p>
        </div>
        <div className="action-box" onClick={handleDeleteAll}>
          <span role="img" aria-label="Trash">🗑️</span>
          <p>Delete Users</p>
        </div>
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={refreshUsers}
        />
      )}
      {showEditModal && (
        <EditUserModal
          user={editUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={refreshUsers}
        />
      )}
    </div>
  );
};

export default AdminUsers;
