import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Github, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Mobile App', href: '#mobile' },
      { name: 'API', href: '#api' },
    ],
    Company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press', href: '#press' },
    ],
    Support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact', href: '#contact' },
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
    ],
  };

  return (
    <footer className="bg-dark-950 border-t border-white/10 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-emerald-500 p-2 rounded-xl">
                  <Utensils className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold gradient-text">NutriTrack AI</span>
              </div>
              
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                Revolutionizing nutrition tracking with AI-powered food analysis. 
                Take control of your health journey with intelligent insights and 
                personalized recommendations.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-white/70">
                  <MapPin size={16} />
                  <span>San Francisco, CA 94107</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-white/70">
                  <Mail size={16} />
                  <span>hello@nutritrack.ai</span>
                </div>
              </div>

              {/* Social Links with consistent animations */}
              <div className="flex items-center justify-center space-x-6">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                >
                  <Github className="text-white" size={24} />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                >
                  <Twitter className="text-white" size={20} />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                >
                  <Instagram className="text-white" size={20} />
                </motion.a>
              </div>
            </motion.div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <h3 className="text-white font-semibold mb-6">{category}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="border-t border-white/10 py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © 2024 NutriTrack AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}