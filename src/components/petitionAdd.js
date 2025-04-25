import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { DatePicker } from "antd"; // Importing DatePicker from Ant Design
import { createPetition } from "../utils/api"; // Importing the create petition API
import moment from "moment"; // For handling date format
import "../styles/components/addPetition.scss";

// Tamil Nadu districts
const tamilNaduDistricts = [
  "Chennai",
  "Coimbatore",
  "Salem",
  "Madurai",
  "Trichy",
  "Tirunelveli",
  "Vellore",
  "Tirupur",
  "Thoothukudi",
  "Kancheepuram",
  "Karur",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kanyakumari",
  "Krishnagiri",
  "Namakkal",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "The Nilgiris",
  "Virudhunagar",
  "Ariyalur",
  "Kallakurichi",
  "Tiruvannamalai",
];

// Generate stations dynamically for each district
const generateStations = (district) => {
  const stationPattern = ["A", "B", "C", "D", "E"]; // Example station types: A1, A2, B1, B2, etc.
  const stations = [];

  // Generate 10 stations per district with a pattern like A1, A2, ..., E2
  stationPattern.forEach((prefix) => {
    for (let i = 1; i <= 2; i++) {
      stations.push(`${district} ${prefix}${i}`);
    }
  });

  return stations;
};

// Create stations mapping for each district
const stations = {};
tamilNaduDistricts.forEach((district) => {
  stations[district] = generateStations(district);
});

const AddPetitionForm = () => {
  const [petitionTitle, setPetitionTitle] = useState("");
  const [petitionDescription, setPetitionDescription] = useState("");
  const [petitionContent, setPetitionContent] = useState("");
  const [district, setDistrict] = useState(""); // State for district
  const [station, setStation] = useState(""); // State for station
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
      !district ||
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
      district: district, // Include the district field
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
      setDistrict(""); // Reset district field
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

        {/* District Dropdown */}
        <TextField
          select
          label='District'
          variant='outlined'
          fullWidth
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          margin='normal'
          required
          sx={{ mb: 2 }}
        >
          {tamilNaduDistricts.map((districtName) => (
            <MenuItem key={districtName} value={districtName}>
              {districtName}
            </MenuItem>
          ))}
        </TextField>

        {/* Station Dropdown */}
        {district && (
          <TextField
            select
            label='Station'
            variant='outlined'
            fullWidth
            value={station}
            onChange={(e) => setStation(e.target.value)}
            margin='normal'
            required
            sx={{ mb: 2 }}
          >
            {stations[district]?.map((stationName) => (
              <MenuItem key={stationName} value={stationName}>
                {stationName}
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* Date Picker */}
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
