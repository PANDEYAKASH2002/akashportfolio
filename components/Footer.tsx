"use client";

import { ArrowUp } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import { PORTFOLIO_DATA } from "@/data/portfolio";

// Naukri doesn't have a lucide icon, so we use a custom SVG
const NaukriIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 3h18v18H3V3zm4.5 4.5v9h2.25v-5.25l3.75 5.25H15.75v-9H13.5v5.25L9.75 7.5H7.5z" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Work", href: "#projects" },
    { label: "Architecture", href: "#architecture" },
    { label: "Stack", href: "#stack" },
    { label: "Experience", href: "#experience" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  // Replace these URLs with your actual profile links
  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/yourusername",
      icon: FaGithub,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      icon: FaLinkedin,
    },
    {
      label: "Naukri",
      href: "https://www.naukri.com/mnjuser/profile",
      icon: NaukriIcon,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/yourusername",
      icon: FaInstagram,
    },
    {
      label: "Facebook",
      href: "https://facebook.com/yourusername",
      icon: FaFacebook,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/919999999999", // country code + number, no symbols
      icon: FaWhatsapp,
    },
  ];

  return (
    <footer className="bg-[#050505] text-[#F5F4F1] border-t border-[#1C1C1C] py-14 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-2">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-[#1A1A1A] pb-10">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#B15F2C] text-white flex items-center justify-center font-bold text-xs">
                AP
              </div>
              <span className="text-lg font-bold font-editorial tracking-tight text-white uppercase">
                {PORTFOLIO_DATA.personal.name}
              </span>
            </div>
            <div className="text-xs font-mono text-[#888888]">
              {PORTFOLIO_DATA.personal.subheadline}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs font-mono text-[#888888]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#CF8047] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#141414] hover:bg-[#B15F2C] text-white flex items-center justify-center transition-colors border border-[#262626]"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Social Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="w-10 h-10 rounded-full bg-[#141414] hover:bg-[#B15F2C] text-[#888888] hover:text-white flex items-center justify-center transition-colors border border-[#262626]"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666666] pt-8">
          <div>© 2025 {PORTFOLIO_DATA.personal.name}. All rights reserved.</div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>ENGINEERED WITH REACT, NEXT.JS & TAILWIND CSS</span>
            <span className="text-[#B15F2C]">•</span>
            <span>BUILT FOR PRODUCTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
