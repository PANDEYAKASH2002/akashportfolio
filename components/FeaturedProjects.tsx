"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Radio,
} from "lucide-react";
import { PORTFOLIO_DATA, ProjectCaseStudy } from "@/data/portfolio";
import ProjectModal from "./ProjectModal";
import LanternScene from "./3d/LanternScene";
import HarappaScene from "./3d/HarappaScene";

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] =
    useState<ProjectCaseStudy | null>(null);

  // Interactive State for Lantern360 Demo
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Interactive State for Harappa Biosciences Demo
  const [activeEcommerceRole, setActiveEcommerceRole] = useState<
    "admin" | "seller" | "customer"
  >("customer");
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);

  const employees = [
    {
      name: "Field Agent #104",
      status: "Active Route",
      speed: "28 km/h",
      lat: "21.1702° N",
      lng: "72.8311° E",
      battery: "92%",
      travelTime: "4h 12m",
    },
    {
      name: "Regional Mgr #202",
      status: "Client Visit",
      speed: "0 km/h (Stationary)",
      lat: "21.1959° N",
      lng: "72.8194° E",
      battery: "78%",
      travelTime: "6h 40m",
    },
    {
      name: "Logistics Lead #089",
      status: "Transit",
      speed: "44 km/h",
      lat: "21.1418° N",
      lng: "72.7709° E",
      battery: "65%",
      travelTime: "2h 55m",
    },
  ];

  const sampleLanguages = [
    "English",
    "हिन्दी (Hindi)",
    "ગુજરાતી (Gujarati)",
    "मराठी (Marathi)",
    "தமிழ் (Tamil)",
    "বাংলা (Bengali)",
    "+16 More",
  ];

  return (
    <section
      id="projects"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-[#EEEDEA] border-t border-[#DDDCD8]"
    >
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDDCD8] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B15F2C] font-semibold">
              <span>03 — FEATURED 3D CASE STUDIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#080808] font-editorial uppercase">
              REAL PRODUCTION SYSTEMS.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#555552] leading-relaxed">
            Detailed 3D architectural representations of end-to-end applications
            built for business operations, real-time telemetry, and multi-panel
            RBAC.
          </p>
        </div>

        {/* Stacked Cards Container */}
        <div className="relative space-y-16 pb-12">
          {/* Project 01: HARAPPA BIOSCIENCES */}
          <div
            data-cursor="project"
            data-cursor-text="HARAPPA"
            className="sticky top-20 sm:top-24 z-10 rounded-[32px] bg-[#080808] text-[#F5F4F1] border border-[#262626] p-7 sm:p-10 lg:p-12 shadow-2xl space-y-8 overflow-hidden group transition-all duration-300"
          >
            {/* Top Label Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#CF8047] font-semibold tracking-wider">
                  PROJECT 01 // PRODUCTION E-COMMERCE
                </span>
                <span className="text-[#444444]">|</span>
                <span className="text-xs font-mono text-[#888888] uppercase">
                  Multi-Panel E-Commerce Platform
                </span>
              </div>

              <button
                onClick={() => setSelectedProject(PORTFOLIO_DATA.projects[0])}
                className="px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#B15F2C] text-white text-xs font-semibold font-mono uppercase tracking-wider flex items-center gap-2 transition-colors border border-[#333333]"
              >
                <span>Read Full Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Project Header & 3D Scene */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-3xl sm:text-5xl font-bold font-editorial text-white tracking-tight">
                  Harappa Biosciences
                </h3>
                <p className="text-base sm:text-lg text-[#CF8047] font-editorial font-medium">
                  Multi-Panel E-Commerce System with PayU Integration &
                  PostgreSQL
                </p>
                <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed">
                  Architected a production-grade multi-portal commerce platform
                  equipped with dedicated Admin, Seller, and Customer panels.
                  Engineered relational schemas via Prisma ORM, automated
                  inventory locking, secure PayU payment gateway checkouts, and
                  Linux VPS hosting.
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "React.js",
                    "Node.js",
                    "Express.js",
                    "PostgreSQL",
                    "Prisma ORM",
                    "PayU Gateway",
                    "Redux Toolkit",
                    "Linux / Nginx",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-[#161616] text-[#DDDDDD] border border-[#282828]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3D WebGL Pipeline Visual */}
              <div className="lg:col-span-6">
                <HarappaScene />
              </div>
            </div>

            {/* Interactive UI Demonstration: Multi-Panel Role & Checkout Flow */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-[#111111] border border-[#222222] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#CF8047]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                    INTERACTIVE TRANSACTION & MULTI-ROLE ENGINE
                  </span>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-full border border-[#2A2A2A] text-xs font-mono">
                  <button
                    onClick={() => setActiveEcommerceRole("customer")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      activeEcommerceRole === "customer"
                        ? "bg-[#B15F2C] text-white"
                        : "text-[#888888] hover:text-white"
                    }`}
                  >
                    Customer View
                  </button>
                  <button
                    onClick={() => setActiveEcommerceRole("seller")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      activeEcommerceRole === "seller"
                        ? "bg-[#B15F2C] text-white"
                        : "text-[#888888] hover:text-white"
                    }`}
                  >
                    Seller Panel
                  </button>
                  <button
                    onClick={() => setActiveEcommerceRole("admin")}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      activeEcommerceRole === "admin"
                        ? "bg-[#B15F2C] text-white"
                        : "text-[#888888] hover:text-white"
                    }`}
                  >
                    Super Admin
                  </button>
                </div>
              </div>

              {/* Dynamic Panel Content */}
              {activeEcommerceRole === "customer" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-3">
                    <div className="text-[10px] text-[#CF8047] uppercase font-bold">
                      01. PRODUCT CATALOG
                    </div>
                    <div className="font-semibold text-white text-sm">
                      Bio-Organic Nutrient Pack
                    </div>
                    <div className="text-[#888888]">
                      SKU: BIO-8890 • In Stock (420 units)
                    </div>
                    <div className="text-white font-bold text-base">
                      ₹ 2,450.00
                    </div>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-2 rounded-lg bg-[#B15F2C] hover:bg-[#CF8047] text-white text-xs font-bold uppercase transition-colors"
                    >
                      Proceed to Cart →
                    </button>
                  </div>

                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      checkoutStep >= 2
                        ? "bg-[#161616] border-[#B15F2C]"
                        : "bg-[#141414] border-[#222222] opacity-60"
                    } space-y-3`}
                  >
                    <div className="text-[10px] text-[#CF8047] uppercase font-bold">
                      02. TRANSACTION DISPATCH
                    </div>
                    <div className="text-white">
                      PayU Gateway Encryption Hash
                    </div>
                    <div className="p-2 rounded bg-[#0A0A0A] font-mono text-[10px] text-emerald-400 break-all">
                      sha512(key|txnid|amount|productinfo|firstname|email|||||||||||salt)
                    </div>
                    <button
                      onClick={() => setCheckoutStep(3)}
                      className="w-full py-2 rounded-lg bg-[#222222] hover:bg-[#333333] text-white text-xs font-bold uppercase transition-colors border border-[#444444]"
                    >
                      Simulate PayU Confirmation →
                    </button>
                  </div>

                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      checkoutStep === 3
                        ? "bg-[#161616] border-emerald-500/60"
                        : "bg-[#141414] border-[#222222] opacity-60"
                    } space-y-3`}
                  >
                    <div className="text-[10px] text-emerald-400 uppercase font-bold">
                      03. ORDER RECONCILIATION
                    </div>
                    <div className="text-white">
                      PostgreSQL Transaction Success
                    </div>
                    <div className="text-[11px] text-[#888888]">
                      Order #HP-99021 Confirmed • Nodemailer receipt triggered.
                    </div>
                    <div className="text-xs text-emerald-400 font-bold">
                      Status: PAID / INVENTORY LOCKED
                    </div>
                  </div>
                </div>
              )}

              {activeEcommerceRole === "seller" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-2">
                    <div className="text-[10px] text-[#CF8047] uppercase">
                      STORE INVENTORY
                    </div>
                    <div className="text-xl font-bold text-white">
                      48 SKUs Active
                    </div>
                    <div className="text-[#888888]">
                      Automated low-stock threshold triggers
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-2">
                    <div className="text-[10px] text-[#CF8047] uppercase">
                      FULFILLMENT QUEUE
                    </div>
                    <div className="text-xl font-bold text-white">
                      14 Pending Orders
                    </div>
                    <div className="text-[#888888]">
                      Tracking numbers dispatched via REST API
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-2">
                    <div className="text-[10px] text-[#CF8047] uppercase">
                      PAYOUT LEDGER
                    </div>
                    <div className="text-xl font-bold text-white">
                      ₹ 1,84,200
                    </div>
                    <div className="text-emerald-400">
                      Reconciled with Prisma DB
                    </div>
                  </div>
                </div>
              )}

              {activeEcommerceRole === "admin" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-2">
                    <div className="text-[10px] text-[#CF8047] uppercase">
                      GLOBAL VENDOR CONTROL
                    </div>
                    <div className="text-xl font-bold text-white">
                      28 Verified Sellers
                    </div>
                    <div className="text-[#888888]">
                      KYC & Catalog moderation active
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-2">
                    <div className="text-[10px] text-[#CF8047] uppercase">
                      SYSTEM RBAC STATUS
                    </div>
                    <div className="text-xl font-bold text-emerald-400">
                      Enforced (JWT)
                    </div>
                    <div className="text-[#888888]">
                      Protected admin routes with zero bleed
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#161616] border border-[#282828] space-y-2">
                    <div className="text-[10px] text-[#CF8047] uppercase">
                      SERVER INFRASTRUCTURE
                    </div>
                    <div className="text-xl font-bold text-white">
                      Nginx / Contabo
                    </div>
                    <div className="text-emerald-400">
                      HTTPS SSL/TLS Verified
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trigger Full Case Study */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(PORTFOLIO_DATA.projects[0])}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#CF8047] hover:text-white transition-colors"
              >
                <span>
                  Explore Harappa Biosciences Database Schema & Architecture
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Project 02: LANTERN360 */}
          <div
            data-cursor="project"
            data-cursor-text="LANTERN360"
            className="sticky top-24 sm:top-32 z-20 rounded-[32px] bg-[#080808] text-[#F5F4F1] border border-[#262626] p-7 sm:p-10 lg:p-12 shadow-[0_-25px_50px_rgba(0,0,0,0.7)] space-y-8 overflow-hidden group transition-all duration-300"
          >
            {/* Top Label Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#CF8047] font-semibold tracking-wider">
                  PROJECT 02 // REAL-TIME GPS TELEMETRY
                </span>
                <span className="text-[#444444]">|</span>
                <span className="text-xs font-mono text-[#888888] uppercase">
                  Workforce Management & Telemetry Platform
                </span>
              </div>

              <button
                onClick={() => setSelectedProject(PORTFOLIO_DATA.projects[1])}
                className="px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#B15F2C] text-white text-xs font-semibold font-mono uppercase tracking-wider flex items-center gap-2 transition-colors border border-[#333333]"
              >
                <span>Read Full Case Study</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Project Header & 3D Scene */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-3xl sm:text-5xl font-bold font-editorial text-white tracking-tight">
                  Lantern360
                </h3>
                <p className="text-base sm:text-lg text-[#CF8047] font-editorial font-medium">
                  Workforce Management with Real-Time Leaflet GPS Telemetry &
                  22-Language Localization
                </p>
                <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed">
                  Engineered an enterprise operations and workforce tracking
                  platform featuring live GPS telemetry with Leaflet.js,
                  polyline route drawing, 4-tier Role-Based Access Control
                  (Admin, HR, Manager, Employee), and localization across 22
                  Indian regional languages.
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    "React.js",
                    "Leaflet.js",
                    "Redux Toolkit",
                    "Node.js",
                    "Express.js",
                    "22 Indian Languages",
                    "RBAC Auth",
                    "Linux / Nginx",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-[#161616] text-[#DDDDDD] border border-[#282828]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3D GPS Telemetry Canvas */}
              <div className="lg:col-span-6">
                <LanternScene />
              </div>
            </div>

            {/* Interactive UI Demonstration: Live GPS Simulator & Multi-Language Switcher */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-[#111111] border border-[#222222] space-y-6">
              {/* Demo Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                    LIVE TELEMETRY STREAM & MULTI-LANGUAGE SWITCHER
                  </span>
                </div>

                {/* Language Switcher Bar */}
                <div className="flex items-center gap-2">
                  <Globe2 className="w-3.5 h-3.5 text-[#CF8047]" />
                  <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                    {sampleLanguages.slice(0, 4).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-2.5 py-0.5 rounded-md transition-colors ${
                          selectedLanguage === lang
                            ? "bg-[#B15F2C] text-white"
                            : "bg-[#1A1A1A] text-[#888888] hover:text-white"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                    <span className="px-2 py-0.5 text-[10px] text-[#777777] bg-[#181818] rounded">
                      +18 More
                    </span>
                  </div>
                </div>
              </div>

              {/* Personnel Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {employees.map((emp, idx) => (
                  <button
                    key={emp.name}
                    onClick={() => setActiveEmployee(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      activeEmployee === idx
                        ? "bg-[#181818] border-[#B15F2C] text-white shadow-md"
                        : "bg-[#131313] hover:bg-[#161616] border-[#222222] text-[#777777]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white">{emp.name}</span>
                      <span className="text-[10px] text-emerald-400">
                        {emp.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#888888] pt-1">
                      <span>Speed: {emp.speed}</span>
                      <span>Battery: {emp.battery}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Full Case Study */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(PORTFOLIO_DATA.projects[1])}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#CF8047] hover:text-white transition-colors"
              >
                <span>
                  Explore Lantern360 GPS Ingestion & Leaflet Optimization Deep
                  Dive
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
