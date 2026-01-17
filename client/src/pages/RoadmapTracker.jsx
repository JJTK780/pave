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
      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">
            {isTracking ? "Track Your Progress" : "Roadmap Preview"}
          </h2>
        </div>

        {modules.length === 0 && (
          <div className="alert alert-info">No modules found in this roadmap.</div>
        )}

        {modules.map((module) => (
          <div key={module._id} className="card mb-6">
            <h3 style={{
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-primary-light)'
            }}>
              {module.title}
            </h3>

            {tasks[module._id]?.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No tasks in this module yet.
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {tasks[module._id]?.map((task) => {
                const isCompleted = completedTasks.includes(task._id);

                return (
                  <div
                    key={task._id}
                    style={{
                      padding: 'var(--space-4)',
                      background: isCompleted
                        ? 'rgba(16, 185, 129, 0.05)'
                        : 'rgba(15, 20, 25, 0.3)',
                      border: `1px solid ${isCompleted
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                      {isTracking && (
                        <label className="custom-checkbox" style={{ marginTop: '2px' }}>
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleCheckbox(task._id)}
                          />
                        </label>
                      )}

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          color: isCompleted ? 'var(--color-success)' : 'var(--color-text-primary)',
                          marginBottom: 'var(--space-2)',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                          <span style={{
                            color: 'var(--color-primary)',
                            marginRight: 'var(--space-2)'
                          }}>
                            Day {task.dayNumber}:
                          </span>
                          {task.title}
                        </div>

                        <p style={{
                          margin: 0,
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-sm)',
                          opacity: isCompleted ? 0.7 : 1
                        }}>
                          {task.description}
                        </p>
                      </div>

                      {isCompleted && (
                        <span style={{
                          fontSize: 'var(--font-size-xl)',
                          color: 'var(--color-success)'
                        }}>
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoadmapTracker;
