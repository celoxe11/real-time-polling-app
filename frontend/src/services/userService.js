import api from "./api";

export const userService = {
  getUserStats: async (voterData) => {
    const response = await api.post("/user/stats", voterData);
    return response.data;
  },
  getProfileStats: async () => {
    const response = await api.get("/user/profile-stats");
    return response.data;
  },
  editProfile: async (profileData) => {
    const response = await api.post("/user/edit-profile", profileData);
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
