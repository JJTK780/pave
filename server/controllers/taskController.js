const Task = require("../models/Task");
const Module = require("../models/Module");
const Roadmap = require("../models/Roadmap");

// CREATE task (mentor only)
exports.createTask = async (req, res) => {
  try {
    const { moduleId, dayNumber, title, description } = req.body;

    if (!moduleId || !dayNumber || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const roadmap = await Roadmap.findById(module.roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Mentor ownership check
    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.create({
      moduleId,
      dayNumber,
      title,
      description,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET tasks by module (week)
exports.getTasksByModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const roadmap = await Roadmap.findById(module.roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Mentor ownership check
    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({
      moduleId: req.params.moduleId,
    }).sort({ dayNumber: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE task (mentor only)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const module = await Module.findById(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const roadmap = await Roadmap.findById(module.roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Mentor ownership check
    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.dayNumber = req.body.dayNumber || task.dayNumber;
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE task (mentor only)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const module = await Module.findById(task.moduleId);
    const roadmap = await Roadmap.findById(module.roadmapId);

    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
