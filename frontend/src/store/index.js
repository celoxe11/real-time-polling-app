import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pollReducer from './slices/pollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    poll: pollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Firebase auth objects aren't serializable
    }),
});

export default store;
