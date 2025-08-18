import { configureStore } from "@reduxjs/toolkit";
import {
  authApi,
  profileApi,
  reviewApi,
  blogApi,
  institutionApi,
  uploadApi,
} from "./services";

// Auth slice for managing authentication state
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    // Auth state
    auth: authReducer,

    // API slices
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [institutionApi.reducerPath]: institutionApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      profileApi.middleware,
      reviewApi.middleware,
      blogApi.middleware,
      institutionApi.middleware,
      uploadApi.middleware
    ),

  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
