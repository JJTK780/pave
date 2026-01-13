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

      <div style={{ padding: "20px" }}>
        <h2>Roadmap Builder</h2>

        {/* Add Week */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Add Week</h3>
          <input
            placeholder="Week title (e.g. Week 1: Basics)"
            value={weekTitle}
            onChange={(e) => setWeekTitle(e.target.value)}
          />
          <button onClick={addWeek}>Add Week</button>
        </div>

        {/* Add Task */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Add Task (Day)</h3>

          <select onChange={(e) => setSelectedModule(e.target.value)}>
            <option value="">Select Week</option>
            {modules.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>

          <input
            placeholder="Day Number"
            type="number"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
          />

          <input
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <input
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />

          <button onClick={addTask}>Add Task</button>
        </div>

        {/* Preview */}
        <h3>Current Structure</h3>

        {modules.map((module) => (
          <div key={module._id} style={{ marginBottom: "15px" }}>
            <h4>{module.title}</h4>

            {tasks[module._id]?.map((task) => (
              <p key={task._id} style={{ marginLeft: "20px" }}>
                Day {task.dayNumber}: {task.title}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default MentorRoadmapBuilder;
