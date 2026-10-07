"use client";

import { GraduationCap, Award, MapPin } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function EducationSection() {
  const totalEducationCount = PORTFOLIO_DATA.education.length;

  return (
    <section
      id="education"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-[#F5F4F1] border-t border-[#DDDCD8]"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDDCD8] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B15F2C] font-semibold">
              <span>// 08 — ACADEMIC FOUNDATIONS & CERTIFICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-editorial uppercase">
              EDUCATION & CREDENTIALS.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#555552] leading-relaxed">
            Formal graduate & undergraduate academic degrees complemented by
            rigorous, intensive professional frontend development training.
          </p>
        </div>

        {/* Stacked Cards mapped dynamically from PORTFOLIO_DATA */}
        <div className="relative space-y-12 pb-12">
          {/* Academic Degrees */}
          {PORTFOLIO_DATA.education.map((edu, idx) => {
            const cardIndex = idx;
            return (
              <div
                key={`${edu.degree}-${edu.institution}`}
                className="sticky rounded-[32px] bg-[#EEEDEA] border border-[#DDDCD8] hover:border-[#B15F2C] transition-all duration-300 shadow-xl p-8 sm:p-10 space-y-6 group"
                style={{
                  top: `calc(85px + ${cardIndex * 24}px)`,
                  zIndex: 10 + cardIndex,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDDCD8] pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F4F1] flex items-center justify-center border border-[#DDDCD8] group-hover:bg-[#B15F2C]/10 transition-colors">
                      <GraduationCap className="w-6 h-6 text-[#B15F2C]" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#B15F2C] font-bold uppercase tracking-wider block">
                        CREDENTIAL 0{cardIndex + 1} // {edu.field.toUpperCase()}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#080808]">
                        {edu.degree} — {edu.field}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#111111] bg-[#F5F4F1] px-4 py-1.5 rounded-full border border-[#DDDCD8]">
                      {edu.period}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-semibold">
                      INSTITUTION:
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold font-editorial text-[#111111]">
                      {edu.institution}
                    </h4>
                  </div>

                  {/* <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-semibold">
                      DEGREE LEVEL & FOCUS:
                    </span>
                    <p className="text-xs sm:text-sm text-[#444441] leading-relaxed font-mono">
                      {edu.degree} degree program at {edu.institution} ({edu.period}), developing comprehensive analytical, computational, and software fundamentals.
                    </p>
                  </div> */}
                </div>
              </div>
            );
          })}

          {/* Professional Certifications */}
          {PORTFOLIO_DATA.certifications.map((cert, cIdx) => {
            const cardIndex = totalEducationCount + cIdx;
            return (
              <div
                key={`${cert.title}-${cert.organization}`}
                className="sticky rounded-[32px] bg-[#EEEDEA] border border-[#DDDCD8] hover:border-[#B15F2C] transition-all duration-300 shadow-xl p-8 sm:p-10 space-y-6 group"
                style={{
                  top: `calc(85px + ${cardIndex * 24}px)`,
                  zIndex: 10 + cardIndex,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDDCD8] pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F4F1] flex items-center justify-center border border-[#DDDCD8] group-hover:bg-[#B15F2C]/10 transition-colors">
                      <Award className="w-6 h-6 text-[#B15F2C]" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#B15F2C] font-bold uppercase tracking-wider block">
                        CREDENTIAL 0{cardIndex + 1} PROFESSIONAL CERTIFICATION
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#080808]">
                        {cert.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#111111] bg-[#F5F4F1] px-4 py-1.5 rounded-full border border-[#DDDCD8]">
                      {cert.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-semibold">
                        ORGANIZATION & LOCATION:
                      </span>
                      <h4 className="text-lg font-bold font-editorial text-[#111111] flex items-center gap-2">
                        <span>{cert.organization}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-xs text-[#555552] font-normal">
                          <MapPin className="w-3.5 h-3.5 text-[#B15F2C]" />
                          {cert.location}
                        </span>
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#444441] leading-relaxed">
                    {cert.description}
                  </p>

                  {/* Skills Acquired */}
                  {cert.skillsAcquired && cert.skillsAcquired.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-semibold">
                        CURRICULUM FOCUS & MASTERED TECH:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cert.skillsAcquired.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-xs font-mono bg-[#F5F4F1] text-[#222222] border border-[#DDDCD8] group-hover:border-[#B15F2C]/30 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
