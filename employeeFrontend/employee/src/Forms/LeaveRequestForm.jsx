import React, { useState } from "react";
import axios from "axios";

export default function LeaveRequestForm() {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await axios.post("/api/leave-requests", {
        startDate: form.startDate,
        endDate: form.endDate,
        leaveType: form.leaveType,
        reason: form.reason,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Leave request submitted!");
      navigate("/leave-requests"); // 👈 Redirect here
      setForm({ startDate: "", endDate: "", leaveType: "", reason: "" });
    } catch (err) {
      console.error("Submit failed:", err);
      setError(err.response?.data?.message || "Failed to submit leave request.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">New Leave Request</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label className="block font-semibold mb-1">Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Leave Type</label>
          <select name="leaveType" value={form.leaveType} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
            <option value="">Select type</option>
            <option value="ANNUAL">Annual</option>
            <option value="SICK">Sick</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Reason (optional)</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} rows={4} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="md:col-span-2">
          <button type="submit" disabled={saving} className={`w-full py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
            {saving ? "Submitting…" : "Submit Leave Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
