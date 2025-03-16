import React, { useState } from "react";
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
import "../styles/components/profile.scss";

const user = {
  username: "naveen",
  number: "1234456765",
  email: "person123@gmail.com",
  role: "user",
  password: "user123",
};

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ...user });

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

  // Function to handle form submission (for now just log the data)
  const handleSubmit = () => {
    console.log("Updated Profile Data:", formData);
    handleClose(); // Close the modal after submission
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <CardContent>
          <div className="profile-header">
            <Avatar className="profile-avatar" />
            <Typography variant="h4" className="profile-name">
              {user.username}
            </Typography>
            <Typography variant="body2" className="profile-role">
              Role: {user.role}
            </Typography>
          </div>

          <Grid container spacing={2} className="profile-details">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Email</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Phone Number</Typography>
              <Typography variant="body1">{user.number}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Password</Typography>
              <Typography variant="body1">{user.password}</Typography>
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
            <Button variant="outlined" color="secondary" fullWidth>
              Change Password
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
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              name="password"
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
