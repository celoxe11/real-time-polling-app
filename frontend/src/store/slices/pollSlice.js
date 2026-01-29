import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pollService } from "../../services/pollService";

// async thunks
export const getPolls = createAsyncThunk(
  "poll/getPolls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await pollService.getPolls();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getMyPolls = createAsyncThunk(
  "poll/getMyPolls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await pollService.getMyPolls();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getPollById = createAsyncThunk(
  "poll/getPollById",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await pollService.getPollById(pollId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createPoll = createAsyncThunk(
  "poll/createPoll",
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await pollService.createPoll(pollData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updatePoll = createAsyncThunk(
  "poll/updatePoll",
  async ({ id, pollData }, { rejectWithValue }) => {
    try {
      const response = await pollService.updatePoll(id, pollData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deletePoll = createAsyncThunk(
  "poll/deletePoll",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await pollService.deletePoll(pollId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getTrendingPolls = createAsyncThunk(
  "poll/getTrendingPolls",
  async () => {
    const response = await pollService.getTrendingPolls();
    return response; // pollService already returns response.data
  },
);

export const getRecentPolls = createAsyncThunk(
  "poll/getRecentPolls",
  async (voterToken) => {
    const response = await pollService.getRecentPolls(voterToken);
    return response; // pollService already returns response.data
  },
);

export const getPopularPolls = createAsyncThunk(
  "poll/getPopularPolls",
  async () => {
    const response = await pollService.getPopularPolls();
    return response; // pollService already returns response.data
  },
);

export const searchPolls = createAsyncThunk(
  "poll/searchPolls",
  async (searchQuery) => {
    const response = await pollService.searchPolls(searchQuery);
    return response; // pollService already returns response.data
  },
);

export const votePoll = createAsyncThunk(
  "poll/votePoll",
  async ({ id, optionIndex, voterToken, fingerprint }) => {
    const response = await pollService.votePoll(
      id,
      optionIndex,
      voterToken,
      fingerprint,
    );
    return response; // pollService already returns response.data
  },
);

export const getPollByRoomCode = createAsyncThunk(
  "poll/getPollByRoomCode",
  async (roomCode) => {
    const response = await pollService.getPollByRoomCode(roomCode);
    return response;
  },
);

const initialState = {
  trending: [], // utk trending poll
  recent: [], // utk recent poll
  popular: [], // utk popular poll
  polls: [], // utnuk hasil search
  myPolls: [], // utk halaman my-polls
  activePolls: [],
  closedPolls: [],
  poll: null, // utk halaman detail poll
  loading: false,
  error: null,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    updatePollLocal: (state, action) => {
      const { pollId, options, totalVotes } = action.payload;
      if (
        state.poll &&
        (state.poll.id === pollId || state.poll._id === pollId)
      ) {
        state.poll.options = options;
        state.poll.totalVotes = totalVotes;
      }
    },
  },
  extraReducers: (builder) => {
    // vote poll
    builder
      .addCase(votePoll.pending, (state) => {
        state.loading = false; // don't set global loading for vote
      })
      .addCase(votePoll.fulfilled, (state, action) => {
        state.poll = action.payload;
        // update in list if present
        state.polls = state.polls.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        );
      })
      .addCase(votePoll.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      // get polls
      .addCase(getPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(getPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // get my polls
    builder
      .addCase(getMyPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.myPolls = action.payload.myPolls;
        state.activePolls = action.payload.activePolls;
        state.closedPolls = action.payload.closedPolls;
      })
      .addCase(getMyPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // get poll by id
    builder
      .addCase(getPollById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPollById.fulfilled, (state, action) => {
        state.loading = false;
        state.poll = action.payload;
      })
      .addCase(getPollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // create poll
    builder
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.myPolls.push(action.payload);
        state.activePolls.push(action.payload);
        state.closedPolls.push(action.payload);
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // update poll
    builder
      .addCase(updatePoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.myPolls = state.myPolls.map((poll) =>
          poll.id === action.payload.id ? action.payload : poll,
        );
        state.activePolls = state.activePolls.map((poll) =>
          poll.id === action.payload.id ? action.payload : poll,
        );
        state.closedPolls = state.closedPolls.map((poll) =>
          poll.id === action.payload.id ? action.payload : poll,
        );
      })
      .addCase(updatePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    // delete poll
    builder
      .addCase(deletePoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.myPolls = state.myPolls.filter(
          (poll) => poll.id !== action.payload.id,
        );
        state.activePolls = state.activePolls.filter(
          (poll) => poll.id !== action.payload.id,
        );
        state.closedPolls = state.closedPolls.filter(
          (poll) => poll.id !== action.payload.id,
        );
      })
      .addCase(deletePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    builder
      .addCase(getTrendingPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTrendingPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(getTrendingPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    builder
      .addCase(getRecentPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecentPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(getRecentPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    builder
      .addCase(getPopularPolls.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.popular = action.payload;
      })
      .addCase(getPopularPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    builder
      .addCase(getPollByRoomCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPollByRoomCode.fulfilled, (state, action) => {
        state.loading = false;
        state.poll = action.payload;
      })
      .addCase(getPollByRoomCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { updatePollLocal } = pollSlice.actions;

export default pollSlice.reducer;
