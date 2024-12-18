'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Darkmode from './Darkmode';

export default function Navbar({ istrans }) {
  const [isTransparent, setIsTransparent] = useState(false);

  // Set the transparency state when 'istrans' changes
  useEffect(() => {
    setIsTransparent(istrans);
  }, [istrans]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsTransparent(true);
      } else {
        istrans?
        setIsTransparent(true) :setIsTransparent(false) ;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
    initial={{ opacity: 0 }}  
    animate={{ opacity: 1 }}   
    transition={{
      duration: 0.2,
      ease: 'easeOut',
    }}
    className={`sticky top-0 left-0 w-full z-50 fx justify-evenly gap-5 max-sm:gap-2 p-2 transition-all duration-500 ${
      isTransparent
        ? 'bg-[#007BFF]/0 backdrop-blur-sm' // Transparent with blur effect
        : 'bg-[#007BFF]' // Solid background
    }`}
  >
  
      {/* Left Side: Logo or Dark Mode */}
      <Link href='/' className={`flex items-center text-xl font-bold ${isTransparent ? 'text-black dark:text-white' : 'text-white'}`}>
  LOGO
</Link>


      {/* Center: Links */}
      <div 
  className={`fx justify-center px-4 py-2 max-sm:px-2 max-sm:py-1 max-sm:gap-2 max-sm:text-base rounded-full gap-4 text-lg cursor-pointer transition-all duration-500 ${
    !isTransparent
      ? 'text-white'
      : 'text-gray-800 text-xl dark:text-gray-400 cursor-pointer border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:rounded-full dark:bg-gray-950 dark:border-black/40 dark:bg-opacity-75'
  }`}
>
  <Link href="/#home">Home</Link>
  <Link href="/#mcda">MCDA</Link>
  <Link href="/#steps">Steps</Link>
  <Link href="/ahp">Service</Link>
</div>


      {/* Right Side: Dark Mode */}
      <div className={`fx max-md:hidden justify-center transition-all duration-500 rounded-full gap-4 cursor-pointer
         ${isTransparent ? 'text-black dark:text-white' : 'text-white'}`}>
  <Darkmode />
</div>

    </motion.div>
  );
}
