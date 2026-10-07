"use client";

import { useState } from "react";
import {
  Code2,
  Server,
  Database,
  Shield,
  Zap,
  Terminal,
  Sparkles,
  Orbit,
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import EngineeringUniverse from "./3d/EngineeringUniverse";

export default function TechStackSection() {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<{
    name: string;
    category: string;
    level: string;
    description: string;
  }>(PORTFOLIO_DATA.techStack.frontend[0]);

  const categories = [
    { id: "all", label: "All Technologies" },
    {
      id: "frontend",
      label: "Frontend",
      icon: <Code2 className="w-3.5 h-3.5" />,
      items: PORTFOLIO_DATA.techStack.frontend,
    },
    {
      id: "backend",
      label: "Backend",
      icon: <Server className="w-3.5 h-3.5" />,
      items: PORTFOLIO_DATA.techStack.backend,
    },
    {
      id: "database",
      label: "Database",
      icon: <Database className="w-3.5 h-3.5" />,
      items: PORTFOLIO_DATA.techStack.database,
    },
    {
      id: "authSecurity",
      label: "Auth & Security",
      icon: <Shield className="w-3.5 h-3.5" />,
      items: PORTFOLIO_DATA.techStack.authSecurity,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: <Zap className="w-3.5 h-3.5" />,
      items: PORTFOLIO_DATA.techStack.integrations,
    },
    {
      id: "devops",
      label: "DevOps & Cloud",
      icon: <Terminal className="w-3.5 h-3.5" />,
      items: PORTFOLIO_DATA.techStack.devops,
    },
  ];

  const getFilteredItems = () => {
    if (activeCategory === "all") {
      return [
        ...PORTFOLIO_DATA.techStack.frontend.map((item) => ({
          ...item,
          domain: "Frontend",
        })),
        ...PORTFOLIO_DATA.techStack.backend.map((item) => ({
          ...item,
          domain: "Backend",
        })),
        ...PORTFOLIO_DATA.techStack.database.map((item) => ({
          ...item,
          domain: "Database",
        })),
        ...PORTFOLIO_DATA.techStack.authSecurity.map((item) => ({
          ...item,
          domain: "Auth & Security",
        })),
        ...PORTFOLIO_DATA.techStack.integrations.map((item) => ({
          ...item,
          domain: "Integrations",
        })),
        ...PORTFOLIO_DATA.techStack.devops.map((item) => ({
          ...item,
          domain: "DevOps",
        })),
      ];
    }
    const cat = categories.find((c) => c.id === activeCategory);
    return (cat?.items || []).map((item) => ({
      ...item,
      domain: cat?.label || "",
    }));
  };

  const currentItems = getFilteredItems();

  return (
    <section
      id="stack"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-[#F5F4F1] relative overflow-hidden border-t border-[#DDDCD8]"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDDCD8] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B15F2C] font-semibold">
              <span>02 — TECHNICAL ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-editorial uppercase">
              3D ENGINEERING UNIVERSE.
            </h2>
          </div>

          {/* 3D vs Grid Mode Toggle */}
          <div className="flex items-center gap-2 bg-[#EEEDEA] p-1.5 rounded-full border border-[#DDDCD8]">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
                viewMode === "3d"
                  ? "bg-[#080808] text-white shadow-sm"
                  : "text-[#666663] hover:text-[#111111]"
              }`}
            >
              <Orbit className="w-3.5 h-3.5 text-[#CF8047]" />
              <span>3D Galaxy</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
                viewMode === "grid"
                  ? "bg-[#080808] text-white shadow-sm"
                  : "text-[#666663] hover:text-[#111111]"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#B15F2C]" />
              <span>Catalog</span>
            </button>
          </div>
        </div>

        {/* 3D Universe View */}
        {viewMode === "3d" ? (
          <div className="space-y-4">
            <EngineeringUniverse />
          </div>
        ) : (
          /* Grid View */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium font-mono uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-[#080808] text-white shadow-sm"
                        : "bg-[#EEEDEA] text-[#555552] hover:bg-[#E4E3DF] hover:text-[#111111] border border-[#DDDCD8]"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid & Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentItems.map((tech) => {
                  const isSelected = selectedTech.name === tech.name;
                  return (
                    <div
                      key={tech.name}
                      onClick={() => setSelectedTech(tech)}
                      onMouseEnter={() => setSelectedTech(tech)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between min-h-[110px] ${
                        isSelected
                          ? "bg-[#080808] text-white border-[#080808] shadow-md -translate-y-0.5"
                          : "bg-[#EEEDEA] hover:bg-[#E4E3DF] text-[#111111] border-[#DDDCD8] hover:border-[#B15F2C]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider ${
                            isSelected ? "text-[#CF8047]" : "text-[#777777]"
                          }`}
                        >
                          {tech.category}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B15F2C] animate-ping" />
                        )}
                      </div>

                      <div className="pt-2">
                        <h3 className="font-bold text-sm sm:text-base font-editorial tracking-tight">
                          {tech.name}
                        </h3>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={
                            isSelected ? "text-white/60" : "text-[#888888]"
                          }
                        >
                          {tech.level}
                        </span>
                        <span
                          className={
                            isSelected ? "text-[#CF8047]" : "text-[#B15F2C]"
                          }
                        >
                          Inspect →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inspector */}
              <div className="lg:col-span-4 sticky top-28">
                <div className="rounded-[28px] bg-[#080808] text-[#F5F4F1] p-6 sm:p-7 border border-[#222222] shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-[#222222] pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#CF8047]" />
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#CF8047]">
                        TECH INSPECTOR
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#888888] border border-[#2a2a2a]">
                      {selectedTech.level}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
                      {selectedTech.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
                      {selectedTech.name}
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                    {selectedTech.description}
                  </div>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#222222]">
                      <span className="text-[#888888]">PRODUCTION USAGE</span>
                      <span className="text-white">Active System Core</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-[#888888]">DATA SOURCE</span>
                      <span className="text-white">Resume Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
