"use client";

import { Briefcase, Calendar, MapPin, CheckCircle2, Building, Sparkles } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#F5F4F1] border-t border-[#DDDCD8]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDDCD8] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B15F2C] font-semibold">
              <span>// 05 — PROFESSIONAL CHRONOLOGY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-editorial uppercase">
              WORK EXPERIENCE.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#555552] leading-relaxed">
            Direct production experience building workforce operations systems, real-time GPS telemetry, and scalable React architectures.
          </p>
        </div>

        {/* Stacked Vertical Cards on Scroll */}
        <div className="relative space-y-12 pb-12">
          {PORTFOLIO_DATA.experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="sticky rounded-[32px] bg-[#EEEDEA] border border-[#DDDCD8] hover:border-[#B15F2C] transition-all duration-300 p-8 sm:p-10 space-y-8 group shadow-xl"
              style={{
                top: `calc(90px + ${idx * 24}px)`,
                zIndex: idx + 10,
              }}
            >
              {/* Header row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DDDCD8] pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#B15F2C] uppercase">
                      0{idx + 1} // {exp.company}
                    </span>
                    <span className="text-[#888888]">•</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                      exp.status === "Current"
                        ? "bg-[#B15F2C]/15 text-[#B15F2C] border border-[#B15F2C]/30"
                        : "bg-[#E4E3DF] text-[#666663] border border-[#DDDCD8]"
                    }`}>
                      {exp.status === "Current" ? "Active Role" : "Completed"}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold font-editorial text-[#080808]">
                    {exp.role}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#666663]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F4F1] border border-[#DDDCD8]">
                    <Calendar className="w-3.5 h-3.5 text-[#B15F2C]" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F4F1] border border-[#DDDCD8]">
                    <MapPin className="w-3.5 h-3.5 text-[#B15F2C]" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-[#444441] leading-relaxed max-w-4xl">
                {exp.description}
              </p>

              {/* Responsibilities Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#777777] font-semibold">
                  CORE RESPONSIBILITIES & DELIVERABLES
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 rounded-2xl bg-[#F5F4F1] border border-[#DDDCD8] flex items-start gap-3 text-xs sm:text-sm text-[#333333] leading-relaxed group-hover:border-[#B15F2C]/30 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#B15F2C] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#DDDCD8]">
                <span className="text-[11px] font-mono text-[#777777] uppercase mr-2">
                  TECHNOLOGY ENVIRONMENT:
                </span>
                {exp.technologies.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[#E4E3DF] text-[#111111] border border-[#DDDCD8]"
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
