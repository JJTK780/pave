import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModulesByRoadmap } from "../services/moduleService";
import { getTasksByModule } from "../services/taskService";
import api from "../services/api";
import Navbar from "../components/common/Navbar";

const MentorRoadmapBuilder = () => {
  const { id: roadmapId } = useParams();

  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState({});
  const [weekTitle, setWeekTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [dayNumber, setDayNumber] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  useEffect(() => {
    if (roadmapId) {
      fetchModules();
    }
  }, [roadmapId]);

  const fetchModules = async () => {
    try {
      const data = await getModulesByRoadmap(roadmapId);
      setModules(data);

      const taskMap = {};
      for (let mod of data) {
        try {
          const t = await getTasksByModule(mod._id);
          taskMap[mod._id] = t;
        } catch {
          taskMap[mod._id] = [];
        }
      }
      setTasks(taskMap);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You are not authorized to access this roadmap.");
      } else {
        alert("Failed to load roadmap structure.");
      }
    }
  };

  const addWeek = async () => {
    if (!weekTitle) return;

    await api.post("/modules", {
      roadmapId,
      title: weekTitle,
      order: modules.length + 1,
    });

    setWeekTitle("");
    fetchModules();
  };

  const addTask = async () => {
    if (!selectedModule) return;

    await api.post("/tasks", {
      moduleId: selectedModule,
      dayNumber,
      title: taskTitle,
      description: taskDescription,
    });

    setDayNumber("");
    setTaskTitle("");
    setTaskDescription("");
    fetchModules();
  };

  return (
    <>
      <Navbar />

      <div className="content-wrapper">
        <div className="section-header">
          <h2 className="section-title">Roadmap Builder</h2>
        </div>

        <div className="grid grid-cols-1" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
          {/* Builder Forms */}
          <div>
            {/* Add Week Card */}
            <div className="card card-compact mb-6">
              <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-lg)' }}>
                Add Week Module
              </h3>

              <div className="form-group">
                <label className="form-label">Week Title</label>
                <input
                  placeholder="e.g., Week 1: Introduction to React"
                  value={weekTitle}
                  onChange={(e) => setWeekTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <button onClick={addWeek} className="btn btn-primary btn-block">
                Add Week
              </button>
            </div>

            {/* Add Task Card */}
            <div className="card card-compact">
              <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-lg)' }}>
                Add Daily Task
              </h3>

              <div className="form-group">
                <label className="form-label">Select Week</label>
                <select
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="form-select"
                  value={selectedModule || ""}
                >
                  <option value="">Choose a week...</option>
                  {modules.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Day Number</label>
                <input
                  placeholder="e.g., 1"
                  type="number"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  placeholder="e.g., Learn React Hooks"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Task Description</label>
                <input
                  placeholder="Brief description of the task"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="form-input"
                />
              </div>

              <button onClick={addTask} className="btn btn-primary btn-block">
                Add Task
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 'calc(var(--space-16) + var(--space-4))' }}>
              <h3 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-lg)' }}>
                Current Structure
              </h3>

              {modules.length === 0 && (
                <div className="alert alert-info">
                  No modules added yet. Start by adding a week module!
                </div>
              )}

              {modules.map((module) => (
                <div key={module._id} style={{ marginBottom: 'var(--space-6)' }}>
                  <h4 style={{
                    color: 'var(--color-primary-light)',
                    marginBottom: 'var(--space-3)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)'
                  }}>
                    {module.title}
                  </h4>

                  {tasks[module._id]?.length === 0 && (
                    <p style={{
                      marginLeft: 'var(--space-4)',
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--font-size-sm)',
                      fontStyle: 'italic'
                    }}>
                      No tasks added yet
                    </p>
                  )}

                  {tasks[module._id]?.map((task) => (
                    <p
                      key={task._id}
                      style={{
                        marginLeft: 'var(--space-4)',
                        marginBottom: 'var(--space-2)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      <span style={{
                        color: 'var(--color-primary)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        Day {task.dayNumber}:
                      </span>{" "}
                      {task.title}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorRoadmapBuilder;
