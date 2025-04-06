import { useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate, location]);

  return (
    <div className='App'>
      <Routes>
        <Route path='/user/dashboard' element={<Dashboard />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/superAdmin/dashboard' element={<SuperAdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
