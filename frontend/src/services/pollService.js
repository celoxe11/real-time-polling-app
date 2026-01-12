import api from "./api";

export const pollService = {
  getPolls: async () => {
    const response = await api.get("/poll");
    return response.data;
  },
  getMyPolls: async () => {
    const response = await api.get("/poll/my-polls");
    return response.data;
  },
  createPoll: async (poll) => {
    const response = await api.post("/poll", poll);
    return response.data;
  },
  updatePoll: async (id, poll) => {
    const response = await api.put(`/poll/${id}`, poll);
    return response.data;
  },
  deletePoll: async (id) => {
    const response = await api.delete(`/poll/${id}`);
    return response.data;
  },
  getPollById: async (id) => {
    const response = await api.get(`/poll/${id}`);
    return response.data;
  },
  votePoll: async (id, option) => {
    const response = await api.post(`/poll/${id}/vote`, { option });
    return response.data;
  },
  getTrendingPolls: async () => {
    const response = await api.get("/poll/trending");
    return response.data;
  },
  getRecentPolls: async () => {
    const response = await api.get("/poll/recent");
    return response.data;
  },
  getPopularPolls: async () => {
    const response = await api.get("/poll/popular");
    return response.data;
  },
  searchPolls: async (query) => {
    const response = await api.get(`/poll/search?query=${query}`);
    return response.data;
  },
};
