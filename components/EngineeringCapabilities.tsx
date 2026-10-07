"use client";

import { 
  Code2, Server, Database, Shield, Zap, Terminal, ArrowUpRight 
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function EngineeringCapabilities() {
  const iconMap: Record<string, any> = {
    "01": <Code2 className="w-5 h-5 text-[#B15F2C]" />,
    "02": <Server className="w-5 h-5 text-[#B15F2C]" />,
    "03": <Database className="w-5 h-5 text-[#B15F2C]" />,
    "04": <Shield className="w-5 h-5 text-[#B15F2C]" />,
    "05": <Zap className="w-5 h-5 text-[#B15F2C]" />,
    "06": <Terminal className="w-5 h-5 text-[#B15F2C]" />,
  };

  return (
    <section id="capabilities" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#EEEDEA] border-t border-[#DDDCD8]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDDCD8] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B15F2C] font-semibold">
              <span>// 06 — CORE COMPETENCIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-editorial uppercase">
              ENGINEERING CAPABILITIES.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#555552] leading-relaxed">
            What I design, build, and deploy. Focused on production robustness, relational schema integrity, and high-performance client state.
          </p>
        </div>

        {/* 6 Capabilities Stacked Cards on Scroll */}
        <div className="relative space-y-12 pb-12">
          {PORTFOLIO_DATA.capabilities.map((cap, idx) => (
            <div
              key={cap.number}
              className="sticky rounded-[32px] bg-[#F5F4F1] border border-[#DDDCD8] hover:border-[#B15F2C] transition-all duration-300 shadow-xl p-8 sm:p-10 space-y-8 group"
              style={{
                top: `calc(85px + ${idx * 20}px)`,
                zIndex: idx + 10,
              }}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDDCD8] pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEEDEA] flex items-center justify-center border border-[#DDDCD8] group-hover:bg-[#B15F2C]/10 transition-colors">
                    {iconMap[cap.number]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#B15F2C] uppercase tracking-wider">
                        COMPETENCY {cap.number}
                      </span>
                      <span className="text-[#888888]">•</span>
                      <span className="text-xs font-mono text-[#666663] uppercase font-semibold">
                        {cap.headline}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#080808]">
                      {cap.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#888888] bg-[#EEEDEA] px-3.5 py-1.5 rounded-full border border-[#DDDCD8] self-start sm:self-center">
                  LAYER {cap.number}/06
                </span>
              </div>

              {/* 2-Column Content Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Description Column */}
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-semibold">
                    ENGINEERING FOCUS & SCOPE:
                  </span>
                  <p className="text-sm sm:text-base text-[#444441] leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                {/* Right Deliverables Column */}
                <div className="lg:col-span-6 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-semibold">
                    PRODUCTION DELIVERABLES:
                  </span>
                  <div className="space-y-2">
                    {cap.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#222222] font-mono bg-[#EEEDEA] p-3 rounded-xl border border-[#DDDCD8]">
                        <span className="w-2 h-2 rounded-full bg-[#B15F2C] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technologies Tag Footer */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#DDDCD8]">
                <span className="text-[11px] font-mono text-[#777777] uppercase mr-2 font-semibold">
                  SPECIALIZED STACK:
                </span>
                {cap.technologies.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[#EEEDEA] text-[#333333] border border-[#DDDCD8] group-hover:border-[#B15F2C]/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
