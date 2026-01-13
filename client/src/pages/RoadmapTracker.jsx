import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModulesByRoadmap } from "../services/moduleService";
import { getTasksByModule } from "../services/taskService";
import { getMyProgress, markTaskCompleted } from "../services/progressService";
import Navbar from "../components/common/Navbar";
import { useLocation } from "react-router-dom";

const RoadmapTracker = () => {
  const { id: roadmapId } = useParams();

  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState({});
  const [completedTasks, setCompletedTasks] = useState([]);
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");
  const isTracking = mode === "track";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 1. Fetch modules
    const modulesData = await getModulesByRoadmap(roadmapId);
    setModules(modulesData);

    // 2. Fetch progress (SAFE)
    const progressData = await getMyProgress();
    setCompletedTasks(
      progressData
        .filter((p) => p.taskId && p.taskId._id && p.status === "completed")
        .map((p) => p.taskId._id)
    );

    // 3. Fetch tasks per module (SAFE)
    const tasksByModule = {};

    for (let mod of modulesData) {
      if (!mod || !mod._id) continue;

      const taskList = await getTasksByModule(mod._id);

      // filter out null / broken tasks
      tasksByModule[mod._id] = taskList.filter((t) => t && t._id);
    }

    setTasks(tasksByModule);
  };

  const handleCheckbox = async (taskId) => {
    if (completedTasks.includes(taskId)) return;

    await markTaskCompleted(taskId);
    setCompletedTasks((prev) => [...prev, taskId]);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Roadmap Tracker</h2>

        {modules.map((module) => (
          <div key={module._id} style={{ marginBottom: "20px" }}>
            <h3>{module.title}</h3>

            {tasks[module._id]?.map((task) => (
              <div key={task._id} style={{ marginLeft: "20px" }}>
                {isTracking && (
                  <input
                    type="checkbox"
                    checked={completedTasks.includes(task._id)}
                    onChange={() => handleCheckbox(task._id)}
                  />
                )}

                <strong style={{ marginLeft: "8px" }}>
                  Day {task.dayNumber}: {task.title}
                </strong>
                <p style={{ marginLeft: "28px" }}>{task.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default RoadmapTracker;
