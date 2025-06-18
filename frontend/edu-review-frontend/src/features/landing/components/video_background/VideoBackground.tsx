"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./video_background.scss";

interface VideoBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function VideoBackground({ className, children }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReversing, setIsReversing] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let forwardTimer: NodeJS.Timeout;
    let reverseInterval: NodeJS.Timeout;

    const handleLoadedData = () => {
      setIsLoaded(true);
      startForwardCycle();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    const startForwardCycle = () => {
      setIsReversing(false);
      video.currentTime = 0;
      video.play().catch(() => {
        console.log("Video autoplay failed");
      });

      // After 5 seconds, start reverse
      forwardTimer = setTimeout(() => {
        startReverseCycle();
      }, 5000);
    };

    const startReverseCycle = () => {
      setIsReversing(true);
      video.pause();

      const startTime = video.currentTime;
      const duration = 5000; // 5 seconds
      const startTimestamp = Date.now();

      reverseInterval = setInterval(() => {
        const elapsed = Date.now() - startTimestamp;
        const progress = elapsed / duration;

        if (progress >= 1) {
          // Reverse cycle complete, start forward again
          clearInterval(reverseInterval);
          startForwardCycle();
        } else {
          // Calculate reverse position
          video.currentTime = startTime * (1 - progress);
        }
      }, 16); // ~60fps for smooth playback
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);

      // Clear all timers
      if (forwardTimer) clearTimeout(forwardTimer);
      if (reverseInterval) clearInterval(reverseInterval);
    };
  }, []);

  return (
    <section
      className={cn(
        "video-background relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900",
        className
      )}
    >
      {/* Video Element */}
      {!hasError && (
        <video
          ref={videoRef}
          className={cn(
            "video-background__video absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            {
              "opacity-100": isLoaded,
              "opacity-0": !isLoaded,
              "video-background__video--reversing": isReversing,
            }
          )}
          muted
          playsInline
          preload="metadata"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback Background */}
      {(hasError || !isLoaded) && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      )}

      {/* Debug Info - Remove in production */}
      <div className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded text-sm">
        <div>Mode: {isReversing ? "Reverse" : "Forward"}</div>
        <div>Loaded: {isLoaded.toString()}</div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>

      {/* Loading Indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="video-background__loader">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}
    </section>
  );
}
