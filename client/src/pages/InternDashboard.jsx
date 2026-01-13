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

  if (loading) return <p>Loading roadmaps...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>My Learning</h2>

        {myLearning.length === 0 && <p>No active roadmaps</p>}

        {myLearning.map((r) => (
          <div key={r._id} style={{ marginBottom: "12px" }}>
            <h3>{r.title}</h3>
            <p>
              {r.completedTasks} / {r.totalTasks} completed
            </p>

            <button onClick={() => navigate(`/roadmap/${r._id}?mode=track`)}>
              Continue
            </button>
          </div>
        ))}
        <h2>Completed</h2>

        {completed.length === 0 && <p>No completed roadmaps</p>}

        {completed.map((r) => (
          <div key={r._id} style={{ marginBottom: "12px" }}>
            <h3>{r.title}</h3>

            <button onClick={() => navigate(`/roadmap/${r._id}?mode=view`)}>
              View Roadmap
            </button>
          </div>
        ))}

        <h2>Available Roadmaps</h2>

        {available.length === 0 && <p>No roadmaps available</p>}

        {available.map((r) => (
          <div key={r._id} style={{ marginBottom: "12px" }}>
            <h3>{r.title}</h3>
            <p>{r.description}</p>

            <button onClick={() => navigate(`/roadmap/${r._id}?mode=view`)}>
              View Roadmap
            </button>

            <button onClick={() => handleStartRoadmap(r._id)}>
              Start Roadmap
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default InternDashboard;
