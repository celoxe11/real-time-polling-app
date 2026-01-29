import api from "./api";

export const adminService = {
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getPolls: async () => {
    const response = await api.get("/admin/polls");
    return response.data;
  },

  deletePoll: async (id) => {
    const response = await api.delete(`/admin/polls/${id}`);
    return response.data;
  },

  cleanUpUsers: async () => {
    const response = await api.delete("/admin/clean-up-unverified-users");
    return response.data;
  },
};
