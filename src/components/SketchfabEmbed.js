import React, { useEffect, useRef } from "react";

let currentAngle = 0;
let lastScrollY = 0;
let listenerReady = false;
const subscribers = new Set();

function notifySubscribers() {
  subscribers.forEach((callback) => callback(currentAngle));
}

function handleScroll() {
  const nextY = window.scrollY || 0;
  const delta = nextY - lastScrollY;
  lastScrollY = nextY;

  if (delta !== 0) {
    currentAngle = (currentAngle + delta * 0.6) % 360;
    notifySubscribers();
  }
}

function ensureScrollListener() {
  if (listenerReady || typeof window === "undefined") {
    return;
  }
  lastScrollY = window.scrollY || 0;
  window.addEventListener("scroll", handleScroll, { passive: true });
  listenerReady = true;
}

function subscribeToRotation(callback) {
  ensureScrollListener();
  subscribers.add(callback);
  callback(currentAngle);
  return () => {
    subscribers.delete(callback);
  };
}

export default function SketchfabEmbed() {
  const videoRef = useRef(null);

  useEffect(() => subscribeToRotation((angle) => {
    if (videoRef.current && videoRef.current.duration) {
      // Map angle (0-360) to video time (0-duration)
      const progress = (angle % 360) / 360;
      videoRef.current.currentTime = progress * videoRef.current.duration;
    }
  }), []);

  return (
    <div className="sketchfab-embed-wrapper">
      <video
        ref={videoRef}
        className="scroll-driven-video"
        src="/question_mark_animation.mp4"
        preload="auto"
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
