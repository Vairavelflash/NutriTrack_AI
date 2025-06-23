import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FoodAnalysis from '../components/FoodAnalysis';

export default function Analyze() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* White Circle Icon - Top Right (for pages without header) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-20 right-6 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full overflow-hidden shadow-2xl cursor-pointer animate-pulse-glow"
        >
          <img 
            src="/white_circle_360x360 copy.png" 
            alt="Brand Icon"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="pt-16">
        <FoodAnalysis />
      </div>
      <Footer />
    </div>
  );
}