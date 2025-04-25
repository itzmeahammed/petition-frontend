import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import "../styles/components/statusUpdate.scss"; // Custom styles
import {
  updatePetition,
  getPetitionByHandler,
  getPetitionsByUser,
  getPetition,
} from "../utils/api"; // APIs

const StatusUpdate = () => {
  const [petitions, setPetitions] = useState([]);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPetitions();
  }, []);

  const handlePetitionSelection = (petition) => {
    setSelectedPetition(petition);
    setStatus(petition.status); // Set initial status
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const fetchPetitions = async () => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      setError("Please log in to view petitions.");
      return;
    }

    // Retrieve district and station from localStorage
    const district = localStorage.getItem("district");
    const station =
      userRole === "admin" ? localStorage.getItem("station") : null; // Station only for Admin

    try {
      let response;

      // Conditionally call the API based on the role
      if (userRole === "superadmin") {
        // For Super Admin, only pass district
        response = await getPetitionByHandler(token, district);
      } else if (userRole === "admin") {
        // For Admin, pass both district and station
        response = await getPetition(token, district, station);
      } else {
        // For user role, call the appropriate user-specific API
        response = await getPetitionsByUser(token);
      }

      if (response.data && response.data.length > 0) {
        setPetitions(response.data);
      } else {
        setError("No petitions available.");
      }
    } catch (err) {
      setError("Failed to fetch petitions.");
    }
  };

  const handleSubmit = async () => {
    if (selectedPetition) {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        await updatePetition(selectedPetition.id, status, token); // Update status via API

        // Reflect the changes locally
        setSelectedPetition((prev) => ({ ...prev, status: status }));
        setError(""); // Clear any previous errors
      } catch (err) {
        setError("Failed to update petition status.");
      } finally {
        setLoading(false);
        fetchPetitions(); // Refresh petitions
      }
    }
  };

  return (
    <div className='status-update-container'>
      <Typography variant='h4' gutterBottom>
        Petition Status Update
      </Typography>
      <Grid container spacing={2}>
        {petitions.map((petition) => (
          <Grid item xs={12} sm={6} md={4} key={petition.id}>
            <Card
              className='petition-card'
              onClick={() => handlePetitionSelection(petition)}
            >
              <CardContent>
                <Typography variant='h6' className='petition-title'>
                  {petition.petition_title}
                </Typography>
                <Typography variant='body2' className='petition-status'>
                  Status:{" "}
                  <span
                    style={{
                      color:
                        petition.status === "Pending"
                          ? "orange"
                          : petition.status === "In Process"
                          ? "blue"
                          : "green",
                    }}
                  >
                    {petition.status}
                  </span>
                </Typography>
                <Typography variant='body2' className='petition-username'>
                  <strong>User: </strong> {petition.user}
                </Typography>
                <Typography variant='body2' className='petition-category'>
                  <strong>Category:</strong> {petition.category}
                </Typography>
                <Typography variant='body2' className='petition-tags'>
                  <strong>Tags:</strong>{" "}
                  {Array.isArray(petition.tags) && petition.tags.length > 0
                    ? petition.tags.join(", ")
                    : "No tags available"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedPetition && (
        <Box className='status-update-form'>
          <Typography variant='h6'>
            Update Status for: {selectedPetition.petition_title}
          </Typography>

          <TextField
            label='Select Status'
            select
            fullWidth
            value={status}
            onChange={handleStatusChange}
            SelectProps={{
              native: true,
            }}
            margin='normal'
            sx={{ mb: 2 }}
          >
            <option value='Pending'>Pending</option>
            <option value='In Process'>In Process</option>
            <option value='Completed'>Completed</option>
          </TextField>

          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={handleSubmit}
            disabled={!status || loading}
            sx={{
              mt: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              "Update Status"
            )}
          </Button>

          {error && <Typography color='error'>{error}</Typography>}
        </Box>
      )}
    </div>
  );
};

export default StatusUpdate;
