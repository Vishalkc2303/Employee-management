import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAllowed, setIsAllowed] = useState(null); // null = loading
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          
          const userRole = data.role.toUpperCase();
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userId", data.id);

          if (!allowedRoles || allowedRoles.includes(userRole)) {
            setIsAllowed(true);
          } else {
            setIsAllowed(false);
          }
        } else {
          localStorage.clear();
          setIsAllowed(false);
        }
      } catch (err) {
        console.error("Session verification failed:", err);
        localStorage.clear();
        setIsAllowed(false);
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [allowedRoles]);

  if (checking) return <div>Loading...</div>;

  // If the user is logged in and tries to access the login page, redirect them to the appropriate dashboard
  if (location.pathname === "/login" && localStorage.getItem("userRole")) {
    return <Navigate to={getDashboardForRole(localStorage.getItem("userRole"))} replace />;
  }

  // If the user is logged in but doesn't have permission to access this page, redirect to their dashboard
  if (isAllowed === false) {
    return <Navigate to={getDashboardForRole(localStorage.getItem("userRole"))} replace />;
  }

  // If the user is not logged in, redirect to the login page
  if (isAllowed === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Helper function to return the appropriate dashboard for each role
const getDashboardForRole = (role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin-dashboard";
    case "HR":
      return "/hr-dashboard";
    case "MANAGER":
      return "/manager-dashboard";
    case "EMPLOYEE":
      return "/employee-dashboard";
    default:
      return "/";
  }
};

export default ProtectedRoute;




// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const [isAllowed, setIsAllowed] = useState(null); // null = loading
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const verifySession = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/auth/me", {
//           credentials: "include",
//         });

//         if (res.ok) {
//           const data = await res.json();
//           const userRole = data.role.toUpperCase();
//           localStorage.setItem("userRole", userRole);
//           localStorage.setItem("userId", data.id);

//           if (!allowedRoles || allowedRoles.includes(userRole)) {
//             setIsAllowed(true);
//           } else {
//             setIsAllowed(false);
//           }
//         } else {
//           localStorage.clear();
//           setIsAllowed(false);
//         }
//       } catch (err) {
//         console.error("Session verification failed:", err);
//         localStorage.clear();
//         setIsAllowed(false);
//       } finally {
//         setChecking(false);
//       }
//     };

//     verifySession();
//   }, [allowedRoles]);

//   if (checking) return <div>Loading...</div>;

//   if (!isAllowed) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;




// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const userRole = localStorage.getItem("userRole")?.toUpperCase();

//   if (!userRole) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     console.log("UserRole:", userRole); // SUPER_ADMIN
// console.log("Allowed Roles:", allowedRoles); // ["SUPER_ADMIN"]

//     console.warn(`Access denied for role: ${userRole}`);
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };


// export default ProtectedRoute;



// import React from "react";
// import { Navigate } from "react-router-dom";

// // Basic check based on localStorage
// const ProtectedRoute = ({ children }) => {
//   const isLoggedIn = !!localStorage.getItem("userRole"); // You can enhance this later by hitting a backend /check-auth endpoint

//   if (!isLoggedIn) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;


// with the above code use this
/* <Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} /> */