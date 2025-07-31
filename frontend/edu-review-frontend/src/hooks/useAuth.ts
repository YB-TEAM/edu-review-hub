import { useEffect, useState } from "react";
import { useLogoutMutation } from "@/lib/services/authApi";
import { useGetProfileQuery } from "@/lib/services/profileApi";

export function useAuth() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    skip: !hasToken,
  });

  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setHasToken(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      localStorage.removeItem("token");
      setHasToken(false);
    }
  };

  return {
    user,
    isLoading: isLoading || isLogoutLoading,
    error,
    isAuthenticated: !!user && hasToken,
    hasToken,
    logout: handleLogout,
    refetch,
  };
}
