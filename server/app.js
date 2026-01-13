const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const taskRoutes = require("./routes/taskRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Internship Tracker API running");
});

module.exports = app;
