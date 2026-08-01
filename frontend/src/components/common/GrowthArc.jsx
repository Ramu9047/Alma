import React from 'react';

/**
 * GrowthArc Motif Component
 * 
 * Signature motif for Alma: An animated rising trajectory curve representing academic progress & growth.
 * 
 * Modes:
 * - "divider": Horizontal section divider line with upward trajectory curve.
 * - "gauge": Circular/semicircular progress arc for Risk Radar risk scores or metrics.
 * - "loader": Animated looping trajectory arc for AI Copilot thinking state.
 * 
 * Variant Colors:
 * - "cobalt" (default academic blue)
 * - "gold" (on-track / positive achievement)
 * - "risk" (declining trend / high risk alert)
 */
export default function GrowthArc({
  mode = "divider",
  variant = "cobalt",
  score = 80,
  size = 48,
  className = ""
}) {
  const getColor = () => {
    if (variant === "gold") return "#D4A017";
    if (variant === "risk") return "#D64545";
    if (variant === "success") return "#2F9E63";
    return "#2450C4"; // cobalt default
  };

  const strokeColor = getColor();

  // Mode 1: Section Divider Arc
  if (mode === "divider") {
    return (
      <div className={`w-full flex items-center justify-center my-4 overflow-hidden select-none ${className}`}>
        <svg
          viewBox="0 0 600 32"
          className="w-full max-w-2xl h-8 opacity-85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background trajectory baseline */}
          <path
            d="M 0 28 Q 150 28 300 20 T 600 8"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Animated Growth Arc Trajectory Line */}
          <path
            d="M 0 28 Q 150 28 300 20 T 600 8"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-draw-arc"
            style={{
              strokeDasharray: '600',
              strokeDashoffset: '0',
            }}
          />
          {/* Trajectory Endpoint Dot */}
          <circle cx="594" cy="8" r="4" fill={strokeColor} className="animate-pulse" />
        </svg>
      </div>
    );
  }

  // Mode 2: AI Copilot Loading / Thinking Arc Loader
  if (mode === "loader") {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 50 50"
          className="animate-spin"
          style={{ animationDuration: '1.8s' }}
        >
          <circle
            cx="25"
            cy="25"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="3.5"
          />
          <path
            d="M 25 7 A 18 18 0 0 1 43 25"
            fill="none"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Mode 3: Semicircular Gauge Arc for Risk Radar / Metrics
  if (mode === "gauge") {
    // Score map: 0 to 100 mapped to arc strokeDashoffset
    const radius = 20;
    const circumference = Math.PI * radius;
    const progress = Math.min(Math.max(score, 0), 100);
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Determine gauge color dynamically if not forced
    const gaugeColor = variant !== "cobalt" ? strokeColor : (
      score >= 80 ? "#D64545" : score >= 50 ? "#D4A017" : "#2F9E63"
    );

    return (
      <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
        <svg width={size} height={size / 1.8} viewBox="0 0 50 28" className="overflow-visible">
          {/* Background Track Arc */}
          <path
            d="M 5 25 A 20 20 0 0 1 45 25"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Active Score Arc */}
          <path
            d="M 5 25 A 20 20 0 0 1 45 25"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${circumference}`,
              strokeDashoffset: `${strokeDashoffset}`,
              transition: 'stroke-dashoffset 800ms ease-out, stroke 300ms ease',
            }}
          />
        </svg>
      </div>
    );
  }

  return null;
}
