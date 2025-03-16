import React, { useState } from "react";
import "../styles/pages/dashboard.scss";
import profile from "../assets/profile-icon.svg";
import DashboardTab from "../components/PetitionCard";
import AddPetitionForm from "../components/petitionAdd";
import Profile from "../components/profile";
import LogoutconfirmPopup from "../components/logoutPopup";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "sign-out") {
      setShowLogoutPopup(true);
    }
  };

  const handleCloseLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExp");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-left">
        <div className="dashboard-page-left-padding">
          <div className="profile-picture-container">
            <h1 className="heading-login">hello User</h1>
            <img className="profile-picture" src={profile} alt="Profile" />
          </div>

          <div className="tabs">
            <button
              className={`tab-button ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => switchTab("dashboard")}
            >
              DASHBOARD
            </button>
            <button
              className={`tab-button ${
                activeTab === "add-petition" ? "active" : ""
              }`}
              onClick={() => switchTab("add-petition")}
            >
              ADD PETITION
            </button>
            <button
              className={`tab-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => switchTab("profile")}
            >
              PROFILE
            </button>
          </div>
          <button
            className={`tab-button-sign ${
              activeTab === "sign-out" ? "active" : ""
            }`}
            onClick={() => switchTab("sign-out")}
          >
            SIGN OUT
          </button>
        </div>
      </div>

      <div className="dashboard-page-right">
        <div className="dashboard-right">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "add-petition" && <AddPetitionForm />}
          {activeTab === "profile" && <Profile />}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      <LogoutconfirmPopup
        showPopup={showLogoutPopup}
        handleCloseconfirmPopup={handleCloseLogoutPopup}
        onLogOut={handleLogout}
      />
    </div>
  );
};

export default Dashboard;
