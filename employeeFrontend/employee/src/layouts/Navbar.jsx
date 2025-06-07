// src/layout/Navbar.jsx
import "./Navbar.css"; // Optional: for custom styling
import { logout } from "../service/authService";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();

  // Fetch the current user's full name
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/myname", {
          credentials: "include",
        }); // Adjust API URL if necessary
        const data = await response.text();
        console.log(data);
        setUserName(data); // Set fullName from the response
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    getCurrentUser();
  }, []);

  // useEffect(() => {
  //   const getCurrentUser = async () => {
  //     try {
  //       const response = await fetchCurrentUser(); // API call to backend
  //       setUserName(response.fullName); // Assuming your backend sends { fullName: "John Doe" }
  //     } catch (error) {
  //       console.error("Failed to fetch user", error);
  //     }
  //   };
  //   getCurrentUser();
  // }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return; // If user cancels, stop logout
    try {
      await logout(); // call backend logout
      localStorage.clear(); // clear stored session ID or role
      navigate("/login"); // go to login
    } catch (error) {
      alert("Error logging out");
    }
  };
  return (
    <div className="navbar">
      <h3>Employee Management</h3>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
      <div className="user-info">
        <span>👤 Welcome, {userName ? userName : "User"}</span>
      </div>
    </div>
  );
};

export default Navbar;
