import React, { useEffect, useState } from "react";
import axios from "axios";

const AllLeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all leave requests on component mount
  useEffect(() => {
    axios
      .get("/api/leave-requests/all") // Adjust the endpoint as per your backend
      .then((res) => {
        setLeaveRequests(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch leave requests:", err);
        setError("Failed to load leave requests.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle approval of leave request
  const handleApprove = (id) => {
    axios
      .put(`/api/leave-requests/${id}/approve`) // Assuming you have an endpoint for approval
      .then((res) => {
        alert("Leave request approved!");
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "APPROVED" } : request
          )
        );
      })
      .catch((err) => {
        console.error("Failed to approve leave request:", err);
        alert("Failed to approve leave request.");
      });
  };

  // Handle rejection of leave request
  const handleReject = (id) => {
    axios
      .put(`/api/leave-requests/${id}/reject`) // Assuming you have an endpoint for rejection
      .then((res) => {
        alert("Leave request rejected!");
        setLeaveRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "REJECTED" } : request
          )
        );
      })
      .catch((err) => {
        console.error("Failed to reject leave request:", err);
        alert("Failed to reject leave request.");
      });
  };

  return (
    <div>
      <h1>All Leave Requests</h1>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Employee</th>
              <th className="px-4 py-2 border">Leave Type</th>
              <th className="px-4 py-2 border">Start Date</th>
              <th className="px-4 py-2 border">End Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-2 border">{request.id}</td>
                <td className="px-4 py-2 border">{request.userFullName}</td>
                <td className="px-4 py-2 border">{request.leaveType}</td>
                <td className="px-4 py-2 border">{request.startDate}</td>
                <td className="px-4 py-2 border">{request.endDate}</td>
                <td className="px-4 py-2 border">{request.status}</td>
                <td className="px-4 py-2 border">
                  {request.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllLeaveRequest;
