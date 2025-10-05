// src/components/HeroSection.js
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  const [heroData, setHeroData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('hero_sliders')
          .select('heading, subheading, image_url')
          .eq('is_active', true)
          .order('order', { ascending: true });

        if (error) throw error;
        setHeroData(data || []);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHeroData();
  }, []);

  // Auto slide
  useEffect(() => {
    if (heroData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(interval);
  }, [heroData.length]);

  if (loading) {
    return (
      <section className="h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Memuat...</div>
      </section>
    );
  }

  if (!heroData || heroData.length === 0) {
    return (
      <section className="h-screen bg-gray-200 flex items-center justify-center">
        <p className="text-red-500">Tidak ada data hero yang aktif.</p>
      </section>
    );
  }

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroData[currentSlide].image_url})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </motion.div>
      </AnimatePresence>
      
      <div className="relative z-10 container mx-auto text-center text-white px-4 h-full flex items-center justify-center">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {heroData[currentSlide].heading}
          </h1>
          <p className="text-lg md:text-2xl font-light">
            {heroData[currentSlide].subheading}
          </p>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      {heroData.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Pergi ke slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}