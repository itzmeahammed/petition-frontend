import React from "react";
import "../styles/components/logoutPopup.scss";
import { Modal } from "@mui/material";
import { userSignOut } from "../utils/api"; // Import the signOut API

const LogoutconfirmPopup = ({
  showPopup,
  handleCloseconfirmPopup,
  onLogOut,
}) => {
  const handleLogout = async () => {
    // Call the userSignOut API
    try {
      await userSignOut(); // Call the sign-out API
      onLogOut(); // Perform the logout action passed from the parent
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="logout-confirm-popup">
      <Modal open={showPopup} onClose={handleCloseconfirmPopup}>
        <div className="logout-confirm">
          <div className="logout-confirm-content">
            <div className="confirm-text-div">
              <p className="confirm-text">Confirm to Logout</p>
            </div>
            <div className="confirm-logout-button-div">
              <div className="cancel-button" onClick={handleCloseconfirmPopup}>
                <p className="cancel-button-text">Cancel</p>
              </div>
              <div className="confirm-button" onClick={handleLogout}>
                <p className="confirm-button-text">Confirm</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LogoutconfirmPopup;
