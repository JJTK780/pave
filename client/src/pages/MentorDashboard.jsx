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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="content-wrapper">
          <div className="loading-text">Loading roadmaps...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">Mentor Dashboard</h2>
        </div>

        {/* Create Roadmap Card */}
        <div className="card mb-8">
          <h3 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-xl)' }}>
            Create New Roadmap
          </h3>

          <form onSubmit={handleCreateRoadmap}>
            <div className="form-group">
              <label className="form-label">Roadmap Title</label>
              <input
                type="text"
                placeholder="e.g., Frontend Development Roadmap"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                placeholder="Brief description of what this roadmap covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Create Roadmap
            </button>
          </form>
        </div>

        {/* Roadmap List */}
        <div className="section-header">
          <h3 className="section-title">Your Roadmaps</h3>
        </div>

        {roadmaps.length === 0 && (
          <div className="alert alert-info">
            No roadmaps created yet. Create your first roadmap above!
          </div>
        )}

        <div className="grid grid-cols-1">
          {roadmaps.map((roadmap) => (
            <div key={roadmap._id} className="dashboard-card">
              <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-xl)' }}>
                {roadmap.title}
              </h4>
              <p style={{ marginBottom: 'var(--space-4)' }}>
                {roadmap.description || 'No description provided'}
              </p>

              <button
                onClick={() => navigate(`/mentor/roadmap/${roadmap._id}`)}
                className="btn btn-primary"
              >
                Manage Roadmap →
              </button>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error mt-6">{error}</div>}
      </div>
    </>
  );
};

export default MentorDashboard;
