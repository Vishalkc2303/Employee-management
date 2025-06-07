import React, { useState, useEffect } from "react";
import axios from "axios";

const AllWorkReport = () => {
  const [workReports, setWorkReports] = useState([]);

  useEffect(() => {
    // Fetch all work reports
    axios
      .get("/api/work-reports/all-work-reports")
      .then((response) => {
        setWorkReports(response.data);
      })
      .catch((error) => {
        console.error("Error fetching work reports:", error);
      });
  }, []);

  const handleVerify = (reportId) => {
    console.log("Report ID:", reportId); // Log to ensure the correct ID is passed

    const userRemark = window.prompt("Enter a remark for this report:");

    if (userRemark) {
      axios
        .put(
          `/api/work-reports/status/${reportId}`,
          {
            status: "VERIFIED",
            remarks: userRemark,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setWorkReports((prevReports) =>
            prevReports.map((report) =>
              report.id === reportId
                ? { ...report, status: "VERIFIED", remarks: userRemark }
                : report
            )
          );
        })
        .catch((error) => {
          console.error("Error verifying work report:", error);
        });
    } else {
      alert("Verification aborted. No remark provided.");
    }
  };

  const handleReject = (reportId) => {
    const userRemark = window.prompt(
      "Enter a remark for rejecting this report:"
    );

    if (userRemark) {
      // Update the status to 'REJECTED' and set the remark
      axios
        .put(
          `/api/work-reports/status/${reportId}`,
          {
            status: "REJECTED",
            remarks: userRemark,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setWorkReports((prevReports) =>
            prevReports.map((report) =>
              report.id === reportId
                ? { ...report, status: "REJECTED", remarks: userRemark }
                : report
            )
          );
        })
        .catch((error) => {
          console.error("Error rejecting work report:", error);
        });
    } else {
      alert("Rejection aborted. No remark provided.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">All Work Reports</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Work Report ID</th>
              <th className="px-6 py-3 text-left">User Name</th>
              <th className="px-6 py-3 text-left">Tasks Completed</th>
              <th className="px-6 py-3 text-left">Blocker</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {workReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{report.id}</td>
                <td className="px-6 py-4">{report.fullName}</td>
                <td className="px-6 py-4">{report.tasksCompleted}</td>
                <td className="px-6 py-4">{report.blockers}</td>
                <td className="px-6 py-4">{report.status}</td>

                {/* <td className="px-6 py-4">{report.verifiedByUser ? report.verifiedByUser.id : 'Not Verified'}</td> */}
                <td className="px-6 py-4">
                  {report.status !== "VERIFIED" &&
                    report.status !== "REJECTED" && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleVerify(report.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(report.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold"
                        >
                          Reject
                        </button>
                      </div>
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

export default AllWorkReport;
