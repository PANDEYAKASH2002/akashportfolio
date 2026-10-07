"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  Terminal,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ContactScene from "./3d/ContactScene";

/* ============================================================
   
   ============================================================ */
const EMAILJS_SERVICE_ID = "service_6yfee19";
const EMAILJS_TEMPLATE_ID = "template_e4jld05";
const EMAILJS_PUBLIC_KEY = "R2kQGkohpWUAmA9m2";
/* ============================================================ */

type Status = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const copyToClipboard = (text: string, type: "email" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    // Basic client-side validation
    if (!senderEmail.trim() || !messageText.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in your email and a message.");
      setTimeout(() => setStatus("idle"), 3500);
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          // These keys must match your EmailJS template variables
          from_name: senderName || "Portfolio Visitor",
          from_email: senderEmail,
          reply_to: senderEmail,
          to_email: PORTFOLIO_DATA.personal.email,
          subject: "Project / Engineering Role Inquiry",
          message: messageText,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );

      setStatus("success");
      setMessageText("");
      setSenderEmail("");
      setSenderName("");
      formRef.current?.reset();

      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: unknown) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg(
        "Failed to send. Please email me directly at " +
          PORTFOLIO_DATA.personal.email,
      );
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 sm:py-36 px-4 sm:px-8 bg-[#080808] text-[#F5F4F1] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-radial from-[#B15F2C]/18 to-transparent blur-3xl" />
        <div className="absolute top-10 left-0 w-[400px] h-[400px] bg-radial from-[#8F481E]/12 to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#CF8047] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#B15F2C] animate-ping" />
            <span>9 — DIRECT INITIATION</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold font-editorial text-white tracking-tighter-editorial uppercase leading-[0.95]">
            LET&apos;S BUILD <br />
            <span className="text-[#CF8047]">SOMETHING REAL.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#AAAAAA] leading-relaxed max-w-2xl font-normal">
            Available for full-stack engineering roles, technical leadership,
            and production web systems. Reach out directly via email or phone.
          </p>
        </div>

        {/* 3D Contact Orb Scene */}
        <div className="w-full">
          <ContactScene />
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Details & Copy Cards (Left 6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Email Card */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#121212] border border-[#262626] hover:border-[#B15F2C] transition-all duration-300 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#888888] tracking-wider flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#CF8047]" />
                  <span>PRIMARY EMAIL</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  INBOX MONITORED
                </span>
              </div>

              <div className="text-base sm:text-xl font-mono font-semibold text-white break-all">
                {PORTFOLIO_DATA.personal.email}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                  className="px-5 py-2.5 rounded-full bg-[#B15F2C] hover:bg-[#CF8047] text-white text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <span>Send Email</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(PORTFOLIO_DATA.personal.email, "email")
                  }
                  className="px-4 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#333333]"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedEmail ? "Copied to Clipboard!" : "Copy Address"}
                  </span>
                </button>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#121212] border border-[#262626] hover:border-[#B15F2C] transition-all duration-300 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#888888] tracking-wider flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#CF8047]" />
                  <span>DIRECT PHONE & WHATSAPP</span>
                </span>
                <span className="text-[10px] font-mono text-[#888888]">
                  INDIA (IST)
                </span>
              </div>

              <div className="text-lg sm:text-2xl font-mono font-semibold text-white">
                {PORTFOLIO_DATA.personal.phone}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`tel:${PORTFOLIO_DATA.personal.phone.replace(/\s+/g, "")}`}
                  className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#333333]"
                >
                  <span>Call Directly</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(PORTFOLIO_DATA.personal.phone, "phone")
                  }
                  className="px-4 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#252525] text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#333333]"
                >
                  {copiedPhone ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedPhone ? "Copied!" : "Copy Phone"}</span>
                </button>
              </div>
            </div>

            {/* Location & Status Card */}
            <div className="p-5 rounded-2xl bg-[#101010] border border-[#222222] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-[#999999]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#CF8047]" />
                <span className="text-white font-medium">
                  {PORTFOLIO_DATA.personal.location}
                </span>
              </div>
              <span className="text-[#CF8047]">
                Available Worldwide (Remote / Relocation)
              </span>
            </div>
          </div>

          {/* Quick Message Dispatcher (Right 6 Cols) */}
          <div className="lg:col-span-6 p-7 sm:p-8 rounded-[32px] bg-[#111111] border border-[#262626] shadow-2xl space-y-6">
            <div className="space-y-1 border-b border-[#222222] pb-4">
              <h3 className="text-xs font-mono text-[#CF8047] uppercase tracking-widest font-semibold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Contact Me
              </h3>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 font-mono text-xs"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#888888] uppercase block">
                  YOUR NAME
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder:text-[#555555] focus:outline-none focus:border-[#B15F2C] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-[#888888] uppercase block">
                  YOUR EMAIL OR ORGANIZATION
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="e.g. recruiter@company.com or client@startup.io"
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder:text-[#555555] focus:outline-none focus:border-[#B15F2C] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-[#888888] uppercase block">
                  PROJECT SCOPE / ROLE DETAILS
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Tell me about the role, product roadmap, or architecture challenge you're building..."
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-[#2B2B2B] text-white placeholder:text-[#555555] focus:outline-none focus:border-[#B15F2C] transition-colors resize-none"
                />
              </div>

              {/* Status feedback */}
              {status === "success" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[11px]">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Message sent successfully. I&apos;ll reply soon.</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/60 border border-red-800/50 text-red-400 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="break-all">{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3.5 rounded-xl bg-[#B15F2C] hover:bg-[#CF8047] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {status === "sending" ? (
                  <>
                    <span>Sending…</span>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Send Enquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-[10px] text-[#666666] text-center pt-1">
                Your message is delivered to my inbox via EmailJS.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
