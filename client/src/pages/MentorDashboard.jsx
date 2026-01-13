import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

import { getRoadmaps, createRoadmap } from "../services/roadmapService";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await getRoadmaps();
      setRoadmaps(data);
    } catch (err) {
      setError("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await createRoadmap({ title, description });
      setTitle("");
      setDescription("");
      fetchRoadmaps(); // refresh list
    } catch (err) {
      setError("Failed to create roadmap");
    }
  };

  if (loading) return <p>Loading roadmaps...</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Mentor Dashboard</h2>

        {/* Create Roadmap */}
        <form onSubmit={handleCreateRoadmap} style={{ marginBottom: "20px" }}>
          <h3>Create New Roadmap</h3>

          <input
            type="text"
            placeholder="Roadmap Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: "block", marginBottom: "8px", width: "300px" }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: "block", marginBottom: "8px", width: "300px" }}
          />

          <button type="submit">Create</button>
        </form>

        {/* Roadmap List */}
        <h3>Your Roadmaps</h3>

        {roadmaps.length === 0 && <p>No roadmaps created yet</p>}

        {roadmaps.map((roadmap) => (
          <div
            key={roadmap._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <h4>{roadmap.title}</h4>
            <p>{roadmap.description}</p>

            <button onClick={() => navigate(`/mentor/roadmap/${roadmap._id}`)}>
              Manage Roadmap
            </button>
          </div>
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </>
  );
};

export default MentorDashboard;
