import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { usePulse } from '../../context/PulseContext';

export default function CampusPulseBar() {
  const { metrics } = usePulse();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(4);

  useEffect(() => {
    const measureWidths = () => {
      if (!containerRef.current || !trackRef.current || metrics.length === 0) return;

      const containerWidth = containerRef.current.offsetWidth;
      const itemElements = trackRef.current.children;
      if (itemElements.length === 0) return;

      let singleSetWidth = 0;
      const singleSetCount = Math.min(metrics.length, itemElements.length);
      for (let i = 0; i < singleSetCount; i++) {
        singleSetWidth += itemElements[i].offsetWidth + 24;
      }

      if (singleSetWidth > 0 && containerWidth > 0) {
        const neededForOverflow = Math.max(1, Math.ceil(containerWidth / singleSetWidth));
        setRepeatCount(neededForOverflow * 2);
      }
    };

    measureWidths();
    window.addEventListener('resize', measureWidths);
    return () => window.removeEventListener('resize', measureWidths);
  }, [metrics]);

  const displayMetrics = Array.from({ length: repeatCount }).flatMap(() => metrics);

  return (
    <div className="w-full bg-surface-glass backdrop-blur-md border-b border-border px-4 py-1.5 flex items-center text-xs font-mono overflow-hidden select-none">
      {/* Live Badge indicator */}
      <div className="flex items-center gap-2 pr-4 border-r border-border flex-shrink-0 z-10 text-cobalt font-bold">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cobalt shadow-cobalt-glow"></span>
        </span>
        <Activity className="w-3.5 h-3.5" />
        <span className="tracking-wider uppercase text-[10px]">LIVE CAMPUS PULSE</span>
      </div>

      {/* Auto-scrolling Status Strip */}
      <div ref={containerRef} className="flex-1 overflow-hidden relative ml-3">
        <div ref={trackRef} className="animate-pulse-scroll flex items-center whitespace-nowrap gap-6 text-ink-muted">
          {displayMetrics.map((item, idx) => (
            <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-surface-warm/50 border border-border/50 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="hover:text-ink transition-colors cursor-pointer font-sans font-medium">{item.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right System Operational Tag */}
      <div className="hidden md:flex items-center gap-1.5 pl-4 border-l border-border flex-shrink-0 text-[10px] text-ink-muted font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span className="px-1.5 py-0.5 rounded bg-success/10 text-success font-semibold border border-success/20">SYSTEM OPERATIONAL</span>
      </div>
    </div>
  );
}
