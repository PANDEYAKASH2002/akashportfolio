"use client";

import { useState } from "react";
import { 
  ArrowRight, Shield, Database, Server, Laptop, Zap, CheckCircle2, ChevronRight 
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function ArchitectureSection() {
  const [activeNode, setActiveNode] = useState<string>("client");

  const nodes = [
    {
      id: "client",
      title: "01. Client Interface Layer",
      subtitle: "React.js • TypeScript • Redux Toolkit • Leaflet.js",
      icon: <Laptop className="w-5 h-5 text-[#CF8047]" />,
      summary: "Single-Page Client rendering responsive UI, handling client-side caching with Redux & Context, interactive GPS maps, and 22-language localization.",
      inbound: "End User Interaction & GPS hardware pings",
      outbound: "HTTPS REST API requests / JSON payloads",
      resilience: "Component error boundaries, offline states, and optimistic UI updates."
    },
    {
      id: "gateway",
      title: "02. Nginx Reverse Proxy & VPS",
      subtitle: "Contabo VPS • Linux • SSL/TLS • GoDaddy DNS",
      icon: <Server className="w-5 h-5 text-[#CF8047]" />,
      summary: "Production Linux server running Nginx as a reverse proxy, terminating SSL certificates, routing API requests, and serving static React assets with gzip.",
      inbound: "Encrypted HTTPS traffic from browser client",
      outbound: "Internal proxy forwards to localhost Express port",
      resilience: "Process supervision, SSL auto-renewals, and rate limit protections."
    },
    {
      id: "backend",
      title: "03. Node.js & Express REST API",
      subtitle: "Node.js • Express.js • Async Controllers • Nodemailer",
      icon: <Server className="w-5 h-5 text-[#CF8047]" />,
      summary: "Modular backend micro-architecture featuring centralized error handling, request validation middlewares, async transaction pipelines, and transactional email triggers.",
      inbound: "Proxied HTTP REST requests from Nginx",
      outbound: "Authenticated Prisma/Mongoose queries & 3rd-party API calls",
      resilience: "Centralized error handling middleware, sanitized inputs, and structured status responses."
    },
    {
      id: "security",
      title: "04. Authentication & 4-Tier RBAC",
      subtitle: "JWT • bcrypt • Role Guards (Admin / HR / Mgr / Emp)",
      icon: <Shield className="w-5 h-5 text-[#CF8047]" />,
      summary: "Cryptographic token verification, password salt hashing with bcrypt, OTP verification lifecycles, and strict Role-Based Access Control enforcing data tenancy.",
      inbound: "Bearer token in Authorization header",
      outbound: "Validated user context injected into request handler",
      resilience: "Token expiration enforcement, timing-safe hashes, and least-privilege route access."
    },
    {
      id: "database",
      title: "05. Relational & Document Data Layer",
      subtitle: "PostgreSQL • Prisma ORM • MongoDB • MySQL",
      icon: <Database className="w-5 h-5 text-[#CF8047]" />,
      summary: "Type-safe database interaction using Prisma ORM on PostgreSQL with strict relational schemas, foreign keys, index optimization, and MongoDB storage where required.",
      inbound: "Prisma client type-safe query calls",
      outbound: "Normalized record sets & temporal GPS location series",
      resilience: "ACID compliance, migration versioning, and connection pooling."
    },
    {
      id: "integrations",
      title: "06. External Ecosystem Integrations",
      subtitle: "PayU Payment Gateway • Leaflet GPS Telemetry",
      icon: <Zap className="w-5 h-5 text-[#CF8047]" />,
      summary: "Seamless third-party services orchestration, including PayU checkout hash generation, webhook verification, and Leaflet.js real-time location coordinate streaming.",
      inbound: "Payment confirmation webhooks & hardware location pings",
      outbound: "Order status reconciliation & map route polyline updates",
      resilience: "Idempotent webhook handlers and cryptographic checksum verification."
    }
  ];

  const selected = nodes.find(n => n.id === activeNode) || nodes[0];

  return (
    <section id="architecture" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#080808] text-[#F5F4F1] relative overflow-hidden">
      
      {/* Subtle Grid Ambient */}
      <div className="pointer-events-none absolute inset-0 bg-dark-grain opacity-60" />
      <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-radial from-[#B15F2C]/15 to-transparent blur-3xl" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222222] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#CF8047] font-semibold">
              <span>// 03 — INTERACTIVE SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-editorial uppercase">
              HOW I ENGINEER FOR PRODUCTION.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#999999] leading-relaxed">
            Click or hover any architectural layer below to explore how client interactions safely travel to the database and cloud infrastructure.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Node Flow List (Left 6 Cols) */}
          <div className="lg:col-span-6 space-y-3 font-mono">
            {nodes.map((node, index) => {
              const isCurrent = activeNode === node.id;
              return (
                <div key={node.id} className="relative">
                  <button
                    onClick={() => setActiveNode(node.id)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 border flex items-center justify-between ${
                      isCurrent
                        ? "bg-[#161616] border-[#B15F2C] text-white shadow-xl translate-x-1"
                        : "bg-[#0E0E0E] hover:bg-[#141414] border-[#222222] text-[#888888] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCurrent ? "bg-[#B15F2C]/20 text-[#CF8047] border border-[#B15F2C]/40" : "bg-[#181818] text-[#666666]"
                      }`}>
                        {node.icon}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold font-editorial text-white">
                          {node.title}
                        </div>
                        <div className="text-[11px] text-[#777777]">
                          {node.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCurrent ? (
                        <span className="text-[10px] text-[#CF8047] bg-[#B15F2C]/15 px-2.5 py-1 rounded-full border border-[#B15F2C]/30">
                          ACTIVE NODE
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#444444]" />
                      )}
                    </div>
                  </button>

                  {/* Flow Connector Arrow */}
                  {index < nodes.length - 1 && (
                    <div className="flex justify-center -my-1 py-0.5">
                      <div className="w-[1px] h-3 bg-[#2A2A2A]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Node Inspector (Right 6 Cols) */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="p-7 sm:p-8 rounded-[28px] bg-[#121212] border border-[#2A2A2A] shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#222222] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B15F2C] animate-pulse" />
                  <span className="text-xs font-mono text-[#CF8047] uppercase tracking-widest">
                    NODE TELEMETRY & SPECIFICATION
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#888888] bg-[#1A1A1A] px-2.5 py-1 rounded-full">
                  STAGE {selected.title.slice(0, 2)}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
                  {selected.title}
                </h3>
                <p className="text-xs font-mono text-[#CF8047]">
                  {selected.subtitle}
                </p>
              </div>

              {/* Summary */}
              <p className="text-sm text-[#CCCCCC] leading-relaxed">
                {selected.summary}
              </p>

              {/* Inbound / Outbound Data Lifecycle */}
              <div className="space-y-3 pt-2 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#181818] border border-[#242424] space-y-1">
                  <span className="text-[10px] text-[#777777] uppercase block">INBOUND PAYLOAD</span>
                  <span className="text-white">{selected.inbound}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181818] border border-[#242424] space-y-1">
                  <span className="text-[10px] text-[#777777] uppercase block">OUTBOUND DISPATCH</span>
                  <span className="text-[#CF8047]">{selected.outbound}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181818] border border-[#242424] space-y-1">
                  <span className="text-[10px] text-[#777777] uppercase block">PRODUCTION RESILIENCE</span>
                  <span className="text-emerald-400">{selected.resilience}</span>
                </div>
              </div>

              {/* Full-Stack Verification */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#888888] border-t border-[#222222]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fully Integrated Pipeline</span>
                </div>
                <span>AKASH PANDEY ARCHITECTURE</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
