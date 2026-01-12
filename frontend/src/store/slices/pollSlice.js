import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pollService } from "../../services/pollService";

// async thunks
export const getPolls = createAsyncThunk("poll/getPolls", async () => {
  const response = await pollService.getPolls();
  return response; // pollService already returns response.data
});

export const getMyPolls = createAsyncThunk("poll/getMyPolls", async () => {
  const response = await pollService.getMyPolls();
  console.log(response);

  return response; // pollService already returns response.data
});

export const getPollById = createAsyncThunk(
  "poll/getPollById",
  async (pollId) => {
    const response = await pollService.getPollById(pollId);
    return response; // pollService already returns response.data
  }
);

export const createPoll = createAsyncThunk(
  "poll/createPoll",
  async (pollData) => {
    const response = await pollService.createPoll(pollData);
    return response; // pollService already returns response.data
  }
);

export const updatePoll = createAsyncThunk(
  "poll/updatePoll",
  async (id, pollData) => {
    const response = await pollService.updatePoll(id, pollData);
    return response; // pollService already returns response.data
  }
);

export const deletePoll = createAsyncThunk(
  "poll/deletePoll",
  async (pollId) => {
    const response = await pollService.deletePoll(pollId);
    return response; // pollService already returns response.data
  }
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
  reducers: {},
  extraReducers: (builder) => {
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
        console.log(action.payload);

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
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // update poll
    builder
      .addCase(updatePoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.myPolls = state.myPolls.map((poll) =>
          poll._id === action.payload._id ? action.payload : poll
        );
      })
      .addCase(updatePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // delete poll
    builder
      .addCase(deletePoll.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.myPolls = state.myPolls.filter(
          (poll) => poll._id !== action.payload._id
        );
      })
      .addCase(deletePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {} = pollSlice.actions;

export default pollSlice.reducer;
