import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthResponse } from "@/types";
import { validateToken, clearAuthData } from "../utils/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper function to safely get localStorage values
const getLocalStorageValue = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: null,
  accessToken: getLocalStorageValue("accessToken"),
  refreshToken: getLocalStorageValue("refreshToken"),
  isAuthenticated: false, // Start as false, will be set by restoreAuth
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set authentication data
    setAuth: (state: AuthState, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      if (typeof window !== "undefined") {
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
      console.log("🔐 AuthSlice: setAuth called", { 
        hasUser: !!action.payload.user, 
        hasTokens: !!(action.payload.accessToken && action.payload.refreshToken) 
      });
    },

    // Set user data
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      console.log("🔐 AuthSlice: User data set", { userId: action.payload.id, username: action.payload.username });
    },

    // Update user profile
    updateUser: (state: AuthState, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Set loading state
    setLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state: AuthState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state: AuthState) => {
      state.error = null;
    },

    // Logout
    logout: (state: AuthState) => {
      console.log("🔐 AuthSlice: Starting logout process");
      
      // Clear Redux state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;

      // Clear all auth data using utility function
      clearAuthData();
      console.log("🔐 AuthSlice: User logged out, all data cleared");
    },

    // Update tokens
    updateTokens: (
      state: AuthState,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },

    // Restore auth from localStorage - this should be called first
    restoreAuth: (state: AuthState) => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (accessToken && refreshToken) {
          // Validate tokens using utility function
          const accessTokenValidation = validateToken(accessToken);
          const refreshTokenValidation = validateToken(refreshToken);
          
          console.log("🔐 AuthSlice: Token validation results", {
            accessToken: {
              isValid: accessTokenValidation.isValid,
              isExpired: accessTokenValidation.isExpired,
              hasValidSignature: accessTokenValidation.hasValidSignature,
              error: accessTokenValidation.error
            },
            refreshToken: {
              isValid: refreshTokenValidation.isValid,
              isExpired: refreshTokenValidation.isExpired,
              hasValidSignature: refreshTokenValidation.hasValidSignature,
              error: refreshTokenValidation.error
            }
          });
          
          if (!accessTokenValidation.isValid || !refreshTokenValidation.isValid) {
            console.log("🔐 AuthSlice: Invalid tokens, clearing localStorage");
            clearAuthData();
            return;
          }
          
          if (accessTokenValidation.isExpired && refreshTokenValidation.isExpired) {
            console.log("🔐 AuthSlice: All tokens expired, clearing localStorage");
            clearAuthData();
            return;
          }
          
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
          console.log("🔐 AuthSlice: Auth state restored from localStorage", { 
            hasAccessToken: !!accessToken, 
            hasRefreshToken: !!refreshToken,
            accessTokenExpired: accessTokenValidation.isExpired,
            refreshTokenExpired: refreshTokenValidation.isExpired,
            note: "Token signature validation will be done by backend API calls"
          });
          // Note: user data will be fetched by useGetCurrentUserQuery
        } else {
          console.log("🔐 AuthSlice: No tokens found in localStorage");
        }
      }
    },

    // Force refetch user data
    forceRefetch: (state: AuthState) => {
      // This action will trigger a re-render and potentially re-run useGetCurrentUserQuery
      console.log("🔐 AuthSlice: Force refetch triggered");
    },
  },
});

export const {
  setAuth,
  setUser,
  updateUser,
  setLoading,
  setError,
  clearError,
  logout,
  updateTokens,
  restoreAuth,
  forceRefetch,
} = authSlice.actions;

export default authSlice.reducer;
