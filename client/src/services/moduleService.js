import api from "./api";

export const getModulesByRoadmap = async (roadmapId) => {
  const response = await api.get(`/modules/roadmap/${roadmapId}`);
  return response.data;
};
