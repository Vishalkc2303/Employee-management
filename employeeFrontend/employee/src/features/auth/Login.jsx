import React from "react";
import { useState, useEffect } from "react";
import { login } from "../../service/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // useEffect(() => {
  //   // Added: verify session from backend on page load
  //   const verifySession = async () => {
  //     try {
  //       const res = await fetch("http://localhost:8080/api/auth/validation", {
  //         credentials: "include",
  //       });
  //       if (res.ok) {
  //         const data = await res.json();
  //         const userRole = data.role.toUpperCase();
  //         localStorage.setItem("userRole", userRole);
  //         localStorage.setItem("userId", data.id);
  //         console.log("Session valid for role:", userRole);

  //         if (userRole === "SUPER_ADMIN") {
  //           navigate("/admin-dashboard");
  //         } else if (userRole === "MANAGER") {
  //           navigate("/Manager-dashboard");
  //         } else if (userRole === "HR") {
  //           navigate("/hr-dashboard");
  //         } else {
  //           navigate("/dashboard");
  //         }
  //       } else {
  //         localStorage.removeItem("userRole");
  //         localStorage.removeItem("userId");
  //         console.log("Session invalid or expired");
  //       }
  //     } catch (error) {
  //       console.error("Session check failed:", error);
  //       localStorage.removeItem("userRole");
  //       localStorage.removeItem("userId");
  //     }
  //   };

  //   verifySession();

  //   if (localStorage.getItem("userRole")) {
  //     const userRole = localStorage.getItem("userRole");
  //     console.log(userRole);
  //     if (userRole === "SUPER_ADMIN") {
  //       navigate("/hr-dashboard");
  //     } else if (userRole === "MANAGER") {
  //       navigate("/Manager-dashboard");
  //     } else if (userRole === "HR") {
  //       navigate("/Manager-dashboard");
  //     } else {
  //       navigate("/dashboard");
  //     }
  //   }
  // }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(user);

      // Only store role — no need to store "token" (since session is cookie-managed)
      // localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("userId", response.data.Id);
      console.log("userid", response.data.Id);
      console.log("Session ID:", response.data.sessionId);
      // For debugging, if you're returning it
      alert("Login successful!");

      // Redirect based on role
      const role = response.data.role.toUpperCase();
      localStorage.setItem("userRole", role);
      // localStorage.setItem("userId",Id)
      //alert("Role is: " + response.data.role);

      if (role === "SUPER_ADMIN") {
        navigate("/admin-dashboard");
      } else if (role === "MANAGER") {
        navigate("/Manager-dashboard");
      } else if (role === "HR") {
        navigate("/hr-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      // If the server responded with a JSON message, show that
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        // Fallback
        alert("Login failed. Please try again.");
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await login(user);
  //     localStorage.setItem("token", response.data.token); // Store token
  //     localStorage.setItem("userRole", response.data.role); // Store user role
  //     console.log("Stored Role:", response.data.role); // Debug stored role
  //     alert("Login successful!");
  //     if (response.data.role === "HR") {
  //       navigate("/hr-dashboard");
  //     } else if (response.data.role === "EMPLOYEE") {
  //       navigate("/employee-dashboard");
  //     } else {
  //       navigate("/dashboard");
  //     }
  //   } catch (error) {
  //     alert("Invaliddd credentials");
  //   }
  // };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-sm text-center text-gray-500 mt-6">
          Forgot your password?{" "}
          <span className="text-indigo-600 hover:underline cursor-pointer">
            Reset here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
