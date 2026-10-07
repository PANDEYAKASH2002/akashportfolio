"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X, FileDown } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = [
        "hero",
        "about",
        "projects",
        "stack",
        "experience",
        "architecture",
        "capabilities",
        "contact",
      ];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Architecture", href: "#architecture" },
    { label: "Work", href: "#projects" },
    { label: "Stack", href: "#stack" },
    { label: "Experience", href: "#experience" },
    { label: "Capabilities", href: "#capabilities" },
  ];

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-300 px-3 sm:px-8 max-w-full ${
          isScrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-6"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo / Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#hero");
            }}
            className="group flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full glass-panel border border-[#DDDCD8] hover:border-[#B15F2C] transition-all duration-300 shadow-xs shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-[#080808] text-[#F5F4F1] flex items-center justify-center font-bold text-xs tracking-tighter group-hover:bg-[#B15F2C] transition-colors">
              AP
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-[#111111] uppercase font-editorial">
                Akash Pandey
              </span>
              <span className="text-[9px] text-[#666663] font-mono tracking-wider uppercase hidden min-[380px]:inline">
                Full-Stack Engineer
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links Pill */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-[#DDDCD8] shadow-sm">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#111111] font-semibold"
                      : "text-[#666663] hover:text-[#111111] hover:bg-black/5"
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B15F2C]" />
                  )}
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons & Mobile Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Resume Download Button */}
            <a
              href="/resume.pdf"
              download="Akash_Pandey_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full glass-panel border border-[#DDDCD8] hover:border-[#B15F2C] text-[#111111] hover:text-[#B15F2C] text-xs font-semibold font-mono uppercase tracking-wider transition-all shadow-xs shrink-0"
              title="Download Resume (PDF)"
            >
              <FileDown className="w-3.5 h-3.5 text-[#B15F2C]" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Let's Talk Button */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#080808] text-[#F5F4F1] text-xs font-semibold hover:bg-[#B15F2C] transition-all duration-300 shadow-md group tracking-wide uppercase shrink-0"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full glass-panel border border-[#DDDCD8] text-[#111111] hover:text-[#B15F2C] transition-colors shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#080808] text-[#F5F4F1] flex flex-col justify-between p-6 sm:p-8 pt-24 md:hidden transition-all duration-500 ease-in-out max-w-full overflow-y-auto ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col space-y-6">
          <div className="text-[10px] font-mono tracking-widest text-[#B15F2C] uppercase">
            // NAVIGATION MENU
          </div>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className="text-2xl sm:text-3xl font-bold font-editorial text-white/90 hover:text-[#CF8047] transition-colors flex items-center justify-between border-b border-white/10 pb-2.5"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span>{link.label}</span>
                <span className="text-xs font-mono text-[#888888]">
                  0{index + 1}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Contact & Resume Footer */}
        <div className="space-y-4 pt-6 border-t border-white/10 mt-6">
          {/* Mobile Resume Download Action */}
          <a
            href="/resume.pdf"
            download="Akash_Pandey_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#181818] text-white hover:bg-[#252525] border border-[#333333] text-xs font-bold font-mono uppercase tracking-wider transition-colors"
          >
            <FileDown className="w-4 h-4 text-[#CF8047]" />
            <span>Download Resume (PDF)</span>
          </a>

          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#777777]">
              Direct Inquiries
            </span>
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}`}
              className="text-xs sm:text-sm font-medium text-white hover:text-[#B15F2C] transition-colors break-all font-mono"
            >
              {PORTFOLIO_DATA.personal.email}
            </a>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#888888] font-mono">
              Surat, Gujarat, India
            </span>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
              className="px-4 py-2 rounded-full bg-[#B15F2C] text-white text-xs font-bold uppercase tracking-wider"
            >
              Contact Me →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
