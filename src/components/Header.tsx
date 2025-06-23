import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Menu, X, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LogoutModal from './LogoutModal';
import ProfileModal from './ProfileModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({
          username: user.user_metadata?.display_name || 'User',
          email: user.email || '',
          lastSeen: new Date().toLocaleDateString(),
          plan: 'Starter' // Default plan, you can fetch this from your database
        });
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          username: session.user.user_metadata?.display_name || 'User',
          email: session.user.email || '',
          lastSeen: new Date().toLocaleDateString(),
          plan: 'Starter'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Analyze', href: '/analyze' },
    { name: 'Progress', href: '#progress' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setIsLogoutModalOpen(false);
  };

  const handleMenuClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      // For anchor links, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/home')}
            >
              <div className="bg-gradient-to-r from-primary-500 to-emerald-500 p-2 rounded-xl">
                <Utensils className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold gradient-text">NutriTrack AI</span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleMenuClick(item.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:scale-105 transform"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>

            {/* Profile Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Profile Button with Username */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileModalOpen(true)}
                className="glass hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                <User className="text-white" size={20} />
                {user && (
                  <span className="text-white font-medium">{user.username}</span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLogoutModalOpen(true)}
                className="btn-ghost text-sm flex items-center"
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
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.href)}
                  className="block text-white/80 hover:text-white font-medium py-2 transition-colors w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="flex items-center text-white/80 hover:text-white font-medium py-2 transition-colors w-full"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="flex items-center text-white/80 hover:text-white font-medium py-2 transition-colors w-full"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />
    </>
  );
}