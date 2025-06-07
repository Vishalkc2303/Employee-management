import React, { useState, useEffect } from "react";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Fetch all departments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to fetch all departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/departments");
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch departments");
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing department
        await axios.put(`/api/departments/${currentId}`, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // Create new department
        const response = await axios.post("/api/departments/create", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("API response:", response); // Check the response from the backend
      }

      // Reset form and fetch updated list
      setFormData({ name: "", description: "" });
      setIsEditing(false);
      setCurrentId(null);
      fetchDepartments();
    } catch (err) {
      setError(
        isEditing
          ? "Failed to update department"
          : "Failed to create department"
      );
      console.error("Error:", err);
    }
  };

  // Handle edit button click
  const handleEdit = (department) => {
    setFormData({
      name: department.name,
      description: department.description,
    });
    setIsEditing(true);
    setCurrentId(department.id);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`/api/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        setError("Failed to delete department");
        console.error("Error deleting department:", err);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Department Management
        </h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Department Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {isEditing ? "Edit Department" : "Add New Department"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department description"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isEditing ? "Update Department" : "Add Department"}
              </button>
            </div>
          </form>
        </div>

        {/* Departments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">
            All Departments
          </h2>

          {loading ? (
            <div className="text-center p-10">
              <p className="text-gray-500">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center p-10">
              <p className="text-gray-500">
                No departments found. Add your first department above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map((department) => (
                    <tr key={department.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {department.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {department.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleEdit(department)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        {/* <button
                          onClick={() => handleDelete(department.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;
