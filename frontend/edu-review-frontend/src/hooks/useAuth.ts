import { useSelector, useDispatch } from "react-redux";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} from "@/lib/services/authApi";
import {
  setAuth,
  logout as logoutAction,
  setError,
  clearError,
} from "@/lib/slices/authSlice";
import type { RootState } from "@/lib/store";
import type { LoginRequest, RegisterRequest, User } from "@/types";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Debug logs - chỉ chạy trên client side
  if (typeof window !== "undefined") {
    console.log("useAuth - Redux state:", { user, isAuthenticated, isLoading, error });
    console.log("useAuth - localStorage accessToken:", localStorage.getItem("accessToken"));
  }

  // Khôi phục authentication state từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (accessToken && refreshToken && !isAuthenticated) {
        console.log("Restoring auth state from localStorage");
        // Có thể dispatch action để khôi phục state
        // dispatch(restoreAuth({ accessToken, refreshToken }));
      }
    }
  }, [isAuthenticated, dispatch]);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // Get current user data
  const { data: currentUser, isLoading: isUserLoading, error: userError } =
    useGetCurrentUserQuery(undefined, {
      skip: !isAuthenticated,
    });

  // Handle 401 errors from user query
  useEffect(() => {
    if (userError && 'status' in userError && userError.status === 401) {
      console.log("User query returned 401, attempting refresh...");
      // Try to refresh token or clear auth state
      dispatch(logoutAction());
    }
  }, [userError, dispatch]);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      dispatch(clearError());
      const response = await login(credentials).unwrap();
      dispatch(setAuth(response));
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
      return response;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Registration failed";
      dispatch(setError(errorMessage));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutAction());
    }
  };

  const isAdmin =
    user?.accountType === "admin" || user?.accountType === "super_admin";
  const isModerator = user?.accountType === "moderator" || isAdmin;
  const isUniversityRep = user?.accountType === "university_rep";
  const isStudent = user?.accountType === "student";

  return {
    // State
    user: currentUser || user,
    isAuthenticated,
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
};
