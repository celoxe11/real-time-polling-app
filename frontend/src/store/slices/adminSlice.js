import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../services/adminService";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchPolls = createAsyncThunk(
  "admin/fetchPolls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getPolls();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removePoll = createAsyncThunk(
  "admin/removePoll",
  async (pollId, { rejectWithValue }) => {
    try {
      await adminService.deletePoll(pollId);
      return pollId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removeUser = createAsyncThunk(
  "admin/removeUser",
  async (userId, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const cleanUpUsers = createAsyncThunk(
  "admin/cleanUpUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.cleanUpUnverifiedUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  users: [],
  polls: [],
  loading: false,
  error: null,
  success: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.success = "User removed successfully";
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(removePoll.fulfilled, (state, action) => {
        state.polls = state.polls.filter((p) => p._id !== action.payload);
        state.success = "Poll removed successfully";
      })
      .addCase(removePoll.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(cleanUpUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(cleanUpUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(cleanUpUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminStatus } = adminSlice.actions;
export default adminSlice.reducer;
