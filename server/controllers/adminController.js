const User = require("../models/User");

// GET all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Promote intern → mentor
exports.promoteToMentor = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(400).json({
      message: "Admin role cannot be changed",
    });
  }

  user.role = "mentor";
  await user.save();

  res.json({
    message: "User promoted to mentor",
    user,
  });
};
