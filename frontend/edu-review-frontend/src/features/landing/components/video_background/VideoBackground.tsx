/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import "./video_background.scss";

interface VideoBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function VideoBackground({ className, children }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the section has been scrolled past
      // 0 = section is fully visible, 1 = section is completely scrolled past
      let progress = 0;

      if (rect.top <= 0) {
        // Section is being scrolled past
        progress = Math.abs(rect.top) / rect.height;
        progress = Math.min(progress, 1); // Cap at 1
      }

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Separate useEffect for retry logic
  useEffect(() => {
    if (hasError && loadAttempts < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying video load, attempt ${loadAttempts + 1}`);
        setLoadAttempts((prev) => prev + 1);
        setHasError(false);
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 2000);

      return () => clearTimeout(retryTimeout);
    }
  }, [hasError, loadAttempts]);

  // Main video effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stopTimer: NodeJS.Timeout;

    const cleanup = () => {
      if (stopTimer) clearTimeout(stopTimer);
    };

    const startVideo = () => {
      if (!video || hasFinished) return;

      cleanup(); // Clear any existing timers
      video.currentTime = 0; // Start from beginning
      setIsPlaying(true);

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing for 5 seconds");
            // After 5 seconds, pause at current frame
            stopTimer = setTimeout(() => {
              video.pause();
              setIsPlaying(false);
              setHasFinished(true);
              console.log("Video stopped at frame:", video.currentTime);
            }, 5000);
          })
          .catch((error) => {
            console.log("Video autoplay failed:", error);
            // Try to play without sound
            video.muted = true;
            video
              .play()
              .then(() => {
                stopTimer = setTimeout(() => {
                  video.pause();
                  setIsPlaying(false);
                  setHasFinished(true);
                }, 5000);
              })
              .catch(() => {
                console.log("Muted autoplay also failed");
              });
          });
      }
    };

    const handleLoadedData = () => {
      console.log("Video loaded successfully");
      setIsLoaded(true);
      setHasError(false);
      setLoadAttempts(0);
      if (!hasFinished) {
        startVideo();
      }
    };

    const handleCanPlay = () => {
      console.log("Video can play");
      if (!isLoaded) {
        setIsLoaded(true);
        setHasError(false);
        if (!hasFinished) {
          startVideo();
        }
      }
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setHasError(true);
      setIsLoaded(false);
    };

    const handleLoadStart = () => {
      console.log("Video load started");
    };

    // Add event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Force initial load
    video.load();

    return () => {
      cleanup();
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [hasFinished, isLoaded]); // Re-run if hasFinished changes

  const handleManualPlay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  const handleRetry = useCallback(() => {
    setLoadAttempts(0);
    setHasError(false);
    setHasFinished(false);
    setIsPlaying(false);
    videoRef.current?.load();
  }, []);

  const handleRestart = useCallback(() => {
    setHasFinished(false);
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.load();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "video-background relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900",
        className
      )}
      style={
        {
          "--scroll-progress": scrollProgress,
        } as React.CSSProperties
      }
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
              "video-background__video--finished": hasFinished,
            }
          )}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback Background */}
      {(hasError || !isLoaded) && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>

      {/* Scroll-based Overlay - Placed AFTER content to cover everything */}
      <div className="video-background__scroll-overlay absolute inset-0 z-20 pointer-events-none" />

      {/* Manual Play Button (fallback) */}
      {!isLoaded && !hasError && loadAttempts >= 3 && (
        <button
          onClick={handleManualPlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all pointer-events-auto"
        >
          ▶ Play Video
        </button>
      )}

      {/* Loading Indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-30">
          <div className="video-background__loader">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && loadAttempts >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 z-30">
          <div className="text-center text-white">
            <p className="text-xl mb-4">Video failed to load</p>
            <button
              onClick={handleRetry}
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded transition-all pointer-events-auto"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
