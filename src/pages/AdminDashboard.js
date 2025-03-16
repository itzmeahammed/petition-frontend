import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../assets/profile-icon.svg";
import DashboardTab from "../components/PetitionCard";
import AddPetitionForm from "../components/petitionAdd";
import Profile from "../components/profile";
import AdminPetitionStats from "../components/AdminPetitionStats"; // For the analytics/chart
import LogoutconfirmPopup from "../components/logoutPopup"; // For logout confirmation
import UserList from "../components/UserList"; // Import UserList component
import "../styles/pages/adminDashboard.scss";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "sign-out") {
      setShowLogoutPopup(true); // Show the logout confirmation
    }
  };

  const handleCloseLogoutPopup = () => {
    setShowLogoutPopup(false); // Close the logout popup
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExp");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-left">
        <div className="dashboard-page-left-padding">
          <div className="profile-picture-container">
            <h1 className="heading-login">Hello Admin</h1>
            <img className="profile-picture" src={profile} alt="Profile" />
          </div>

          <div className="tabs">
            <button
              className={`tab-button ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => switchTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`tab-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => switchTab("profile")}
            >
              Profile
            </button>
            <button
              className={`tab-button ${
                activeTab === "analytics" ? "active" : ""
              }`}
              onClick={() => switchTab("analytics")}
            >
              Analytics
            </button>
            <button
              className={`tab-button ${
                activeTab === "user-list" ? "active" : ""
              }`}
              onClick={() => switchTab("user-list")}
            >
              User List
            </button>
          </div>
          <button
            className={`tab-button-sign ${
              activeTab === "sign-out" ? "active" : ""
            }`}
            onClick={() => switchTab("sign-out")}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-page-right">
        <div className="dashboard-right">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "analytics" && <AdminPetitionStats />}
          {activeTab === "user-list" && <UserList />}{" "}
          {/* Display UserList tab */}
        </div>
      </div>

      <LogoutconfirmPopup
        showPopup={showLogoutPopup}
        handleCloseconfirmPopup={handleCloseLogoutPopup}
        onLogOut={handleLogout}
      />
    </div>
  );
};

export default AdminDashboard;
