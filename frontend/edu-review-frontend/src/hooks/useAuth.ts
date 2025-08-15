import { useSelector, useDispatch } from "react-redux";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} from "@/lib/services";
import {
  setAuth,
  logout as logoutAction,
  setError,
  clearError,
  setUser,
  restoreAuth,
  forceRefetch,
} from "@/lib/slices/authSlice";
import type { RootState } from "@/lib/store";
import type { LoginRequest, RegisterRequest, User } from "@/types";
import { useEffect, useRef } from "react";
import { validateToken, clearAuthData } from "@/lib/utils/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const hasRestoredAuth = useRef(false);
  const hasFetchedUser = useRef(false);
  const lastProcessedUser = useRef<User | null>(null);

  // Get current user data - chỉ chạy khi có token
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // Chỉ chạy khi đã authenticated
    // Add polling to keep user data fresh
    pollingInterval: 5 * 60 * 1000, // 5 minutes
    // Refetch on window focus
    refetchOnFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  // Khôi phục authentication state từ localStorage khi cần thiết
  // CHỈ CHẠY KHI AuthProvider chưa restore auth state
  useEffect(() => {
    if (typeof window !== "undefined" && !hasRestoredAuth.current && !isAuthenticated) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Nếu có token nhưng chưa authenticated, restore auth state
      if (accessToken && refreshToken) {
        // Validate tokens using utility function
        const accessTokenValidation = validateToken(accessToken);
        const refreshTokenValidation = validateToken(refreshToken);
        
        if (!accessTokenValidation.isValid || !refreshTokenValidation.isValid) {
          clearAuthData();
          hasRestoredAuth.current = true;
          return;
        }
        
        if (accessTokenValidation.isExpired && refreshTokenValidation.isExpired) {
          clearAuthData();
          hasRestoredAuth.current = true;
          return;
        }
        
        dispatch(restoreAuth());
        hasRestoredAuth.current = true;
      } else {
        hasRestoredAuth.current = true;
      }
    }
  }, [isAuthenticated, dispatch]);

  // Cập nhật user data khi có currentUser - FIXED: Prevent infinite loop
  useEffect(() => {
    if (currentUser && !user && currentUser !== lastProcessedUser.current) {
      lastProcessedUser.current = currentUser;
      dispatch(setUser(currentUser as User));
      hasFetchedUser.current = true;
    }
  }, [currentUser, user, dispatch]);

  // Force fetch user data when authentication is restored
  useEffect(() => {
    if (isAuthenticated && !user && !currentUser && !isUserLoading && refetchUser && !hasFetchedUser.current) {
      refetchUser();
      hasFetchedUser.current = true;
    }
  }, [isAuthenticated, user, currentUser, isUserLoading, refetchUser]);

  // Handle 401 errors from user query
  useEffect(() => {
    if (userError && "status" in userError && userError.status === 401) {
      dispatch(logoutAction());
      hasRestoredAuth.current = false;
      hasFetchedUser.current = false;
      lastProcessedUser.current = null;
    }
  }, [userError, dispatch]);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      dispatch(clearError());
      const response = await login(credentials).unwrap();
      dispatch(setAuth(response));
      hasFetchedUser.current = false; // Reset flag for new session
      lastProcessedUser.current = null; // Reset last processed user
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Login failed";
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      dispatch(clearError());
      const response = await register(userData).unwrap();
      dispatch(setAuth(response));
      hasFetchedUser.current = false; // Reset flag for new session
      lastProcessedUser.current = null; // Reset last processed user
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Registration failed";
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const handleLogout = async (redirectTo?: string) => {
    try {
      // Call logout API first to invalidate tokens on backend
      await logout().unwrap();
    } catch (error) {
      console.error("🔐 useAuth: Logout API failed", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local auth state
      dispatch(logoutAction());
      hasRestoredAuth.current = false; // Reset for next session
      hasFetchedUser.current = false; // Reset for next session
      lastProcessedUser.current = null; // Reset last processed user
      
      // Return redirect path if specified
      if (redirectTo) {
        return redirectTo;
      }
    }
  };

  const isAdmin =
    user?.accountType === "admin" || user?.accountType === "super_admin";
  const isModerator = user?.accountType === "moderator" || isAdmin;
  const isUniversityRep = user?.accountType === "university_rep";
  const isStudent = user?.accountType === "student";

  const result = {
    // State
    user: currentUser || user,
    isAuthenticated: isAuthenticated,
    isLoading:
      isLoading ||
      isLoginLoading ||
      isRegisterLoading ||
      isLogoutLoading ||
      isUserLoading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: () => dispatch(clearError()),

    // User roles
    isAdmin,
    isModerator,
    isUniversityRep,
    isStudent,

    // User status
    isVerified: user?.isVerified || false,
    isActive: user?.status === "active",
  };

  return result;
};
