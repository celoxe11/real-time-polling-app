import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pollReducer from "./slices/pollSlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poll: pollReducer,
    user: userReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Firebase auth objects aren't serializable
    }),
});

export default store;
