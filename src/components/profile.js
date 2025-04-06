import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Modal,
  TextField,
  Box,
} from "@mui/material";
import { getUser } from "../utils/api"; // Assuming you have an API function to get user data
import { updateUser } from "../utils/api"; // Importing the updateUser API function
import "../styles/components/profile.scss";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    number: "",
    email: "",
    role: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication required.");
          return;
        }
        const response = await getUser(token);
        setFormData(response.data); // Assuming the response contains the user data
        setOriginalData(response.data); // Store the original data
      } catch (err) {
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  // Function to open the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.number) {
      setError("All fields are required!");
      return;
    }

    // Check for changes and only send the updated fields
    const updatedData = {};
    if (formData.username !== originalData.username)
      updatedData.username = formData.username;
    if (formData.email !== originalData.email)
      updatedData.email = formData.email;
    if (formData.number !== originalData.number)
      updatedData.number = formData.number;

    try {
      const token = localStorage.getItem("authToken");
      const response = await updateUser(updatedData, token); // Send only updated fields
      console.log("Profile updated:", response.data);
      handleClose(); // Close the modal after submission
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <CardContent>
          <div className="profile-header">
            <Avatar className="profile-avatar" />
            <Typography variant="h4" className="profile-name">
              {formData.username}
            </Typography>
            <Typography variant="body2" className="profile-role">
              Role: {formData.role}
            </Typography>
          </div>

          <Grid container spacing={2} className="profile-details">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Email</Typography>
              <Typography variant="body1">{formData.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Phone Number</Typography>
              <Typography variant="body1">{formData.number}</Typography>
            </Grid>
          </Grid>

          <div className="profile-buttons">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleOpen}
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Editing Profile */}
      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          <Typography variant="h6" align="center" gutterBottom>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              name="username"
              onChange={handleChange}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              name="email"
              onChange={handleChange}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.number}
              name="number"
              onChange={handleChange}
            />
            <div className="modal-buttons">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Profile;
