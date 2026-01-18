import api from "./api";

export const userService = {
  getUserStats: async () => {
    const response = await api.get("/user/stats");
    return response.data;
  },
  hasUserVotedPoll: async (userId, pollId) => {
    const response = await api.get(`/user/has-voted/${pollId}`);
    return response.data;
  },
  getUserVotedPolls: async (voterToken) => {
    const response = await api.post("/user/voted-polls", {
      voterToken,
    });
    return response.data;
  },
};
