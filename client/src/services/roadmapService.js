import api from "./api";

// Get roadmaps (mentor: own, intern: all)
export const getRoadmaps = async () => {
  const response = await api.get("/roadmaps");
  return response.data;
};

// Create new roadmap (mentor)
export const createRoadmap = async (roadmapData) => {
  const response = await api.post("/roadmaps", roadmapData);
  return response.data;
};
