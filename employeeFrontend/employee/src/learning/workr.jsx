import React, { useState, useEffect } from 'react';

const WorkReport = () => {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    workDate: '',
    tasksCompleted: '',
    blockers: '',
  });

  useEffect(() => {
    setReports([
      {
        id: 1,
        workDate: '2025-04-25',
        tasksCompleted: 'Fixed login bug',
        blockers: 'None',
        remarks: 'Well done!',
        status: 'FINALIZED'
      },
      {
        id: 2,
        workDate: '2025-04-26',
        tasksCompleted: 'Created new landing page',
        blockers: 'Waiting for assets',
        remarks: '',
        status: 'DRAFT'
      }
    ]);
  }, []);

  const handleAddClick = () => {
    setFormData({
      id: null,
      workDate: '',
      tasksCompleted: '',
      blockers: '',
    });
    setShowForm(true);
  };

  const handleEditClick = (report) => {
    setFormData({
      id: report.id,
      workDate: report.workDate,
      tasksCompleted: report.tasksCompleted,
      blockers: report.blockers,
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAsDraft = () => {
    if (formData.id) {
      setReports(prev =>
        prev.map(r => r.id === formData.id ? { ...r, ...formData, status: 'DRAFT' } : r)
      );
    } else {
      const newReport = { ...formData, id: Date.now(), status: 'DRAFT' };
      setReports(prev => [...prev, newReport]);
    }
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setReports(prev =>
        prev.map(r => r.id === formData.id ? { ...r, ...formData, status: 'SUBMITTED' } : r)
      );
    } else {
      const newReport = { ...formData, id: Date.now(), status: 'SUBMITTED' };
      setReports(prev => [...prev, newReport]);
    }
    setShowForm(false);
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
          <h3 className="text-2xl font-semibold mb-4">{formData.id ? 'Edit Work Report' : 'Add Work Report'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">Work Date:</label>
              <input
                type="date"
                name="workDate"
                value={formData.workDate}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Tasks Completed:</label>
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
                <td className="py-2 px-4 border-b">{report.blockers || 'None'}</td>
                <td className="py-2 px-4 border-b">{report.remarks || 'Pending'}</td>
                <td className="py-2 px-4 border-b">{report.status}</td>
                <td className="py-2 px-4 border-b">
                  {(report.status === 'DRAFT' || report.status === 'REJECTED') && (
                    <button
                      onClick={() => handleEditClick(report)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    >
                      Edit
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
