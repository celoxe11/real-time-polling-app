import api from './api';

export const authService = {
  // Verify user dan simpan ke backend
  verifyUser: async () => {
    const response = await api.post('/auth/verify');
    return response.data;
  },

  // Get current user dari backend
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Delete user account
  deleteAccount: async () => {
    const response = await api.delete('/auth/delete');
    return response.data;
  },
};