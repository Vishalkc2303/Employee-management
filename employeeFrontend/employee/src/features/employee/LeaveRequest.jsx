import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveRequest() {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);

  // form fields
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const [leaveType, setLeaveType]   = useState("");
  const [reason, setReason]         = useState("");

  // load leave requests once
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/leave-requests");
        const sorted = res.data.sort(
          (a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)
        );
        setRequests(sorted);
      } catch (err) {
        console.error(err);
        setError("Could not load your leave requests.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // submit new leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await axios.post(
        "/api/leave-requests",
        { startDate, endDate, leaveType, reason },
        { headers: { "Content-Type": "application/json" } }
      );

      // reload list
      const res = await axios.get("/api/leave-requests");
      const sorted = res.data.sort(
        (a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)
      );
      setRequests(sorted);

      // hide form & reset fields
      setShowForm(false);
      setStartDate("");
      setEndDate("");
      setLeaveType("");
      setReason("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to submit leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Leave Requests</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Leave
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* List */}
      {loading ? (
        <p>Loading…</p>
      ) : requests.length ? (
        <ul className="space-y-4 mb-6">
          {requests.map((req) => (
            <li key={req.id} className="border p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <p>
                    <span className="font-semibold">Period:</span>{" "}
                    {req.startDate} → {req.endDate}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    {req.leaveType}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={
                        req.status === "APPROVED"
                          ? "text-green-600"
                          : req.status === "REJECTED"
                          ? "text-red-600"
                          : "text-gray-600"
                      }
                    >
                      {req.status}
                    </span>
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Applied on{" "}
                  {new Date(req.appliedOn).toLocaleDateString()}
                </div>
              </div>
              {req.remarks && (
                <p className="mt-2">
                  <span className="font-semibold">Remarks:</span> {req.remarks}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-6">You have no leave requests.</p>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Apply Leave</h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
            >
              {/* Start Date */}
              <div>
                <label className="block font-semibold mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              {/* End Date */}
              <div>
                <label className="block font-semibold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              {/* Leave Type */}
              <div>
                <label className="block font-semibold mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select type</option>
                  <option value="ANNUAL">Annual</option>
                  <option value="SICK">Sick</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>
              {/* Reason (full width) */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">
                  Reason (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              {/* Submit button (full width) */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-2 rounded text-white ${
                    saving
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {saving ? "Submitting…" : "Submit Leave Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
