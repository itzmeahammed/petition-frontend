import React, { useState, useEffect } from "react";
import { Modal, Button, TextField, Typography } from "@mui/material";
import "../styles/components/petitionCards.scss";
import {
  getPetition,
  getPetitionByHandler,
  getPetitionsByUser,
  createFeedback,
  getFeedbackByPetition,
} from "../utils/api"; // Add import for feedback APIs

const DashboardTab = () => {
  const [open, setOpen] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState(""); // State for new feedback
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPetitions = async () => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");

      if (!token) {
        setError("Please log in to view your petitions.");
        return;
      }

      try {
        let response;

        // Conditionally call the API based on the role
        if (userRole === "superadmin") {
          response = await getPetitionByHandler(token);
        } else if (userRole === "admin") {
          response = await getPetition(token);
        } else {
          response = await getPetitionsByUser(token);
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

  const handleOpen = async (petition) => {
    setSelectedPetition(petition);
    setOpen(true);

    if (["admin", "superadmin"].includes(localStorage.getItem("userRole"))) {
      // Fetch feedback if userRole is admin or superadmin
      try {
        const token = localStorage.getItem("authToken");
        const response = await getFeedbackByPetition(petition.id, token); // Fetch feedback for the selected petition
        setFeedbacks(response.data); // Set the feedback data
      } catch (error) {
        setError("Failed to fetch feedback.");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPetition(null);
    setFeedbacks([]);
    setFeedback("");
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await createFeedback(
        selectedPetition.id,
        feedback,
        token
      );
      setFeedbacks([...feedbacks, response.data]);
      setFeedback(""); // Clear feedback input field
    } catch (error) {
      setError("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='dashboard-tab'>
      <h2 className='dashboard-tab-heading'>Petitions Dashboard</h2>
      {error && <p className='error-message'>{error}</p>}

      <div className='petitions-list'>
        {petitions.length > 0 ? (
          petitions.map((petition, index) => (
            <div className='petition-card' key={index}>
              <div className='petition-card-header'>
                {["admin", "superadmin"].includes(
                  localStorage.getItem("userRole")
                ) && (
                  <div className='petition-user'>
                    <strong>PETITION BY:</strong> {petition.user}
                  </div>
                )}

                <h3 className='petition-title'>{petition.petition_title}</h3>

                {petition.station && (
                  <div className='petition-station'>
                    <strong>Station:</strong> {petition.station}
                  </div>
                )}
              </div>
              <p className='petition-description'>
                {petition.petition_description.length > 100
                  ? petition.petition_description.substring(0, 100) + "..."
                  : petition.petition_description}
              </p>
              <div className='petition-details'>
                <p>
                  <strong>Category:</strong> {petition.category}
                </p>
                <p>
                  <strong>Tags:</strong> {petition.tags.join(", ")}
                </p>
              </div>
              <Button
                variant='contained'
                color='primary'
                className='view-more-button'
                onClick={() => handleOpen(petition)}
              >
                View More
              </Button>
            </div>
          ))
        ) : (
          <p>No petitions available.</p>
        )}
      </div>

      {/* Modal to show petition details and feedback */}
      {selectedPetition && (
        <Modal open={open} onClose={handleClose} className='modal-container'>
          <div className='modal-box-petition'>
            <h2 id='modal-title'>{selectedPetition.petition_title}</h2>
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
            <p className='solution-highlight'>
              <strong>Solution:</strong> {selectedPetition.solution}
            </p>
            <p
              className={`status-highlight ${selectedPetition.status.toLowerCase()}`}
            >
              <strong>Status:</strong> {selectedPetition.status}
            </p>

            {/* Feedback section for admin or superadmin */}
            {["admin", "superadmin"].includes(
              localStorage.getItem("userRole")
            ) && (
              <div className='feedback-section'>
                <h3>Feedback</h3>
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback, index) => (
                    <div key={index}>
                      <Typography variant='body1'>
                        {feedback.feedback}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography>No feedback available.</Typography>
                )}
              </div>
            )}

            {/* Feedback form for regular users */}
            {!["admin", "superadmin"].includes(
              localStorage.getItem("userRole")
            ) && (
              <div className='create-feedback'>
                <h3>Create Feedback</h3>
                <TextField
                  label='Your Feedback'
                  value={feedback}
                  onChange={handleFeedbackChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant='outlined'
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmitFeedback}
                  disabled={loading || !feedback}
                  sx={{ mt: 2 }}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            )}

            <Button variant='contained' color='secondary' onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardTab;
