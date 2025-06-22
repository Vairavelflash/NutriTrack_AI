import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Analyze', href: '#analyze' },
    { name: 'Progress', href: '#progress' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="bg-gradient-to-r from-primary-500 to-emerald-500 p-2 rounded-xl">
              <Utensils className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold gradient-text">NutriTrack AI</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <User className="text-white" size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="btn-ghost text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden glass p-2 rounded-xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-dark border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-white/80 hover:text-white font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center text-white/80 hover:text-white font-medium py-2 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}