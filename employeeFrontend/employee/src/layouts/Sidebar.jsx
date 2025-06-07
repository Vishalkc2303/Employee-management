// src/layout/Sidebar.jsx
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const role = localStorage.getItem("userRole");

  return (
    <div className="sidebar">
      <h2 className="logo">MyApp</h2>
      <h1>{role}</h1>
      <nav>
        <ul>
          {/* Always visible */}
          <li>
            <Link to="/myprofile">My Profile</Link>
          </li>

          <li>
                <Link to="/work-report">Work reports</Link>
              </li>

          {role === "MANAGER" && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              
              <li>
                <Link to="/leaves">Apply Leave</Link>
              </li>
              <li>
                <Link to="/all-work-report">All work report</Link>
              </li>
            </>
          )}

          {role === "EMPLOYEE" && (
            <>
              <li>
                <Link to="/leaves">Apply Leave</Link>
              </li>
            </>
          )}

          {(role === "HR" || role === "SUPER_ADMIN") && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/add-employee">Add Employee</Link>
              </li>
              <li>
                <Link to="/manage-employees">Manage Employees</Link>
              </li>
              <li>
                <Link to="/departments">Departments</Link>
              </li>
              <li>
                <Link to="/leaves">Apply Leave</Link>
              </li>
              <li>
                <Link to="/all-leaves">All Leave Request</Link>
              </li>
              {/* <li>
                <Link to="/salary">Salary</Link>
              </li> */}
            </>
          )}

          {role === "SUPER_ADMIN" && (
            <>
              {/* <li>
                <Link to="/settings">System Settings</Link>
              </li> */}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
