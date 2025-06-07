import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function InsertPersonalDetails() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // include profilePic in your form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    linkedinUrl: "",
    resumeUrl: "",
    dateOfBirth: "",
    profilePic: "", // ← added
  });

  // Load existing profile
  useEffect(() => {
    axios
      .get("/api/personal-details")
      .then((res) => {
        const data = res.data;
        setProfile(data);
        setForm({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
          linkedinUrl: data.linkedinUrl || "",
          resumeUrl: data.resumeUrl || "",
          dateOfBirth: data.dateOfBirth || "",
          profilePic: data.profilePic || "", // ← populate it
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 204) {
          // no profile yet
          setProfile(null);
        } else {
          console.error("Failed to load profile:", err);
          setError("Could not load profile.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let res;
      if (profile) {
        res = await axios.put("/api/personal-details", form);
      } else {
        res = await axios.post("/api/personal-details", form);
      }

      setProfile(res.data);
      setForm((f) => ({ ...f, ...res.data }));
      alert("Profile saved successfully!"); // ✅ Success alert
      navigate("/myprofile");
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save profile.");
      alert("Failed to save profile."); // ❌ Only show this if there’s a real error
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {profile ? "Edit" : "Create"} Employee Personal Details
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Address (full width) */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block font-semibold mb-1">LinkedIn URL</label>
          <input
            type="url"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Resume URL */}
        <div>
          <label className="block font-semibold mb-1">Resume URL</label>
          <input
            type="url"
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-semibold mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Profile Picture URL */}
        <div>
          <label className="block font-semibold mb-1">Profile Pic URL</label>
          <input
            type="url"
            name="profilePic"
            value={form.profilePic}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Submit Button (full width) */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-2 rounded text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving…" : profile ? "Update Details" : "Create Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
