// src/components/AboutSection.js
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

// Variants untuk animasi
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function AboutSection() {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_content')
          .select('content_key, title, content_body')
          .in('content_key', ['latar_belakang', 'visi', 'misi']);

        if (error) throw error;

        const formattedData = data.reduce((acc, item) => {
          acc[item.content_key] = item;
          return acc;
        }, {});
        
        setContent(formattedData);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">Memuat...</div>
        </div>
      </section>
    );
  }

  const latarBelakang = content.latar_belakang || { title: 'Latar Belakang', content_body: 'Data tidak ditemukan.' };
  const visi = content.visi || { title: 'Visi', content_body: 'Data tidak ditemukan.' };
  const misi = content.misi || { title: 'Misi', content_body: 'Data tidak ditemukan.' };

  return (
    <section id="about" className="py-20 bg-gray-50">
      <motion.div 
        className="container mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Latar Belakang */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{latarBelakang.title}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {latarBelakang.content_body}
          </p>
        </motion.div>

        {/* Visi & Misi */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Visi */}
          <motion.div 
            className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md"
            variants={cardVariants}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{visi.title}</h3>
            <p className="text-gray-600">
              {visi.content_body}
            </p>
          </motion.div>

          {/* Misi */}
          <motion.div 
            className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md"
            variants={cardVariants}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{misi.title}</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {misi.content_body.split(', ').map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}