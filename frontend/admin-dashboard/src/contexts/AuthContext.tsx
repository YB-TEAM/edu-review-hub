"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setCredentials, logout, setUser, updateToken } from '@/lib/slices/authSlice';
import { useLoginMutation, useRefreshTokenMutation, useLogoutMutation } from '@/lib/services/authApi';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { accessToken: string; refreshToken: string; user: any }) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const [loginMutation] = useLoginMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const [logoutMutation] = useLogoutMutation();

  // Kiểm tra authentication status khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken && refreshToken && user) {
        // Kiểm tra token có hợp lệ không
        try {
          // Có thể thêm API call để verify token ở đây
          dispatch(setUser(user));
        } catch (error) {
          console.error('Token verification failed:', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch, accessToken, refreshToken, user]);

  // Xử lý logout và redirect
  const handleLogout = () => {
    dispatch(logout());
    // Clear cookies if they exist
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    // Redirect to login page
    router.push('/');
  };

  const login = (credentials: { accessToken: string; refreshToken: string; user: any }) => {
    dispatch(setCredentials(credentials));
    
    // Set cookies for middleware
    if (typeof document !== 'undefined') {
      document.cookie = `accessToken=${credentials.accessToken}; path=/; max-age=3600; SameSite=Strict`;
      document.cookie = `refreshToken=${credentials.refreshToken}; path=/; max-age=86400; SameSite=Strict`;
    }
  };

  const logoutUser = async () => {
    try {
      if (refreshToken) {
        await logoutMutation().unwrap();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      handleLogout();
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    
    // Kiểm tra permission dựa trên role
    const rolePermissions: Record<string, string[]> = {
      super_admin: ['*'], // Tất cả permissions
      admin: ['users.read', 'users.write', 'blogs.read', 'blogs.write', 'universities.read', 'universities.write', 'system.read'],
      moderator: ['blogs.read', 'blogs.write', 'universities.read', 'users.read'],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const refreshUser = async () => {
    if (refreshToken) {
      try {
        const result = await refreshTokenMutation({ refreshToken }).unwrap();
        dispatch(updateToken({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }));
        
        // Update cookies
        if (typeof document !== 'undefined') {
          document.cookie = `accessToken=${result.accessToken}; path=/; max-age=3600; SameSite=Strict`;
          document.cookie = `refreshToken=${result.refreshToken}; path=/; max-age=86400; SameSite=Strict`;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        handleLogout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: logoutUser,
    hasPermission,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
