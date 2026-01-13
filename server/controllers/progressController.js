const Progress = require("../models/Progress");
const Module = require("../models/Module");
const Task = require("../models/Task");

// MARK task as completed (intern)
exports.markTaskCompleted = async (req, res) => {
  try {
    const { taskId } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, taskId },
      { status: "completed" },
      { new: true, upsert: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET progress for logged-in intern
exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      userId: req.user._id,
    }).populate("taskId");

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// INIT progress when roadmap is started (intern)
exports.createProgress = async (req, res) => {
  try {
    const { taskId } = req.body;

    // Prevent duplicate progress
    const existing = await Progress.findOne({
      userId: req.user._id,
      taskId,
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const progress = await Progress.create({
      userId: req.user._id,
      taskId,
      status: "pending",
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// START roadmap (create progress for all tasks)
exports.startRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.body;

    const modules = await Module.find({ roadmapId });
    const moduleIds = modules.map((m) => m._id);

    const tasks = await Task.find({ moduleId: { $in: moduleIds } });

    const bulkOps = tasks.map((task) => ({
      updateOne: {
        filter: { userId: req.user._id, taskId: task._id },
        update: { status: "pending" },
        upsert: true,
      },
    }));

    await Progress.bulkWrite(bulkOps);

    res.json({ message: "Roadmap started", totalTasks: tasks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
