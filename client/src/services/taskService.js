import api from "./api";

export const getTasksByModule = async (moduleId) => {
  const response = await api.get(`/tasks/module/${moduleId}`);
  return response.data;
};
