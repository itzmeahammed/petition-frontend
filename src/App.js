import { useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
