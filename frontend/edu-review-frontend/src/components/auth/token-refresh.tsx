"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { useRefreshTokenMutation } from "@/lib/services";
import { updateTokens, logout } from "@/lib/slices/authSlice";
import { shouldRefreshToken } from "@/lib/utils/auth";

export function TokenRefresh() {
  const dispatch = useDispatch();
  const { accessToken, refreshToken, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if token needs refresh
  useEffect(() => {
    if (!isAuthenticated || !accessToken || !refreshToken) {
      return;
    }

    const checkAndRefreshToken = async () => {
      try {
        // Check if access token needs refresh
        if (shouldRefreshToken(accessToken)) { // 5 minutes before expiry
          console.log("🔐 TokenRefresh: Access token needs refresh, attempting refresh...");
          
          const response = await refreshTokenMutation({
            refreshToken,
            deviceId: "web_app" // You might want to store this in localStorage
          }).unwrap();

          // Check if response has valid tokens
          if (response.accessToken && response.refreshToken) {
            console.log("🔐 TokenRefresh: Token refresh successful");
            dispatch(updateTokens({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            }));
          } else {
            console.error("🔐 TokenRefresh: Response missing tokens");
            dispatch(logout());
          }
        }
      } catch (error) {
        console.error("🔐 TokenRefresh: Token refresh failed", error);
        // If refresh fails, logout the user
        console.log("🔐 TokenRefresh: Logging out user due to refresh failure");
        dispatch(logout());
      }
    };

    // Check immediately
    checkAndRefreshToken();

    // Set up periodic check (every 5 minutes)
    const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAuthenticated, accessToken, refreshToken, dispatch, refreshTokenMutation]);

  // Set up refresh timer based on token expiration
  useEffect(() => {
    if (!accessToken || !isAuthenticated) {
      return;
    }

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - currentTime;
        const timeUntilRefresh = Math.max(timeUntilExpiry - 300, 0); // Refresh 5 minutes before expiry

        if (timeUntilRefresh > 0) {
          console.log(`🔐 TokenRefresh: Setting refresh timer for ${timeUntilRefresh} seconds`);
          refreshTimeoutRef.current = setTimeout(async () => {
            try {
              console.log("🔐 TokenRefresh: Timer triggered, refreshing token...");
              const response = await refreshTokenMutation({
                refreshToken: refreshToken!,
                deviceId: "web_app"
              }).unwrap();

              // Check if response has valid tokens
              if (response.accessToken && response.refreshToken) {
                console.log("🔐 TokenRefresh: Token refresh successful");
                dispatch(updateTokens({
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken
                }));
              } else {
                console.error("🔐 TokenRefresh: Response missing tokens");
                dispatch(logout());
              }
            } catch (error) {
              console.error("🔐 TokenRefresh: Token refresh failed", error);
              dispatch(logout());
            }
          }, timeUntilRefresh * 1000);
        }
      }
    } catch (error) {
      console.error("🔐 TokenRefresh: Error parsing token payload", error);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [accessToken, refreshToken, isAuthenticated, dispatch, refreshTokenMutation]);

  // This component doesn't render anything
  return null;
}
