"use client";

import { CheckCircle2, Code2, Database, ShieldCheck, Server, Globe2, Terminal } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function AboutPositioning() {
  const pillars = [
    {
      icon: <Code2 className="w-5 h-5 text-[#B15F2C]" />,
      title: "Frontend Craft & Scalable State",
      description: "Building responsive single-page applications with React.js, TypeScript, and Tailwind CSS. Leveraging Redux Toolkit and Context API to manage intricate state lifecycles and internationalization for 22 languages.",
      techs: ["React.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Leaflet.js"]
    },
    {
      icon: <Server className="w-5 h-5 text-[#B15F2C]" />,
      title: "Backend Services & REST Architectures",
      description: "Developing robust server-side applications with Node.js and Express.js. Implementing secure RESTful endpoints, custom middleware pipelines, automated Nodemailer email notifications, and structured error boundaries.",
      techs: ["Node.js", "Express.js", "REST APIs", "Nodemailer", "Async Controllers"]
    },
    {
      icon: <Database className="w-5 h-5 text-[#B15F2C]" />,
      title: "Relational Modeling & Persistent Storage",
      description: "Designing schema architectures and migrations across PostgreSQL, MongoDB, and MySQL. Utilizing Prisma ORM and Mongoose to ensure query performance, data integrity, and strict entity relationships.",
      techs: ["PostgreSQL", "Prisma ORM", "MongoDB", "Mongoose", "MySQL"]
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#B15F2C]" />,
      title: "Security, RBAC & Cloud Deployment",
      description: "Enforcing defense-in-depth authorization using JSON Web Tokens (JWT) and multi-level Role-Based Access Control (Admin, HR, Manager, Employee, Seller). Deploying production environments on Contabo VPS with Linux, Nginx, and SSL.",
      techs: ["JWT", "RBAC", "Linux VPS", "Nginx", "PayU Gateways"]
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#EEEDEA] border-y border-[#DDDCD8]">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DDDCD8] pb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B15F2C] font-semibold">
              <span>// 01 — POSITIONING & ENGINEERING PHILOSOPHY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#080808] font-editorial leading-[1.05]">
              &ldquo;I build interfaces users enjoy and backend systems they never have to think about.&rdquo;
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-[#555552] leading-relaxed">
            <p>
              I am a <strong className="text-[#111111] font-semibold">Full-Stack Developer</strong> operating across the complete software delivery lifecycle. Rather than treating frontend and backend as isolated disciplines, I bridge client interactions directly to resilient database schemas and Linux server infrastructure.
            </p>
          </div>
        </div>

        {/* 4 Pillar Stacked Cards on Scroll */}
        <div className="relative space-y-12 pb-12">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.title}
              className="sticky rounded-[32px] bg-[#F5F4F1] border border-[#DDDCD8] hover:border-[#B15F2C] transition-all duration-300 shadow-xl p-8 sm:p-10 space-y-6 group"
              style={{
                top: `calc(85px + ${idx * 24}px)`,
                zIndex: idx + 10,
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-[#DDDCD8] pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEEDEA] flex items-center justify-center border border-[#DDDCD8] group-hover:bg-[#B15F2C]/10 transition-colors">
                    {pillar.icon}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#B15F2C] uppercase tracking-wider block">
                      PILLAR 0{idx + 1} // ARCHITECTURAL SPECIALIZATION
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] font-editorial">
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#888888] bg-[#EEEDEA] px-3.5 py-1.5 rounded-full border border-[#DDDCD8] self-start">
                  CORE DOMAIN 0{idx + 1}
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#555552] leading-relaxed max-w-4xl">
                {pillar.description}
              </p>

              {/* Technology Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#DDDCD8]">
                <span className="text-[11px] font-mono text-[#777777] uppercase mr-2 font-semibold">
                  PRIMARY TOOLING:
                </span>
                {pillar.techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#EEEDEA] text-[#333333] border border-[#DDDCD8] group-hover:border-[#B15F2C]/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Callout Banner */}
        <div className="rounded-[28px] bg-[#080808] text-[#F5F4F1] p-8 sm:p-10 border border-[#222222] shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono text-[#CF8047] uppercase tracking-widest font-semibold">
              // PRODUCTION PROVENANCE
            </span>
            <h4 className="text-2xl sm:text-3xl font-bold font-editorial text-white">
              End-to-End Ownership: From Git commit to Nginx Reverse Proxy.
            </h4>
            <p className="text-sm text-[#999999] leading-relaxed">
              Every system I build is architected with clear relational schemas, cryptographic JWT auth guards, error validation pipelines, and production VPS configuration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <a
              href="#projects"
              className="px-6 py-3.5 rounded-full bg-[#B15F2C] hover:bg-[#CF8047] text-white text-xs font-semibold uppercase tracking-wider transition-colors text-center"
            >
              See Featured Projects
            </a>
            <a
              href="#architecture"
              className="px-6 py-3.5 rounded-full bg-[#161616] hover:bg-[#222222] text-white text-xs font-semibold uppercase tracking-wider border border-[#333333] transition-colors text-center"
            >
              View System Flow
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
