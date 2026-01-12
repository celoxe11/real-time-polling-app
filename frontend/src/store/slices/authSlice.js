import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { authService } from "../../services/authService";

// Async Thunks
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // simpan user ke mongodb lewat backend dan dapatkan role
      const backendUser = await authService.verifyUser();
      console.log(backendUser);

      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: backendUser.user.role, // Get role from backend
      };
    } catch (error) {
      console.error("Login error:", error);
      // Handle popup closed by user - don't show error
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return rejectWithValue(null);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Simpan user ke MongoDB backend dan dapatkan role
      const backendUser = await authService.verifyUser();

      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: backendUser.user.role,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Simpan user ke MongoDB backend dan dapatkan role
      const backendUser = await authService.verifyUser();

      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName || result.user.displayName,
        photoURL: result.user.photoURL,
        role: backendUser.user.role,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        // Only set error if it's not null (popup was closed)
        state.error = action.payload || null;
      });

    // Login with Email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register with Email
    builder
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
