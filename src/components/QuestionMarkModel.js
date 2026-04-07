import React, { useEffect, useRef, useState } from "react";
import questionMarkModel from "../question_mark.glb";

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

export default function QuestionMarkModel() {
  const [angle, setAngle] = useState(currentAngle);
  const modelRef = useRef(null);

  useEffect(() => subscribeToRotation(setAngle), []);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setAttribute("camera-orbit", `${angle}deg 80deg 210%`);
    }
  }, [angle]);

  return (
    <div className="question-mark-3d">
      <model-viewer
        ref={modelRef}
        className="question-mark-model"
        src={questionMarkModel}
        alt="3D question mark"
        interaction-prompt="none"
        disable-zoom
        disable-pan
        camera-target="-0.25m -0.25m 0m"
        camera-orbit="0deg 80deg 210%"
        field-of-view="46deg"
        scale="0.35 0.35 0.35"
        exposure="1.15"
      />
    </div>
  );
}
