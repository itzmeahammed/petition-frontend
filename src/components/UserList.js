import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing react-icons
import "../styles/components/userList.scss"; // Create this CSS file for styling

// Dummy user data
const userData = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "User" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Admin" },
  {
    id: 3,
    name: "Samuel Green",
    email: "samuel.green@example.com",
    role: "User",
  },
  {
    id: 4,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Super Admin",
  },
];

const UserList = () => {
  return (
    <div className="user-list-container">
      <h2 className="user-list-title">User List</h2>
      <div className="user-list">
        {userData.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <h3>{user.name}</h3>
              <p>{user.role}</p>
            </div>
            <p className="user-email">{user.email}</p>
            <div className="user-actions">
              <button className="edit-btn">
                <FaEdit /> Edit
              </button>
              <button className="delete-btn">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
