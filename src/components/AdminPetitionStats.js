import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/components/AdminPetitionStats.scss";

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminPetitionStats = () => {
  // Petition Status Overview Data
  const petitionStatusData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Dummy months
    datasets: [
      {
        label: "Pending Petitions",
        data: [12, 19, 3, 5, 2, 3], // Dummy data for pending petitions
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Completed Petitions",
        data: [2, 3, 20, 5, 1, 4], // Dummy data for completed petitions
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "In Process Petitions",
        data: [1, 2, 4, 6, 7, 9], // Dummy data for in-process petitions
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  // Petitions by Category Data (Bar Chart)
  const petitionsByCategoryData = {
    labels: ["Environment", "Traffic Safety", "Health", "Education"], // Categories
    datasets: [
      {
        label: "Number of Petitions",
        data: [30, 20, 25, 10], // Dummy data for each category
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-stats" style={{ width: "100%" }}>
      <div className="chart-card">
        <h2 className="chart-title">Petition Status Overview</h2>
        <Line data={petitionStatusData} />
      </div>

      <div className="chart-card">
        <h2 className="chart-title">Petitions by Category</h2>
        <Bar data={petitionsByCategoryData} />
      </div>
    </div>
  );
};

export default AdminPetitionStats;
