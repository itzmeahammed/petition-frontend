import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import "../styles/pages/login.scss";
import justice from "../assets/justice-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { userLogin, userSignUp } from "../utils/api";

const LoginPage = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");

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
      const { token, role, exp } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("tokenExp", exp);
      if (role === "user") navigate("/user/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else if (role === "superadmin") navigate("/superAdmin/dashboard");
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };

  const handleSignUp = async () => {
    setError("");

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

    try {
      await userSignUp({
        username: signUpUsername,
        number: mobile,
        email: signUpEmail,
        role,
        password: signUpPassword,
      });

      setSignUpUsername("");
      setSignUpEmail("");
      setSignUpPassword("");
      setMobile("");
      setRole("");

      setShowSignup(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
            <h1 className='heading-login'>
              Welcome to <br /> JusticeHub
            </h1>
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
                  }}
                  error={!!error}
                >
                  <MenuItem value='user'>User</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='superadmin'>Super Admin</MenuItem>
                </Select>
              </FormControl>

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
