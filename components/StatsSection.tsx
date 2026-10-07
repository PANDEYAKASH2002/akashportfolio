"use client";

import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function StatsSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-8 bg-[#EEEDEA] border-y border-[#DDDCD8]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PORTFOLIO_DATA.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-[24px] bg-[#F5F4F1] border border-[#DDDCD8] flex flex-col justify-between space-y-3"
            >
              <span className="text-[10px] font-mono text-[#B15F2C] uppercase tracking-widest font-semibold">
                // PROOF 0{idx + 1}
              </span>

              <div>
                <div className="text-3xl sm:text-5xl font-bold font-editorial text-[#080808] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#111111] pt-1">
                  {stat.label}
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-[#666663] leading-relaxed pt-2 border-t border-[#DDDCD8]">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
