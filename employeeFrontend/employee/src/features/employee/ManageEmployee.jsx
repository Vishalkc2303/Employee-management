import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, ToggleLeft, ToggleRight, Upload } from "lucide-react";

const roleToLabel = {
  HR: "HR",
  SUPER_ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

const toggleStatus = async (empId) => {
  try {
    const response = await fetch(`/api/employees/${empId}/toggle-status`, {
      method: "PUT",
    });

    if (response.ok) {
      console.log("Status toggled successfully");

      // You might want to refresh the data or update state here
      // Example: re-fetch employee list or update the specific employee in state
    } else {
      console.error("Failed to toggle status");
    }
  } catch (error) {
    console.error("Error toggling status:", error);
  }
};

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/all-users", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setEmployees(data);
        } else {
          console.error("Failed to fetch employees");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/updateDetails/${id}`);
  };

  const handleEdit = (id) => {
    console.log(`Edit user with ID: ${id}`);
    // Redirect to edit form or open modal
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Employees</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading employees...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Update Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.email.split("@")[0]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {emp.role}
                  </td>

                  <td>
                    <button
                      onClick={() => handleUpdate(emp.id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Update"
                    >
                      <Upload className="w-5 h-5 inline" />
                    </button>
                  </td>
                  {/* Updated here */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        emp.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(emp.id)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => toggleStatus(emp.id)}
                      className={`${
                        emp.active
                          ? "text-green-600 hover:text-green-800"
                          : "text-red-600 hover:text-red-800"
                      } transition`}
                      title="Toggle Status"
                    >
                      {emp.active ? (
                        <ToggleRight className="w-5 h-5 inline" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 inline" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
