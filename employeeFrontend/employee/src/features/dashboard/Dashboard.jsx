import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../service/authService";

const Dashboard = () => {
  // const navigate = useNavigate();
  let role = localStorage.getItem("userRole");

  // const handleLogout = async () => {
  //   try {
  //     await logout(); // call backend logout
  //     localStorage.clear(); // clear stored session ID or role
  //     navigate("/login"); // go to login
  //   } catch (error) {
  //     alert("Error logging out");
  //   }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome! You are logged in {role}.</p>
        {/* <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default Dashboard;
