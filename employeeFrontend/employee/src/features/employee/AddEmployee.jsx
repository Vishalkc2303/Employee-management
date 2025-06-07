import React, { useState } from "react";
import axios from "axios";

const AddEmployee = () => {

    const id = localStorage.getItem("userId");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(""); // from dropdown maybe
  const createdBy = localStorage.getItem("userId"); // assuming this is stored after login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/addUser", {
        email,
        password,
        roleId,
        createdBy, // pass the creator ID to backend
      });

      console.log("User created:", response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-md"
    >
      <h2 className="text-xl font-bold">Add New User {id}</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border border-gray-300 rounded p-2"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-gray-300 rounded p-2"
        required
      />

      <select
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        className="w-full border border-gray-300 rounded p-2"
        required
      >
        <option value="">Select Role</option>
        <option value="2">HR</option>
        <option value="3">Manager</option>
        <option value="4">Employee</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add User
      </button>
    </form>
  );
};

export default AddEmployee;
