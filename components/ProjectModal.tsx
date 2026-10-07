"use client";

import { useState, useEffect } from "react";
import { X, ArrowUpRight, CheckCircle2, Shield, Database, Server, Layers, MapPin, ShoppingBag, Globe, Cpu } from "lucide-react";
import { ProjectCaseStudy } from "@/data/portfolio";

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: ProjectCaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "panels" | "challenges" | "stack">("overview");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6 md:p-10 bg-[#080808]/90 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[36px] bg-[#0E0E0E] text-[#F5F4F1] border border-[#262626] shadow-2xl overflow-hidden">
        
        {/* Modal Top Navigation Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#222222] bg-[#121212]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#CF8047] font-semibold tracking-wider uppercase">
              CASE STUDY // {project.number}
            </span>
            <span className="text-xs text-[#555555]">|</span>
            <span className="text-xs text-[#888888] font-mono uppercase hidden sm:inline">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#B15F2C] text-white flex items-center justify-center transition-colors border border-[#2E2E2E]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-8 flex-1 custom-scroll">
          
          {/* Header Title Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#B15F2C]/20 text-[#CF8047] border border-[#B15F2C]/30 uppercase">
                {project.type}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono text-[#888888] bg-[#181818] border border-[#282828] uppercase">
                ROLE: {project.role}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-editorial text-white tracking-tight">
              {project.title}
            </h2>

            <p className="text-base sm:text-lg text-[#CF8047] font-medium font-editorial">
              {project.tagline}
            </p>

            <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed max-w-3xl pt-1">
              {project.summary}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#222222] pb-4">
            {[
              { id: "overview", label: "01. Overview & Architecture" },
              { id: "panels", label: "02. Panels & Capabilities" },
              { id: "challenges", label: "03. Engineering Challenges" },
              { id: "stack", label: "04. Full Tech Breakdown" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#B15F2C] text-white font-semibold shadow-md"
                    : "bg-[#181818] text-[#888888] hover:text-white hover:bg-[#222222] border border-[#282828]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 01: Overview & Architecture */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#CF8047] tracking-wider block">
                    THE PROBLEM CONTEXT
                  </span>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#CF8047] tracking-wider block">
                    THE ENGINEERING SOLUTION
                  </span>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Architecture Overview */}
              <div className="p-6 rounded-2xl bg-[#161616] border border-[#2E2E2E] space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#CF8047] tracking-widest block">
                  SYSTEM ARCHITECTURE OVERVIEW
                </span>
                <p className="text-sm text-[#E0E0E0] leading-relaxed font-mono">
                  {project.architectureOverview}
                </p>
              </div>

              {/* Verified Highlights */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#888888] tracking-wider">
                  VERIFIED PRODUCTION DELIVERABLES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#131313] border border-[#222222] flex items-start gap-3 text-xs sm:text-sm text-[#CCCCCC]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#CF8047] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 02: Panels & Features */}
          {activeTab === "panels" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {project.panelsOrFeatures.map((panel, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#141414] border border-[#262626] space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#CF8047] uppercase block">
                        PORTAL 0{idx + 1}
                      </span>
                      <h4 className="text-lg font-bold font-editorial text-white">
                        {panel.title}
                      </h4>
                      <p className="text-xs text-[#999999] leading-relaxed">
                        {panel.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-[#222222]">
                      {panel.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2 text-xs text-[#DDDDDD] font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B15F2C]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 03: Engineering Challenges */}
          {activeTab === "challenges" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-4">
                {project.engineeringChallenges.map((ec, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#141414] border border-[#262626] space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#B15F2C]/20 text-[#CF8047] text-[10px] font-mono uppercase font-bold">
                        CHALLENGE 0{idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white font-editorial">
                        {ec.challenge}
                      </h4>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0E0E0E] border border-[#222222] text-xs sm:text-sm text-[#AAAAAA] leading-relaxed font-mono">
                      <span className="text-[#CF8047] block mb-1 font-semibold uppercase text-[10px]">
                        ENGINEERING SOLUTION & IMPLEMENTATION:
                      </span>
                      {ec.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 04: Full Tech Breakdown */}
          {activeTab === "stack" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono text-[#CF8047] uppercase block font-semibold">
                    FRONTEND LAYER
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.frontend.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded bg-[#1C1C1C] text-xs font-mono text-white border border-[#2E2E2E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono text-[#CF8047] uppercase block font-semibold">
                    BACKEND & API
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.backend.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded bg-[#1C1C1C] text-xs font-mono text-white border border-[#2E2E2E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono text-[#CF8047] uppercase block font-semibold">
                    DATABASE & ORM
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.database.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded bg-[#1C1C1C] text-xs font-mono text-white border border-[#2E2E2E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono text-[#CF8047] uppercase block font-semibold">
                    INTEGRATIONS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.integrations.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded bg-[#1C1C1C] text-xs font-mono text-white border border-[#2E2E2E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-2">
                  <span className="text-[10px] font-mono text-[#CF8047] uppercase block font-semibold">
                    INFRASTRUCTURE & DEVOPS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.devops.map(t => (
                      <span key={t} className="px-2.5 py-1 rounded bg-[#1C1C1C] text-xs font-mono text-white border border-[#2E2E2E]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 sm:px-8 py-4 border-t border-[#222222] bg-[#121212] flex items-center justify-between text-xs font-mono text-[#777777] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PRODUCTION VERIFIED ARCHITECTURE</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#B15F2C] hover:bg-[#CF8047] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Deep Dive
          </button>
        </div>

      </div>
    </div>
  );
}
