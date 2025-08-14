/**
 * Authentication utility functions
 */

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  hasValidSignature: boolean;
  payload?: any;
  error?: string;
}

/**
 * Validate JWT token format and expiration
 * Note: This only validates format and expiration, not cryptographic signature
 */
export function validateToken(token: string | null): TokenValidationResult {
  if (!token) {
    return {
      isValid: false,
      isExpired: false,
      hasValidSignature: false,
      error: "No token provided"
    };
  }

  try {
    // Check if token has correct format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        isValid: false,
        isExpired: false,
        hasValidSignature: false,
        error: "Invalid token format"
      };
    }

    // Decode payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration
    if (!payload.exp) {
      return {
        isValid: false,
        isExpired: false,
        hasValidSignature: false,
        error: "Token has no expiration"
      };
    }

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;

    return {
      isValid: true,
      isExpired,
      hasValidSignature: false, // We can't verify signature on frontend
      payload
    };
  } catch (error) {
    return {
      isValid: false,
      isExpired: false,
      hasValidSignature: false,
      error: `Token validation failed: ${error}`
    };
  }
}

/**
 * Check if user should be logged out due to token issues
 */
export function shouldLogoutUser(): boolean {
  if (typeof window === "undefined") return false;

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // If no tokens, user should be logged out
  if (!accessToken || !refreshToken) {
    return true;
  }

  // Validate access token
  const accessTokenValidation = validateToken(accessToken);
  if (!accessTokenValidation.isValid) {
    return true;
  }

  // If access token is expired, check refresh token
  if (accessTokenValidation.isExpired) {
    const refreshTokenValidation = validateToken(refreshToken);
    if (!refreshTokenValidation.isValid || refreshTokenValidation.isExpired) {
      return true;
    }
  }

  return false;
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  // Clear any other auth-related data
  sessionStorage.clear();
  
  // Clear cookies if any
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string | null): number | null {
  if (!token) return null;

  const validation = validateToken(token);
  if (!validation.isValid || !validation.payload?.exp) {
    return null;
  }

  return validation.payload.exp * 1000; // Convert to milliseconds
}

/**
 * Check if token will expire soon (within specified time)
 */
export function isTokenExpiringSoon(token: string | null, withinMinutes: number = 5): boolean {
  if (!token) return false;

  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return false;

  const currentTime = Date.now();
  const withinMs = withinMinutes * 60 * 1000;

  return (expirationTime - currentTime) <= withinMs;
}

/**
 * Check if token needs refresh (expired or expiring soon)
 */
export function shouldRefreshToken(token: string | null, withinMinutes: number = 5): boolean {
  if (!token) return false;

  const validation = validateToken(token);
  if (!validation.isValid) return false;

  // If token is expired, definitely need refresh
  if (validation.isExpired) return true;

  // If token is expiring soon, consider refreshing
  return isTokenExpiringSoon(token, withinMinutes);
}
