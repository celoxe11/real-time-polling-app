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
  votePoll: async (id, optionIndex, voterToken, fingerprint) => {
    const response = await api.post(`/poll/${id}/vote`, {
      optionIndex,
      voterToken,
      fingerprint,
    });
    return response.data;
  },
  // Check if user has voted in a specific poll
  checkHasVoted: async (pollId, voterToken, fingerprint) => {
    const response = await api.post(`/user/has-voted/${pollId}`, {
      voterToken,
      fingerprint,
    });
    return response.data;
  },
  // Get all polls that user has voted in
  getVotedPolls: async (voterToken) => {
    const response = await api.post("/user/voted-polls", {
      voterToken,
    });
    return response.data;
  },
  getTrendingPolls: async () => {
    const response = await api.get("/poll/trending");
    return response.data;
  },
  getRecentPolls: async (voterToken) => {
    const response = await api.get(`/poll/recent?voterToken=${voterToken}`);
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
  getPollByRoomCode: async (roomCode) => {
    const response = await api.get(`/poll/room/${roomCode}`);
    return response.data;
  },
};
