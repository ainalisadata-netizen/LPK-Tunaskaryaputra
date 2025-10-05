// src/app/page.js

import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import ContactForm from "@/components/ContactForm"; // <-- Impor

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <AdvantagesSection />
      <ContactForm /> {/* <-- Tambahkan di sini */}
    </>
  );
}