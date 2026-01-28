import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";

export const getUserStats = createAsyncThunk(
  "user/getUserStats",
  async (voterData) => {
    const response = await userService.getUserStats(voterData);
    return response;
  },
);

export const getProfileStats = createAsyncThunk(
  "user/getProfileStats",
  async () => {
    const response = await userService.getProfileStats();
    return response; // userService already returns response.data
  },
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (profileData) => {
    const response = await userService.editProfile(profileData);
    return response; // userService already returns response.data
  },
);

export const hasUserVotedPoll = createAsyncThunk(
  "user/hasUserVotedPoll",
  async ({ userId, pollId }) => {
    const response = await userService.hasUserVotedPoll(userId, pollId);
    return response; // userService already returns response.data
  },
);

export const getUserVotedPolls = createAsyncThunk(
  "user/getUserVotedPolls",
  async (voterToken) => {
    const response = await userService.getUserVotedPolls(voterToken);
    return response; // userService already returns response.data
  },
);

const initialState = {
  totalVotedPolls: 0,
  weeklyVotedPolls: 0,
  votingStreak: 0,
  totalCreatedPolls: 0,
  totalVotesReceived: 0,
  activePolls: 0,
  votedPolls: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.totalVotedPolls = action.payload.totalVotedPolls;
        state.weeklyVotedPolls = action.payload.weeklyVotedPolls;
        state.votingStreak = action.payload.votingStreak;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getProfileStats.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProfileStats.fulfilled, (state, action) => {
        state.totalCreatedPolls = action.payload.totalCreatedPolls;
        state.totalVotesReceived = action.payload.totalVotesReceived;
        state.activePolls = action.payload.activePolls;
      })
      .addCase(getProfileStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(editProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(getUserVotedPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserVotedPolls.fulfilled, (state, action) => {
        state.votedPolls = action.payload.votedPolls;
      })
      .addCase(getUserVotedPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
