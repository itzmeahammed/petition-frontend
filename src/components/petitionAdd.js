import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "antd"; // Importing DatePicker from Ant Design
import { createPetition } from "../utils/api"; // Importing the create petition API
import moment from "moment"; // For handling date format
import "../styles/components/addPetition.scss";

const AddPetitionForm = () => {
  const [petitionTitle, setPetitionTitle] = useState("");
  const [petitionDescription, setPetitionDescription] = useState("");
  const [petitionContent, setPetitionContent] = useState("");
  const [station, setStation] = useState(""); // State for the station field
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !petitionTitle ||
      !petitionDescription ||
      !petitionContent ||
      !date ||
      !station
    ) {
      setError("All fields are required!");
      return;
    }

    setIsLoading(true);

    const petitionData = {
      title: petitionTitle,
      description: petitionDescription,
      content: petitionContent,
      station: station, // Include the station field
      date: moment(date).format("YYYY-MM-DD"), // Date format
    };

    try {
      // Call the createPetition API
      const token = localStorage.getItem("authToken"); // Retrieve token from local storage
      const response = await createPetition(petitionData, token);
      console.log("Petition Created:", response.data);
      // Optionally, clear the form and display a success message
      setPetitionTitle("");
      setPetitionDescription("");
      setPetitionContent("");
      setStation(""); // Reset station field
      setDate(null);
      setError("");
    } catch (err) {
      setError("Error creating petition, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='add-petition-form'>
      <h2>Add a New Petition</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className='error-message'>{error}</p>}
        <TextField
          label='Petition Title'
          variant='outlined'
          fullWidth
          value={petitionTitle}
          onChange={(e) => setPetitionTitle(e.target.value)}
          margin='normal'
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label='Petition Description'
          variant='outlined'
          fullWidth
          value={petitionDescription}
          onChange={(e) => setPetitionDescription(e.target.value)}
          margin='normal'
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label='Petition Content'
          variant='outlined'
          fullWidth
          value={petitionContent}
          onChange={(e) => setPetitionContent(e.target.value)}
          margin='normal'
          required
          sx={{ mb: 2 }}
        />

        {/* New Station TextField */}
        <TextField
          label='Station'
          variant='outlined'
          fullWidth
          value={station}
          onChange={(e) => setStation(e.target.value)}
          margin='normal'
          required
          sx={{ mb: 2 }}
        />

        <DatePicker
          placeholder='Select a date'
          value={date ? moment(date) : null}
          onChange={(date) => setDate(date)}
          style={{
            width: "100%",
            marginBottom: "20px",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#f9f9f9",
          }}
        />
        <Button
          variant='contained'
          fullWidth
          type='submit'
          disabled={isLoading}
          sx={{
            backgroundColor: "#000000",
            "&:hover": { backgroundColor: "#000000" },
            borderRadius: "8px",
            fontSize: "16px",
            padding: "12px",
          }}
        >
          {isLoading ? "Submitting..." : "Submit Petition"}
        </Button>
      </form>
    </div>
  );
};

export default AddPetitionForm;
