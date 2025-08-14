"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, setUser } from "@/lib/slices/authSlice";
import { RootState } from "@/lib/store";
import { useGetCurrentUserQuery } from "@/lib/services";
import { AuthLoading } from "./auth-loading";
import { validateToken } from "@/lib/utils/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const hasRestoredAuth = useRef(false);
  const hasAttemptedUserFetch = useRef(false);
  const userFetchRetryCount = useRef(0);
  const maxRetries = 3;

  // Get current user data - CRITICAL: This should run when we have tokens
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // Only run when authenticated
    // Add polling to keep user data fresh
    pollingInterval: 5 * 60 * 1000, // 5 minutes
    // Refetch on window focus
    refetchOnFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  // Initialize authentication state from localStorage on app startup
  useEffect(() => {
    if (typeof window !== "undefined" && !hasRestoredAuth.current) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (accessToken && refreshToken) {
        console.log("🔐 AuthProvider: Found tokens, validating and restoring auth state");
        
        // Validate tokens before restoring
        const accessTokenValidation = validateToken(accessToken);
        const refreshTokenValidation = validateToken(refreshToken);
        
        console.log("🔐 AuthProvider: Token validation results", {
          accessToken: {
            isValid: accessTokenValidation.isValid,
            isExpired: accessTokenValidation.isExpired,
            hasValidSignature: accessTokenValidation.hasValidSignature
          },
          refreshToken: {
            isValid: refreshTokenValidation.isValid,
            isExpired: refreshTokenValidation.isExpired,
            hasValidSignature: refreshTokenValidation.hasValidSignature
          }
        });
        
        // Only restore if tokens are valid format and not expired
        if (accessTokenValidation.isValid && refreshTokenValidation.isValid && 
            !accessTokenValidation.isExpired && !refreshTokenValidation.isExpired) {
          console.log("🔐 AuthProvider: Tokens valid, restoring auth state");
          dispatch(restoreAuth());
          hasRestoredAuth.current = true;
        } else {
          console.log("🔐 AuthProvider: Tokens invalid or expired, clearing localStorage");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          hasRestoredAuth.current = true;
          setIsInitialized(true);
        }
      } else {
        console.log("🔐 AuthProvider: No tokens found");
        // No tokens = no auth needed, mark as initialized
        setIsInitialized(true);
      }
    }
  }, [dispatch]);

  // CRITICAL FIX: Handle user data fetching and initialization
  useEffect(() => {
    if (isAuthenticated && !user && !hasAttemptedUserFetch.current) {
      console.log("🔐 AuthProvider: Authenticated but no user, attempting to fetch user data");
      hasAttemptedUserFetch.current = true;
      
      // Force fetch user data
      if (refetchUser) {
        refetchUser();
      }
    }
  }, [isAuthenticated, user, refetchUser]);

  // CRITICAL FIX: Update user state when currentUser is fetched
  useEffect(() => {
    if (currentUser && !user) {
      console.log("🔐 AuthProvider: User data fetched, setting user state", {
        currentUser: {
          id: currentUser.id,
          username: currentUser.username,
          accountType: currentUser.accountType
        },
        existingUser: user
      });
      dispatch(setUser(currentUser));
      userFetchRetryCount.current = 0; // Reset retry count on success
    }
  }, [currentUser, user, dispatch]);

  // CRITICAL FIX: Handle user fetch errors and retries
  useEffect(() => {
    if (userError && !isUserLoading && userFetchRetryCount.current < maxRetries) {
      console.log(`🔐 AuthProvider: User fetch error (attempt ${userFetchRetryCount.current + 1}/${maxRetries})`, userError);
      
      if (userFetchRetryCount.current < maxRetries - 1) {
        // Retry after a delay
        setTimeout(() => {
          console.log("🔐 AuthProvider: Retrying user fetch...");
          if (refetchUser) {
            refetchUser();
            userFetchRetryCount.current++;
          }
        }, 2000 * (userFetchRetryCount.current + 1)); // Exponential backoff
      } else {
        // Max retries reached, mark as initialized to prevent infinite loading
        console.log("🔐 AuthProvider: Max retries reached, marking as initialized");
        setIsInitialized(true);
      }
    }
  }, [userError, isUserLoading, refetchUser]);

  // CRITICAL FIX: Mark as initialized when we have user data OR when auth is not needed
  useEffect(() => {
    if (isAuthenticated && user) {
      // ✅ User is authenticated AND we have user data
      console.log("🔐 AuthProvider: User data loaded, marking as initialized", {
        userId: user.id,
        username: user.username,
        accountType: user.accountType
      });
      setIsInitialized(true);
    } else if (!isAuthenticated && !localStorage.getItem("accessToken")) {
      // ✅ No authentication needed
      console.log("🔐 AuthProvider: No auth needed, marking as initialized");
      setIsInitialized(true);
    } else if (isAuthenticated && !user && !isUserLoading && userFetchRetryCount.current >= maxRetries) {
      // ✅ User is authenticated but user fetch failed after max retries
      console.log("🔐 AuthProvider: User fetch failed after max retries, marking as initialized to prevent infinite loading");
      setIsInitialized(true);
    }
  }, [isAuthenticated, user, isUserLoading]);

  // Add debug logging for state changes
  useEffect(() => {
    console.log("🔐 AuthProvider: State changed", {
      isAuthenticated,
      hasUser: !!user,
      userDetails: user ? {
        id: user.id,
        username: user.username,
        accountType: user.accountType
      } : null,
      hasCurrentUser: !!currentUser,
      currentUserDetails: currentUser ? {
        id: currentUser.id,
        username: currentUser.username,
        accountType: currentUser.accountType
      } : null,
      hasTokens: !!(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")),
      isInitialized,
      isUserLoading,
      hasUserError: !!userError,
      userFetchRetryCount: userFetchRetryCount.current
    });
  }, [isAuthenticated, user, currentUser, isInitialized, isUserLoading, userError]);

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return (
      <>
        {children}
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  // If authenticated but no user data and still loading, show loading with timeout
  if (isAuthenticated && !user && isUserLoading) {
    return (
      <AuthLoading 
        message="Loading user data..."
        timeout={20000}
        onTimeout={() => {
          console.log("🔐 AuthProvider: User data loading timeout, forcing initialization");
          setIsInitialized(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
