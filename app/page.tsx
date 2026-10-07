"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import IntroLoader from "@/components/IntroLoader";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutPositioning from "@/components/AboutPositioning";
import TechStackSection from "@/components/TechStackSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import ExperienceSection from "@/components/ExperienceSection";
import EngineeringCapabilities from "@/components/EngineeringCapabilities";
import PhilosophySection from "@/components/PhilosophySection";
import StatsSection from "@/components/StatsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  return (
    <SmoothScroll>
      {/* 1-second premium intro sequence */}
      <IntroLoader onComplete={() => setLoaderComplete(true)} />

      {/* Interactive desktop cursor */}
      <CustomCursor />

      {/* Fixed floating navigation pill */}
      <Navbar />

      {/* Main Page Content Flow */}
      <main className="relative flex flex-col w-full min-h-screen">
        {/* 3D Hero Section */}
        <Hero />

        {/* Positioning & Editorial Statement */}
        <AboutPositioning />

        {/* Interactive Architecture Visualizer */}
        <ArchitectureSection />

        {/* Featured Production Projects with 3D Visualizations */}
        <FeaturedProjects />

        {/* 3D Engineering Universe & Tech Stack */}
        <TechStackSection />

        {/* Experience Timeline */}
        <ExperienceSection />

        {/* Capabilities & What I Build */}
        <EngineeringCapabilities />

        {/* Development Philosophy */}
        <PhilosophySection />

        {/* Verified Stats */}
        <StatsSection />

        {/* Education & Certification */}
        <EducationSection />

        {/* 3D Contact CTA */}
        <ContactSection />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </SmoothScroll>
  );
}
