import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoadmaps } from "../services/roadmapService";
import Navbar from "../components/common/Navbar";
import { getMyProgress, startRoadmap } from "../services/progressService";
import { getModulesByRoadmap } from "../services/moduleService";
import { getTasksByModule } from "../services/taskService";

const InternDashboard = () => {
  const [myLearning, setMyLearning] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [available, setAvailable] = useState([]);
  const [startedRoadmaps, setStartedRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const roadmaps = await getRoadmaps();
      const progress = await getMyProgress();

      // 1. Build task → roadmap map
      const taskToRoadmap = {};

      for (let roadmap of roadmaps) {
        const modules = await getModulesByRoadmap(roadmap._id);

        for (let mod of modules) {
          const tasks = await getTasksByModule(mod._id);

          for (let task of tasks) {
            taskToRoadmap[task._id] = roadmap._id;
          }
        }
      }

      // 2. Group progress by roadmap
      const roadmapProgressMap = {};

      for (let p of progress) {
        const roadmapId = taskToRoadmap[p.taskId?._id];
        if (!roadmapId) continue;

        if (!roadmapProgressMap[roadmapId]) {
          roadmapProgressMap[roadmapId] = [];
        }
        roadmapProgressMap[roadmapId].push(p);
      }

      // 3. Classify roadmaps
      const availableArr = [];
      const myLearningArr = [];
      const completedArr = [];

      for (let roadmap of roadmaps) {
        const rp = roadmapProgressMap[roadmap._id] || [];

        if (rp.length === 0) {
          availableArr.push(roadmap);
          continue;
        }

        const completedCount = rp.filter(
          (p) => p.status === "completed"
        ).length;

        if (completedCount === rp.length) {
          completedArr.push(roadmap);
        } else {
          myLearningArr.push({
            ...roadmap,
            completedTasks: completedCount,
            totalTasks: rp.length,
          });
        }
      }

      setAvailable(availableArr);
      setMyLearning(myLearningArr);
      setCompleted(completedArr);
    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleStartRoadmap = async (roadmapId) => {
    try {
      await startRoadmap(roadmapId);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="content-wrapper">
          <div className="alert alert-error">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="content-wrapper">
        {/* My Learning Section */}
        <div className="section-header">
          <h2 className="section-title">My Learning</h2>
        </div>

        {myLearning.length === 0 && (
          <div className="alert alert-info">No active roadmaps. Start learning from available roadmaps below!</div>
        )}

        <div className="grid grid-cols-1 mb-8">
          {myLearning.map((r) => (
            <div key={r._id} className="dashboard-card">
              <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-xl)' }}>
                {r.title}
              </h3>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-2)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}>
                  <span>Progress</span>
                  <span>{r.completedTasks} / {r.totalTasks} tasks</span>
                </div>

                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${(r.completedTasks / r.totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/roadmap/${r._id}?mode=track`)}
                className="btn btn-primary"
              >
                Continue Learning →
              </button>
            </div>
          ))}
        </div>

        {/* Completed Section */}
        <div className="section-header">
          <h2 className="section-title">Completed</h2>
        </div>

        {completed.length === 0 && (
          <div className="alert alert-info">No completed roadmaps yet. Keep learning!</div>
        )}

        <div className="grid grid-cols-1 mb-8">
          {completed.map((r) => (
            <div key={r._id} className="dashboard-card">
              <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-xl)' }}>
                {r.title}
              </h3>
              <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-success)' }}>
                Congratulations! You've completed this roadmap.
              </p>
              <button
                onClick={() => navigate(`/roadmap/${r._id}?mode=view`)}
                className="btn btn-secondary"
              >
                View Roadmap
              </button>
            </div>
          ))}
        </div>

        {/* Available Roadmaps Section */}
        <div className="section-header">
          <h2 className="section-title">Available Roadmaps</h2>
        </div>

        {available.length === 0 && (
          <div className="alert alert-info">No new roadmaps available at the moment.</div>
        )}

        <div className="grid grid-cols-1">
          {available.map((r) => (
            <div key={r._id} className="dashboard-card">
              <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-xl)' }}>
                {r.title}
              </h3>
              <p style={{ marginBottom: 'var(--space-4)' }}>{r.description}</p>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  onClick={() => navigate(`/roadmap/${r._id}?mode=view`)}
                  className="btn btn-secondary"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleStartRoadmap(r._id)}
                  className="btn btn-primary"
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InternDashboard;
