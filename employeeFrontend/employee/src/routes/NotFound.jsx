import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [role, setRole] = useState(null);

  const roleToRouteMap = {
    HR: "/hr-dashboard",
    SUPER_ADMIN: "/admin-dashboard",
    MANAGER: "/manager-dashboard",
    EMPLOYEE: "/dashboard",
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setRole(data.role.toUpperCase());
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleRedirect = () => {
    if (isLoggedIn && role && roleToRouteMap[role]) {
      navigate(roleToRouteMap[role]);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f4f8",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#333" }}>
          404 - Page Not Found
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#555" }}>
          Oops! The page you're looking for doesn't exist. You might have entered an incorrect URL.
        </p>
        <button
          onClick={handleRedirect}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            borderRadius: "8px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0056b3")}
          onMouseOut={(e) => (e.target.style.background = "#007bff")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
