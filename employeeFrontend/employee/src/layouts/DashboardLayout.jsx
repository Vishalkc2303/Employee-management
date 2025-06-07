// src/layout/DashboardLayout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./DashboardLayout.css"; // optional styling
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet /> {/* This renders the current route */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
