import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { usePulse } from '../../context/PulseContext';

export default function CampusPulseBar() {
  const { metrics } = usePulse();
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current || metrics.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const itemElements = trackRef.current.children;
    if (itemElements.length === 0) return;

    let singleSetWidth = 0;
    const singleSetCount = Math.min(metrics.length, itemElements.length);
    for (let i = 0; i < singleSetCount; i++) {
      singleSetWidth += itemElements[i].offsetWidth + 24; // gap-6 = 24px
    }

    if (singleSetWidth > 0 && containerWidth > 0) {
      const neededForOverflow = Math.max(1, Math.ceil(containerWidth / singleSetWidth));
      setRepeatCount(neededForOverflow * 2);
    }
  }, [metrics]);

  const displayMetrics = Array.from({ length: repeatCount }).flatMap(() => metrics);

  return (
    <div className="w-full bg-surface-warm/80 border-b border-border px-4 py-1.5 flex items-center text-xs font-mono overflow-hidden select-none">
      {/* Live Badge indicator */}
      <div className="flex items-center gap-2 pr-4 border-r border-border flex-shrink-0 z-10 bg-surface-warm text-cobalt font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cobalt"></span>
        </span>
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="tracking-wider uppercase text-[10px]">CAMPUS PULSE</span>
      </div>

      {/* Auto-scrolling Status Strip */}
      <div ref={containerRef} className="flex-1 overflow-hidden relative ml-3">
        <div ref={trackRef} className="animate-pulse-scroll flex items-center whitespace-nowrap gap-6 text-ink-muted">
          {displayMetrics.map((item, idx) => (
            <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-2">
              <span className="text-gold font-bold">•</span>
              <span className="hover:text-ink transition-colors cursor-pointer">{item.text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right System Operational Tag */}
      <div className="hidden md:flex items-center gap-1.5 pl-4 border-l border-border flex-shrink-0 text-[10px] text-ink-muted font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-success" />
        <span>ALMA SECURE PLATFORM</span>
      </div>
    </div>
  );
}
