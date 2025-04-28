import React, { useState, useEffect } from "react";
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
  const stationPattern = ["A", "B", "C", "D", "E"];
  const stations = [];

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
  const [firNumber, setFirNumber] = useState(""); // State for Fir Number
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firNumbers, setFirNumbers] = useState([]); // State to store FIR numbers

  // Function to generate random FIR numbers
  const generateFirNumbers = (district, station) => {
    const firPrefix =
      district.charAt(0) + station.replace(/[^a-zA-Z0-9]/g, "").slice(-1); // First letter of district + last letter/number of station
    const generatedFirNumbers = [];
    for (let i = 1; i <= 10; i++) {
      const firNumber = `${firPrefix}${i}`;
      generatedFirNumbers.push(firNumber);
    }
    localStorage.setItem("firNumbers", JSON.stringify(generatedFirNumbers)); // Save to localStorage
    setFirNumbers(generatedFirNumbers); // Update FIR numbers state
  };

  // Effect to generate FIR numbers when district or station changes
  useEffect(() => {
    if (district && station) {
      generateFirNumbers(district, station);
    }
  }, [district, station]);

  // Check if FIR number is valid
  const isFirNumberValid = () => {
    return firNumbers.includes(firNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !petitionTitle ||
      !petitionDescription ||
      !petitionContent ||
      !date ||
      !district ||
      !station ||
      !firNumber ||
      !isFirNumberValid()
    ) {
      setError("All fields are required and the FIR number must be valid!");
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
      // firNumber: firNumber, // Include Fir Number
    };

    try {
      const token = localStorage.getItem("authToken"); // Retrieve token from local storage
      const response = await createPetition(petitionData, token);
      console.log("Petition Created:", response.data);
      // Optionally, clear the form and display a success message
      setPetitionTitle("");
      setPetitionDescription("");
      setPetitionContent("");
      setDistrict(""); // Reset district field
      setStation(""); // Reset station field
      setFirNumber(""); // Reset Fir Number field
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

        {/* Fir Number Field */}
        <TextField
          label='Fir Number'
          variant='outlined'
          fullWidth
          value={firNumber}
          onChange={(e) => setFirNumber(e.target.value)}
          margin='normal'
          required
          sx={{ mb: 2 }}
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
