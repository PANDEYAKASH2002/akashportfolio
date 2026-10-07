"use client";

import { useEffect, useState } from "react";

export default function IntroLoader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1100; // ~1.1 seconds for a snappy, punchy loading feel

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressValue = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(progressValue);

      if (progressValue < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsLoaded(true);
            if (onComplete) onComplete();
          }, 450);
        }, 150);
      }
    };

    const animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  if (isLoaded) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-8 sm:p-14 bg-[#080808] text-[#F5F4F1] transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Loading portfolio"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs tracking-widest uppercase text-[#888888]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B15F2C] animate-pulse" />
          <span>PORTFOLIO // 2025</span>
        </div>
        <div className="font-mono text-[#B15F2C]">{progress}%</div>
      </div>

      {/* Center Editorial Focus */}
      <div className="max-w-4xl mx-auto w-full my-auto space-y-4">
        <div className="overflow-hidden">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] font-editorial uppercase">
            AKASH PANDEY
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm md:text-base text-[#999999] tracking-wider uppercase font-mono">
          <span className="text-[#B15F2C]">FULL-STACK DEVELOPER</span>
          <span>•</span>
          <span>REACT × NODE.JS × POSTGRESQL</span>
        </div>

        {/* Minimal Burnt-Orange Progress Line */}
        <div className="w-full bg-[#1F1F1F] h-[2px] rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-gradient-to-r from-[#8F481E] via-[#B15F2C] to-[#CF8047] transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(177,95,44,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#666666] uppercase tracking-wider font-mono">
        <div>INITIALIZING ARCHITECTURE</div>
        <div className="hidden sm:block">SURAT, GUJARAT, INDIA</div>
      </div>
    </div>
  );
}
