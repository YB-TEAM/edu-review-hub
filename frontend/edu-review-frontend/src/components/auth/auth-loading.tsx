"use client";

import { useEffect, useState } from "react";

interface AuthLoadingProps {
  message?: string;
  timeout?: number;
  onTimeout?: () => void;
}

export function AuthLoading({ 
  message = "Loading user data...", 
  timeout = 10000,
  onTimeout 
}: AuthLoadingProps) {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimeoutMessage(true);
      if (onTimeout) {
        onTimeout();
      }
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [timeout, onTimeout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">{message}</p>
        
        {showTimeoutMessage && (
          <div className="text-center space-y-2">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Loading is taking longer than expected...
            </p>
            <p className="text-xs text-muted-foreground">
              This might be due to network issues or server response time.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:text-blue-700 underline"
            >
              Reload page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
