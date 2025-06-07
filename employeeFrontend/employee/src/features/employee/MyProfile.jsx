import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InsertPersonalDetails from "./InsertPersonalDetails";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "••••••••",
  });
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const resp = await fetch(`/api/personal-details`);
        if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
        const text = await resp.text();
        const data = JSON.parse(text);

        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    fetchProfile();
  }, []);
  if (!profile) {
    navigate("/insert-personal-details"); // Redirect to the form page
  }

  // useEffect(() => {
  //   fetchProfile();
  // }, []);  // “default” – runs exactly once, after first render

  // useEffect(() => {
  //   async function fetchProfile() {
  //     try {
  //       const resp = await fetch(`/api/personal-details`);
  //       if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
  //       const data = await resp.json();
  //       setProfile(data);
  //     } catch (err) {
  //       console.error("Failed to load profile:", err);
  //       setError(err.message || "Unknown error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchProfile();
  // }, []);

  const [employeeProfile, setEmployeeProfile] = useState({});
  useEffect(() => {
    axios
      .get("/api/profile/employee-details")
      .then((res) => setEmployeeProfile(res.data))
      .catch((err) => console.error("Failed to load employee details:", err));
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/profile");
      setUserData({
        email: response.data.email,
        password: "••••••••",
      });
      setError(null);
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    try {
      await axios.post("/api/profile/change-password", {
        newPassword: passwordData.newPassword,
      });

      setShowPasswordForm(false);
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully");
    } catch (err) {
      alert("Failed to update password");
      console.error("Error updating password:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading account information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-100 p-4 rounded text-red-700">
          <p>{error}</p>
          <button
            onClick={fetchUserProfile}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 ">
      <h1 className="text-2xl pl-4 font-bold text-gray-900 mb-6">
        Employee Personal Details
      </h1>
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Employee Profile Info Section */}
        {/* Profile picture */}



        {/* <div className="flex justify-center mb-6">
          <img
            src={
              profile.profilePic
                ? profile.profilePic
                : "/images/demo-profile.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div> */}


        
        {/* <div className="md:w-1/2"> */}
        <div className="flex justify-between items-center mb-1">
          {/* <label className="block text-sm font-medium text-gray-700">
            Password
          </label> */}
          <button
            type="button"
            onClick={() => navigate("/insert-personal-details")}
            // onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-blue-600 hover:text-blue-800 ml-auto mr-6"
          >
            Edit personal details
            {/* {<InsertPersonalDetails/>} */}
          </button>
        </div>

        {/* Two‑column form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-6">
          {/* Full Name */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName || ""}
              disabled
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="tel"
              value={profile.phone || ""}
              disabled
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>

          {/* Address (full width) */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              value={profile.address || ""}
              disabled
              rows={3}
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block font-semibold mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedinUrl || ""}
              disabled
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>

          {/* Resume URL */}
          <div>
            <label className="block font-semibold mb-1">Resume URL</label>
            <input
              type="url"
              value={profile.resumeUrl || ""}
              disabled
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              value={profile.dateOfBirth || ""}
              disabled
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>

          {/* Profile Pic URL */}
          <div>
            <label className="block font-semibold mb-1">Profile Pic URL</label>
            <input
              type="url"
              value={profile.profilePic || ""}
              disabled
              className="w-full border bg-gray-100 px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="w-full mx-auto px-0">
          <h1 className="text-2xl pl-4 font-bold text-gray-900 mb-6">
            Account Information
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
              {/* Email Address - Half Width */}
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Your email address is used for logging in and notifications.
                </p>
              </div>

              {/* Password Section - Half Width */}
              <div className="md:w-1/2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showPasswordForm ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {!showPasswordForm ? (
                  <div>
                    <input
                      type="password"
                      value={userData.password}
                      readOnly
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      For security reasons, your password is never displayed.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-4 mt-2 p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="8"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Employee Profile Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Employee Profile
          </h2>

          <div className="md:flex md:space-x-6 space-y-6 md:space-y-0">
            {/* Left Column */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={employeeProfile.departmentName || ""}
                  readOnly
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  value={
                    employeeProfile.salary ? `₹${employeeProfile.salary}` : ""
                  }
                  readOnly
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date
                </label>
                <input
                  type="text"
                  value={employeeProfile.joinDate || ""}
                  readOnly
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={employeeProfile.jobTitle || ""}
                  readOnly
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="text"
                  value={employeeProfile.experienceYears || ""}
                  readOnly
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
