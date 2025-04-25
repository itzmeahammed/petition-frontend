import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import "../styles/pages/login.scss";
import justice from "../assets/justice-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { userLogin, userSignUp } from "../utils/api";

// Tamil Nadu districts (use all 30 districts here)
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

// Generate stations dynamically for each district
const stations = {};
tamilNaduDistricts.forEach((district) => {
  stations[district] = generateStations(district);
});
const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");

  const [district, setDistrict] = useState("");
  const [station, setStation] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const handleLogin = async () => {
    setError(""); // Clear previous error
    if (!loginEmail || !loginPassword) {
      setError("Both fields are required");
      return;
    }

    try {
      const response = await userLogin({
        email: loginEmail,
        password: loginPassword,
      });

      const { token, role, exp, district, station } = response.data;

      // Save the token, role, and expiration to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("tokenExp", exp);

      // For Admin role, store both district and station
      if (role === "admin") {
        localStorage.setItem("district", district);
        localStorage.setItem("station", station);
      }

      // For Super Admin role, store only district
      if (role === "superadmin") {
        localStorage.setItem("district", district);
      }

      // Redirect based on the role
      if (role === "user") navigate("/user/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else if (role === "superadmin") navigate("/superAdmin/dashboard");
    } catch (err) {
      setError("Invalid credentials, please try again.");
      alert("Error: " + err.message); // Show error message from backend
    }
  };

  // const handleLogin = async () => {
  //   setError(""); // Clear previous error
  //   if (!loginEmail || !loginPassword) {
  //     setError("Both fields are required");
  //     return;
  //   }

  //   try {
  //     const response = await userLogin({
  //       email: loginEmail,
  //       password: loginPassword,
  //     });
  //     const { token, role, exp } = response.data;
  //     localStorage.setItem("authToken", token);
  //     localStorage.setItem("userRole", role);
  //     localStorage.setItem("tokenExp", exp);
  //     if (role === "user") navigate("/user/dashboard");
  //     else if (role === "admin") navigate("/admin/dashboard");
  //     else if (role === "superadmin") navigate("/superAdmin/dashboard");
  //   } catch (err) {
  //     setError("Invalid credentials, please try again.");
  //   }
  // };

  const handleSignUp = async () => {
    setError(""); // Clear previous error

    // Validate form fields
    if (
      !signUpUsername ||
      !signUpEmail ||
      !signUpPassword ||
      !mobile ||
      !role
    ) {
      setError("All fields are required");
      return;
    }

    if (!emailRegex.test(signUpEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    // Validate for Admin role
    if (
      role === "admin" &&
      (!district || !station || secretCode !== "admin@1")
    ) {
      setError(
        "Admin: District, Station, and correct secret code are required."
      );
      return;
    }

    // Validate for Super Admin role
    if (role === "superadmin" && (secretCode !== "superadmin@1" || !district)) {
      setError("Super Admin: District and correct secret code are required.");
      return;
    }

    try {
      // Send data to API for signup
      const response = await userSignUp({
        username: signUpUsername,
        number: mobile,
        email: signUpEmail,
        role,
        password: signUpPassword,
        district, // Send district for both Admin and Super Admin
        station: role === "admin" ? station : null, // Only include station for Admin
      });

      // Check if the response contains an error
      if (response.data && response.data.Error) {
        // If there is an error message from the backend, show it in an alert
        alert(response.data.Error); // Show backend error message in alert
      } else {
        // If no error, proceed to reset the form and show success message
        alert("Signup successful!");
        // Reset the form
        setSignUpUsername("");
        setSignUpEmail("");
        setSignUpPassword("");
        setMobile("");
        setRole("");
        setDistrict("");
        setStation("");
        setSecretCode("");
        setShowSignup(false);
      }
    } catch (err) {
      if (err.response) {
        // Axios response error (400, 500, etc.)
        alert("Error: " + err.response.data.Error || "Something went wrong.");
      } else {
        // Handle network error or other unexpected errors
        alert("Error: " + err.message);
      }
    }
  };

  const isLoginButtonDisabled = !loginEmail || !loginPassword;
  const isSignUpButtonDisabled =
    !signUpUsername || !signUpEmail || !signUpPassword || !mobile || !role;

  return (
    <>
      {showSignup ? (
        <div className='login-page'>
          <div className='login-page-right'>
            <h1 className='heading-login'>Welcome to JusticeHub</h1>
            <img src={justice} alt='JusticeHub Logo' className='justice-logo' />
          </div>
          <div className='login-page-left'>
            <h1>Sign up</h1>
            <div className='login-page-container'>
              <TextField
                label='Username'
                variant='outlined'
                fullWidth
                value={signUpUsername}
                onChange={(e) => {
                  setSignUpUsername(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={error && "Please fill in all fields"}
                sx={{ mb: 2 }}
              />
              <TextField
                label='Email'
                variant='outlined'
                fullWidth
                value={signUpEmail}
                onChange={(e) => {
                  setSignUpEmail(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={error && "Please enter a valid email"}
                sx={{ mb: 2 }}
              />
              <TextField
                label='Mobile Number'
                variant='outlined'
                fullWidth
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={error && "Please fill in all fields"}
                sx={{ mb: 2 }}
              />
              <TextField
                label='Password'
                type='password'
                variant='outlined'
                fullWidth
                value={signUpPassword}
                onChange={(e) => {
                  setSignUpPassword(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={error && "Please fill in all fields"}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id='role-label'>Role</InputLabel>
                <Select
                  labelId='role-label'
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setError(""); // Clear error when typing
                    setUserType(e.target.value);
                  }}
                  error={!!error}
                >
                  <MenuItem value='user'>User</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='superadmin'>Super Admin</MenuItem>
                </Select>
              </FormControl>

              {role === "admin" && (
                <>
                  <TextField
                    label='Secret Code'
                    variant='outlined'
                    fullWidth
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    error={!!error}
                    helperText={error && "Please enter the correct secret code"}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>District</InputLabel>
                    <Select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      label='District'
                      fullWidth
                      required
                    >
                      {tamilNaduDistricts.map((districtName) => (
                        <MenuItem key={districtName} value={districtName}>
                          {districtName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {userType === "admin" && district && (
                    <FormControl fullWidth>
                      <InputLabel>Station</InputLabel>
                      <Select
                        value={station}
                        onChange={(e) => setStation(e.target.value)}
                        label='Station'
                        fullWidth
                        required
                      >
                        {stations[district]?.map((stationName) => (
                          <MenuItem key={stationName} value={stationName}>
                            {stationName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}

              {role === "superadmin" && (
                <>
                  <TextField
                    label='Secret Code'
                    variant='outlined'
                    fullWidth
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    error={!!error}
                    helperText={error && "Please enter the correct secret code"}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>District</InputLabel>
                    <Select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      label='District'
                    >
                      {tamilNaduDistricts.map((districtName) => (
                        <MenuItem key={districtName} value={districtName}>
                          {districtName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              <Button
                variant='contained'
                color='primary'
                onClick={handleSignUp}
                fullWidth
                disabled={isSignUpButtonDisabled}
                sx={{
                  padding: "12px",
                  fontWeight: "bold",
                  backgroundColor: isSignUpButtonDisabled ? "#ccc" : "#080808",
                  "&:hover": {
                    backgroundColor: "#000000",
                  },
                }}
              >
                Sign Up
              </Button>
              <h4>OR</h4>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={() => setShowSignup(false)}
                sx={{
                  padding: "10px",
                  fontWeight: "bold",
                  backgroundColor: "#080808",
                  "&:hover": {
                    backgroundColor: "#000000",
                  },
                }}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='login-page'>
          <div className='login-page-left'>
            <h1>Login</h1>
            <div className='login-page-container'>
              <TextField
                label='Email'
                variant='outlined'
                fullWidth
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={error}
                sx={{ mb: 2 }}
              />
              <TextField
                label='Password'
                type='password'
                variant='outlined'
                fullWidth
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setError("");
                }}
                error={!!error}
                helperText={error}
                sx={{ mb: 2 }}
              />
              <Button
                variant='contained'
                color='primary'
                onClick={handleLogin}
                fullWidth
                disabled={isLoginButtonDisabled}
                sx={{
                  padding: "12px",
                  fontWeight: "bold",
                  backgroundColor: isLoginButtonDisabled ? "#ccc" : "#080808",
                  "&:hover": {
                    backgroundColor: "#000000",
                  },
                }}
              >
                Login
              </Button>
              <h4>OR</h4>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={() => setShowSignup(true)}
                sx={{
                  padding: "10px",
                  fontWeight: "bold",
                  backgroundColor: "#080808",
                  "&:hover": {
                    backgroundColor: "#000000",
                  },
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
          <div className='login-page-right'>
            <h1 className='heading-login'>
              Welcome to <br /> JusticeHub
            </h1>
            <img src={justice} alt='JusticeHub Logo' className='justice-logo' />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
