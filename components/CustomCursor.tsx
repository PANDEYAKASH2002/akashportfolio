"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<"default" | "hover" | "project" | "hidden">("default");
  const [projectTitle, setProjectTitle] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device to disable custom cursor cleanly
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true);
      return;
    }

    document.body.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check hovered elements
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectCard = target.closest("[data-cursor='project']");
      if (projectCard) {
        setCursorType("project");
        setProjectTitle(projectCard.getAttribute("data-cursor-text") || "EXPLORE");
        return;
      }

      const interactive = target.closest("a, button, input, textarea, [role='button'], [data-cursor='hover']");
      if (interactive) {
        setCursorType("hover");
        return;
      }

      setCursorType("default");
    };

    const onMouseLeave = () => setCursorType("hidden");
    const onMouseEnter = () => setCursorType("default");

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (isTouchDevice || cursorType === "hidden") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-300">
      {/* Small Precision Dot */}
      <div
        className="fixed w-2.5 h-2.5 bg-[#B15F2C] rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(177,95,44,0.6)]"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorType === "hover" ? 0 : cursorType === "project" ? 0 : 1})`
        }}
      />

      {/* Outer Follow Ring / Badge */}
      <div
        className={`fixed rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out flex items-center justify-center text-center backdrop-blur-sm ${
          cursorType === "project"
            ? "w-28 h-28 bg-[#080808]/90 border border-[#B15F2C] text-[#F5F4F1] shadow-2xl scale-100"
            : cursorType === "hover"
            ? "w-11 h-11 bg-[#B15F2C]/15 border border-[#B15F2C] scale-100"
            : "w-8 h-8 border border-[#111111]/30 dark:border-white/20 scale-100"
        }`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      >
        {cursorType === "project" && (
          <div className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 leading-tight text-[#CF8047]">
            {projectTitle}
            <div className="text-[8px] text-white/80 font-normal">DEEP DIVE →</div>
          </div>
        )}
      </div>
    </div>
  );
}
