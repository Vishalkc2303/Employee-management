import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkReport = () => {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workDate: new Date().toISOString().split("T")[0], // Current date
    tasksCompleted: "",
    blockers: "",
  });

  useEffect(() => {
    // Fetch work reports from the API
    axios
      .get("/api/work-reports/fetchByUser") // Replace with the correct API URL for fetching work reports
      .then((response) => {
        setReports(response.data); // Set the fetched data to the reports state
      })
      .catch((error) => {
        console.error("There was an error fetching the work reports!", error);
      });
  }, []); // Empty dependency array to run the effect once when the component mounts

  const handleAddClick = () => {
    setFormData({
      workDate: new Date().toISOString().split("T")[0], // Current date
      tasksCompleted: "",
      blockers: "",
    });
    setShowForm(true);
  };

  const handleEditClick = (report) => {
    setFormData({
      id: report.id, // Keep the id for editing
      workDate: report.workDate,
      tasksCompleted: report.tasksCompleted,
      blockers: report.blockers,
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAsDraft = () => {
    // Ensure status is set to "DRAFT" before saving or updating the report
    const reportData = { ...formData, status: "DRAFT" };

    if (formData.id) {
      // If report already has an ID, update it with "DRAFT" status
      axios
        .put(`/api/work-reports/edit/${formData.id}`, reportData)
        .then((response) => {
          setReports((prev) =>
            prev.map((r) =>
              r.id === formData.id ? { ...r, ...formData, status: "DRAFT" } : r
            )
          );
        })
        .catch((error) => console.error("Error updating work report:", error));
    } else {
      // If it's a new report, create a new one with "DRAFT" status
      axios
        .post("/api/work-reports", reportData)
        .then((response) => {
          setReports((prev) => [...prev, response.data]);
        })
        .catch((error) => console.error("Error saving work report:", error));
    }

    // Close the form after saving the draft
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Are you sure you want to submit this report for review? If you submit it, you cannot edit it."
      )
    ) {
      const reportData = { ...formData, status: "SUBMITTED" }; // Ensure status is set to "SUBMITTED"

      if (formData.id) {
        axios
          .put(`/api/work-reports/edit/${formData.id}`, reportData) // Update the report
          .then((response) => {
            setReports((prev) =>
              prev.map((r) =>
                r.id === formData.id
                  ? { ...r, ...formData, status: "SUBMITTED" }
                  : r
              )
            );
          })
          .catch((error) =>
            console.error("Error updating work report:", error)
          );
      } else {
        axios
          .post("/api/work-reports", reportData) // Create a new report
          .then((response) => {
            setReports((prev) => [...prev, response.data]);
          })
          .catch((error) => console.error("Error saving work report:", error));
      }

      setShowForm(false);
    }
  };

  const handleDeleteClick = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      axios
        .delete(`/api/work-reports/${reportId}`) // Delete the report
        .then(() => {
          setReports((prev) => prev.filter((r) => r.id !== reportId));
        })
        .catch((error) => console.error("Error deleting work report:", error));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Work Reports</h2>

      <button
        onClick={handleAddClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-6"
      >
        Add Work Report
      </button>

      {/* Form - Hidden by default */}
      {showForm && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">
            {formData.id ? "Edit Work Report" : "Add Work Report"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">
                Tasks Completed:
              </label>
              <textarea
                name="tasksCompleted"
                value={formData.tasksCompleted}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Blockers:</label>
              <textarea
                name="blockers"
                value={formData.blockers}
                onChange={handleInputChange}
                rows="2"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Submit for Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Work Date</th>
              <th className="py-2 px-4 border-b">Tasks Completed</th>
              <th className="py-2 px-4 border-b">Blockers</th>
              <th className="py-2 px-4 border-b">Remarks (by Manager)</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="text-center">
                <td className="py-2 px-4 border-b">{report.workDate}</td>
                <td className="py-2 px-4 border-b">{report.tasksCompleted}</td>
                <td className="py-2 px-4 border-b">
                  {report.blockers || "None"}
                </td>
                <td className="py-2 px-4 border-b">
                  {report.remarks || "Pending"}
                </td>
                <td className="py-2 px-4 border-b">{report.status}</td>
                <td className="py-2 px-4 border-b">
                  {(report.status === "DRAFT" ||
                    report.status === "REJECTED") && (
                    <button
                      onClick={() => handleEditClick(report)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                  )}

                  {report.status !== "VERIFIED" && (
                    <button
                      onClick={() => handleDeleteClick(report.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded ml-2"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkReport;
