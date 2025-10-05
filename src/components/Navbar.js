// src/components/Navbar.js
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { id: 'about', name: 'Tentang Kami', href: '/#about' },
  { id: 'programs', name: 'Program', href: '/#programs' },
  { id: 'advantages', name: 'Keunggulan', href: '/#advantages' },
  { id: 'contact', name: 'Kontak', href: '/#contact' },
];

// Variants untuk animasi (tetap sama)
const hoverBackgroundVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const mobileMenuVariants = {
  closed: { x: "100%" },
  open: { x: 0 }
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 }
};

const burgerTopVariants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: 45, y: 6 }
};

const burgerMiddleVariants = {
  closed: { opacity: 1 },
  open: { opacity: 0 }
};

const burgerBottomVariants = {
  closed: { rotate: 0, y: 0 },
  open: { rotate: -45, y: -6 }
};

export default function Navbar() {
  const [hovered, setHovered] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setHovered(null);
  };

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-6 md:px-8 py-4">
          {/* Bagian Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/logo-tkp.png"
              alt="LPK Tunas Karya Putra Logo"
              width={100}
              height={40}
              className="h-auto w-auto"
              priority
            />
          </Link>

          {/* Bagian Menu Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-2 relative">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="relative px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <AnimatePresence>
                  {hovered === link.id && (
                    <motion.span
                      className="absolute inset-0 bg-gray-100 rounded-md"
                      layoutId="hoverBackground"
                      variants={hoverBackgroundVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Tombol Burger Menu Mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="focus:outline-none z-[60] relative text-cyan-500"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M3 12H21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  variants={burgerTopVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
                <motion.path 
                  d="M3 6H21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  variants={burgerMiddleVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.2 }}
                />
                <motion.path 
                  d="M3 18H21" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  variants={burgerBottomVariants}
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile dan Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white/80 backdrop-blur-md shadow-lg z-50"
            >
              <div className="flex flex-col items-center space-y-2 pt-24 relative">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.id}
                    className="w-4/5"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={link.href}
                      className="relative block px-4 py-3 text-gray-700 hover:text-gray-900 w-full text-center"
                      onClick={closeMobileMenu}
                      onMouseEnter={() => setHovered(link.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <AnimatePresence>
                        {hovered === link.id && (
                          <motion.span
                            className="absolute inset-0 bg-gray-100 rounded-md"
                            layoutId="mobileHover"
                            variants={hoverBackgroundVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}