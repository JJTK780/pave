const Module = require("../models/Module");
const Roadmap = require("../models/Roadmap");

// CREATE Week (Mentor only)
exports.createModule = async (req, res) => {
  try {
    const { roadmapId, title, order } = req.body;

    if (!roadmapId || !title || !order) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const roadmap = await Roadmap.findById(roadmapId);
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

    const module = await Module.create({
      roadmapId,
      title,
      order,
    });

    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all weeks for a roadmap
exports.getModulesByRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Mentor can only see own roadmap modules
    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const modules = await Module.find({
      roadmapId: req.params.roadmapId,
    }).sort({ order: 1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE week (Mentor only)
exports.updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const roadmap = await Roadmap.findById(module.roadmapId);

    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    module.title = req.body.title || module.title;
    module.order = req.body.order || module.order;

    const updatedModule = await module.save();
    res.json(updatedModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE week (Mentor only)
exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const roadmap = await Roadmap.findById(module.roadmapId);

    if (
      req.user.role === "mentor" &&
      roadmap.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await module.deleteOne();
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
