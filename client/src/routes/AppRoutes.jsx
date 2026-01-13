import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MentorDashboard from "../pages/MentorDashboard";
import InternDashboard from "../pages/InternDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/Register";
import RoadmapTracker from "../pages/RoadmapTracker";
import MentorRoadmapBuilder from "../pages/MentorRoadmapBuilder";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLogin from "../pages/AdminLogin";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Mentor Protected Route */}
        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/roadmap/:id"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorRoadmapBuilder />
            </ProtectedRoute>
          }
        />

        {/* Intern Protected Route */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <InternDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap/:id"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <RoadmapTracker />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
