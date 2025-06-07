import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, Activity } from "lucide-react";

const Card = ({
  icon: Icon,
  title,
  value,
  description,
  bgColor,
  textColor,
  navigateTo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div
      className={`rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out ${bgColor} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
        <Icon className={`w-6 h-6 ${textColor}`} />
      </div>
      <p className={`text-3xl font-bold mt-4 ${textColor}`}>{value}</p>
      <p className={`text-sm mt-2 ${textColor} opacity-80`}>{description}</p>
    </div>
  );
};

const HrDashboard = () => {

  const navigate = useNavigate(); 
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [recentNotes, setRecentNotes] = useState([]); // 🌟 to store recent notes

  useEffect(() => {
    fetchTotalEmployees();
    fetchPendingLeaveRequests();
    fetchRecentNotes();
  }, []);

  const fetchTotalEmployees = async () => {
    try {
      const response = await fetch("/api/counts/employees", {
        credentials: "include",
      });
      const data = await response.json();
      setTotalEmployees(data.count);
    } catch (error) {
      console.error("Error fetching total employees:", error);
    }
  };

  const fetchPendingLeaveRequests = async () => {
    try {
      const response = await fetch("/api/counts/leaves/pending", {
        credentials: "include",
      });
      const data = await response.json();
      setPendingLeaves(data.count);
    } catch (error) {
      console.error("Error fetching pending leaves:", error);
    }
  };

  const fetchRecentNotes = async () => {
    try {
      const response = await fetch("/api/notes/recent");
      const data = await response.json();
      setRecentNotes(data); // store array of notes
    } catch (error) {
      console.error("Error fetching recent notes:", error);
    }
  };

  const handleClickNotes = () => {
    navigate("/notes");
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        icon={Users}
        title="Total Employees"
        value={totalEmployees}
        description="Total number of employees in the company."
        bgColor="bg-blue-100"
        textColor="text-blue-800"
        navigateTo="/manage-employees"
      />
      <Card
        icon={Clock}
        title="Pending Leave Requests"
        value={pendingLeaves}
        description="Leave requests waiting for approval."
        bgColor="bg-red-100"
        textColor="text-red-800"
        navigateTo="/all-leaves"
      />
      <div
        className="bg-gray-100 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out col-span-1 md:col-span-2 cursor-pointer"
        onClick={handleClickNotes}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Activities
          </h3>
          <Activity className="w-6 h-6 text-gray-500" />
        </div>

        <ul className="list-disc list-inside mt-4 text-sm text-gray-700 space-y-2">
          {recentNotes.length > 0 ? (
            recentNotes.map((note) => <li key={note.id}>{note.description}</li>)
          ) : (
            <li>No recent activities.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HrDashboard;
