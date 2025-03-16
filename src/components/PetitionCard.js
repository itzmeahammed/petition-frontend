import React, { useState, useEffect } from "react";
import { Modal, Button } from "@mui/material";
import "../styles/components/petitionCards.scss";
import { getPetition, getPetitionsByUser } from "../utils/api"; // Import both APIs

const DashboardTab = () => {
  const [open, setOpen] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPetitions = async () => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole"); // Get the user role

      if (!token) {
        setError("Please log in to view your petitions.");
        return;
      }

      try {
        let response;

        // Conditionally call the API based on the role
        if (userRole === "admin") {
          response = await getPetition(token); // For admin
        } else {
          response = await getPetitionsByUser(token); // For user
        }

        if (response.data && response.data.length > 0) {
          setPetitions(response.data);
        } else {
          setError("No petitions available.");
        }
      } catch (err) {
        setError("Something went wrong while fetching petitions.");
      }
    };

    fetchPetitions();
  }, []);

  const handleOpen = (petition) => {
    setSelectedPetition(petition);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPetition(null);
  };

  return (
    <div className="dashboard-tab">
      <h2 className="dashboard-tab-heading">Petitions Dashboard</h2>

      {/* Show an error message if there are no petitions */}
      {error && <p className="error-message">{error}</p>}

      <div className="petitions-list">
        {petitions.length > 0 ? (
          petitions.map((petition, index) => (
            <div className="petition-card" key={index}>
              <div className="petition-card-header">
                <h3 className="petition-title">{petition.petition_title}</h3>
              </div>
              <p className="petition-description">
                {petition.petition_description.length > 100
                  ? petition.petition_description.substring(0, 100) + "..."
                  : petition.petition_description}
              </p>
              <div className="petition-details">
                <p>
                  <strong>Category:</strong> {petition.category}
                </p>
                <p>
                  <strong>Tags:</strong> {petition.tags.join(", ")}
                </p>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="view-more-button"
                onClick={() => handleOpen(petition)}
              >
                View More
              </Button>
            </div>
          ))
        ) : (
          <p>No petitions available.</p> // Display this if no petitions are found
        )}
      </div>

      {/* Modal to show petition details */}
      {selectedPetition && (
        <Modal open={open} onClose={handleClose} className="modal-container">
          <div className="modal-box">
            <h2 id="modal-title">{selectedPetition.petition_title}</h2>
            <p>
              <strong>Description:</strong>{" "}
              {selectedPetition.petition_description}
            </p>
            <p>
              <strong>Category:</strong> {selectedPetition.category}
            </p>
            <p>
              <strong>Tags:</strong> {selectedPetition.tags.join(", ")}
            </p>
            <p>
              <strong>Content:</strong> {selectedPetition.petition_content}
            </p>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardTab;
