import React, { useEffect, useState } from "react";

const Notes = () => {
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes", { credentials: "include" });
      const data = await response.json();
      setNotes(data.sort((a, b) => b.id - a.id)); // Sort descending by id
    } catch (error) {
      console.error("Failed to fetch notes", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingNoteId ? "PUT" : "POST";
      const url = editingNoteId ? `/api/notes/${editingNoteId}` : "/api/notes";

      await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ description }),
      });

      setDescription("");
      setEditingNoteId(null);
      fetchNotes();

      // ✅ Show success alert after saving
      alert(
        editingNoteId
          ? "Note updated successfully!"
          : "Note added successfully!"
      );
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Something went wrong while saving the note."); // ❌ Show error alert
    }
  };

  const handleEdit = (note) => {
    setDescription(note.description);
    setEditingNoteId(note.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) {
      return; // ❌ If user cancels, do nothing
    }

    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchNotes(); // ✅ Refresh the notes list after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <textarea
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write your note here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{note.id}</td>
                <td className="py-3 px-4 border-b">{note.description}</td>
                <td className="py-3 px-4 border-b space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    onClick={() => handleEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notes;
