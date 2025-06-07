import Login from "./features/auth/Login";
import { useState, useEffect } from "react";
import Dashboard from "./features/dashboard/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
// import ProtectedRoute from "./routes/protectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import HrDashboard from "./features/dashboard/HrDashboard";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import AddEmployee from "./features/employee/AddEmployee";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./routes/NotFound";
import ManageEmployee from "./features/employee/ManageEmployee";
import UpdateDetails from "./features/employee/UpdateDetails";
import Departments from "./features/employee/Departments";
import MyProfile from "./features/employee/MyProfile";
import InsertPersonalDetails from "./features/employee/InsertPersonalDetails";
import LeaveRequest from "./features/employee/LeaveRequest";
import AllLeaveRequest from "./features/employee/AllLeaveRequest";
import Notes from "./features/employee/Notes";
import WorkReport from "./features/employee/WorkReport";
import AllWorkReport from "./features/employee/AllWorkReport";

function App() {
  const navigate = useNavigate();
//  const [userName, setUserName] = useState("");
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isChecking, setIsChecking] = useState(true); // <- important

  const roleToRouteMap = {
    HR: "/hr-dashboard",
    SUPER_ADMIN: "/admin-dashboard",
    EMPLOYEE: "/dashboard",
  };

  // useEffect(() => {
  //   const hasSession = document.cookie.includes("JSESSIONID");
  //   const savedRole = localStorage.getItem("userRole");

  //   console.log("Cookie has session:", hasSession);
  //   console.log("Saved role from localStorage:", savedRole);

  //   if (hasSession && savedRole) {
  //     setIsLoggedIn(true);
  //     setRole(savedRole.toUpperCase());
  //   } else {
  //     setIsLoggedIn(false);
  //     setRole(null);
  //   }

  //   setIsChecking(false);
  // }, []);

  // if (isChecking) {
  //   console.log("Still checking auth status...");
  //   return null;
  // }

  // console.log(
  //   "isLoggedIn:",
  //   isLoggedIn,
  //   "role:",
  //   role,
  //   "pathname:",
  //   location.pathname
  // );

  // if (isLoggedIn && role && location.pathname === "/login") {
  //   console.log("Redirecting to:", roleToRouteMap[role]);
  //   return <Navigate to={roleToRouteMap[role]} replace />;
  // }

  // if (
  //   location.pathname === "/login" &&
  //   !document.cookie.includes("JSESSIONID")
  // ) {
  //   setIsLoggedIn(false);
  //   setRole(null);
  //   setIsChecking(false);
  //   return;
  // }

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     try {
  //       const res = await fetch("http://localhost:8080/auth/me", {
  //         credentials: "include", // this allows sending cookies (for session)
  //       });

  //       if (res.status === 200) {
  //         const data = await res.json();
  //         setIsLoggedIn(true);
  //         setRole(data.role.toUpperCase());
  //       } else if (res.status === 401) {
  //         // Not logged in, clear state
  //         setIsLoggedIn(false);
  //         setRole(null);
  //       } else {
  //         console.error("Unexpected error", res.status);
  //         setIsLoggedIn(false);
  //         setRole(null);
  //       }
  //     } catch (err) {
  //       console.error("Network error", err);
  //       setIsLoggedIn(false);
  //       setRole(null);
  //     } finally {
  //       setIsChecking(false); // Ensure loading flags are updated
  //     }
  //   };

  //   checkLogin();
  // }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          // setUserName(data.fullName);
          setIsLoggedIn(true);
          setRole(data.role.toUpperCase());
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setRole(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkLogin();
  }, []);

  // ✅ Only redirect after checking session
  if (isChecking) return <div>Loading...</div>;

  // if (isLoggedIn && (location.pathname === "/login" || location.pathname === "/")) {
  //   return <Navigate to={roleToRouteMap[role]} replace />;
  // }
  // if (!isLoggedIn && location.pathname !== "/") {
  //   return <Navigate to="/login" replace />;
  // }

  // Redirect the logged-in user to the appropriate dashboard if they try to access the login page
  // if (isLoggedIn && (location.pathname === "/login" || location.pathname === "/")) {
  //   return <Navigate to={roleToRouteMap[role]} replace />;
  // }

  // if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/") {
  //   return <Navigate to="/login" replace />;
  // }

  // if (!isLoggedIn && (location.pathname !== "/login" || location.pathname !== "/")) {
  //   return <Navigate to={roleToRouteMap[role]} replace />;
  // }
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}

      {/* <Route path="/dashboard" element={<Dashboard />} /> */}

      {/* <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />}
      /> */}

      <Route element={<ProtectedRoute allowedRoles={["HR", "SUPER_ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/updateDetails/:id" element={<UpdateDetails />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/manage-employees" element={<ManageEmployee />} />
          <Route path="/all-leaves" element={<AllLeaveRequest />} />

        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/hr-dashboard" element={<HrDashboard />} />
          {/* <Route path="/all-work-report" element={<AllWorkReport />} /> */}

          {/* <Route path="/manage-employees" element={<ManageEmployee />} /> */}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/manager-dashboard" element={<AdminDashboard />} />
          <Route path="/all-work-report" element={<AllWorkReport />} />

          {/* <Route path="/add-employee" element={<AddEmployee/>} /> */}
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/myprofile" element={<MyProfile />} /> */}
        </Route>
      </Route>
      <Route element={<DashboardLayout />}>
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/work-report" element={<WorkReport />} />
        <Route path="/leaves" element={<LeaveRequest />} />
        <Route path="/insert-personal-details" element={<InsertPersonalDetails />} />
        <Route path="/notes" element={<Notes /> }/>
      </Route>

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Catch all incorrect URLs */}
      <Route path="*" element={<NotFound />} />

      {/* <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          <Route path="/hr-dashboard" element={<HrDashboard/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route> */}

      {/* <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> */}

      {/* <Route path="/dashboard" element={ <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
    </Routes>
  );
}

export default function AppWithRouter() {
  return <App />;
}
