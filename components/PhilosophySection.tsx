"use client";

import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function PhilosophySection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-[#080808] text-[#F5F4F1] relative">
      
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#B15F2C]/10 to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Editorial Heading */}
        <div className="space-y-4 max-w-3xl border-b border-[#222222] pb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#CF8047] font-semibold">
            // 07 — CORE PRINCIPLES & PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold font-editorial text-white tracking-tight leading-[1.05]">
            &ldquo;{PORTFOLIO_DATA.philosophy.quote}&rdquo;
          </h2>
          <p className="text-sm sm:text-base text-[#888888] font-mono">
            Every line of code either reduces operational debt or accumulates it. My architectural standards focus on longevity:
          </p>
        </div>

        {/* 4 Tenets Stacked Cards on Scroll */}
        <div className="relative space-y-10 pb-12">
          {PORTFOLIO_DATA.philosophy.tenets.map((tenet, idx) => (
            <div
              key={tenet.title}
              className="sticky rounded-[28px] bg-[#121212] border border-[#242424] hover:border-[#B15F2C] transition-all duration-300 shadow-2xl p-8 sm:p-10 space-y-4 group"
              style={{
                top: `calc(85px + ${idx * 22}px)`,
                zIndex: idx + 10,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-xs font-mono font-bold text-[#CF8047]">
                    0{idx + 1}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
                    {tenet.title}
                  </h3>
                </div>

                <span className="text-xs font-mono text-[#888888] bg-[#1A1A1A] px-3 py-1 rounded-full border border-[#2A2A2A] self-start sm:self-center">
                  STANDARD 0{idx + 1}/04
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed max-w-4xl">
                {tenet.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
