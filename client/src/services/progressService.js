import api from "./api";

export const startRoadmap = async (roadmapId) => {
  const res = await api.post("/progress/start", { roadmapId });
  return res.data;
};

export const createProgress = async (data) => {
  const response = await api.post("/progress", data);
  return response.data;
};

export const getMyProgress = async () => {
  const response = await api.get("/progress/me");
  return response.data;
};

export const markTaskCompleted = async (taskId) => {
  const response = await api.post("/progress/complete", { taskId });
  return response.data;
};
