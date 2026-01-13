const Roadmap = require("../models/Roadmap");

// CREATE roadmap (mentor only)
exports.createRoadmap = async (req, res) => {
  try {
    const { title, description } = req.body;

    const roadmap = await Roadmap.create({
      title,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all roadmaps
exports.getAllRoadmaps = async (req, res) => {
  try {
    let roadmaps;

    // Mentor → only own roadmaps
    if (req.user.role === "mentor") {
      roadmaps = await Roadmap.find({
        createdBy: req.user._id,
      }).populate("createdBy", "name email");
    }

    // Intern & Admin → all roadmaps
    else {
      roadmaps = await Roadmap.find().populate("createdBy", "name email");
    }

    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET roadmap by ID
exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    if (
      req.user.role === "mentor" &&
      roadmap.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to access this roadmap",
      });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE roadmap (mentor only)
exports.updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // optional: ensure same mentor

    if (
      req.user.role === "mentor" &&
      roadmap.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to access this roadmap",
      });
    }

    roadmap.title = req.body.title || roadmap.title;
    roadmap.description = req.body.description || roadmap.description;

    const updatedRoadmap = await roadmap.save();

    res.json(updatedRoadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE roadmap (mentor only)
exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    if (
      req.user.role === "mentor" &&
      roadmap.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to access this roadmap",
      });
    }

    await roadmap.deleteOne();

    res.json({ message: "Roadmap deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
