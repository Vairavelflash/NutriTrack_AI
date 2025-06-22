import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    // Simulate login success
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-primary-400/10 to-emerald-400/10 rounded-full blur-2xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl border border-white/30 backdrop-blur-md">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
              <Utensils className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              NutriTrack AI
            </h1>
            <p className="text-white/80">Smart nutrition tracking with AI</p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 w-full"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 w-full"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2 group shadow-xl"
              >
                <span>Sign In</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </motion.div>
          </form>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-white/20"
          >
            <div className="flex items-center justify-center space-x-4 text-sm text-white/70">
              <div className="flex items-center space-x-1">
                <Sparkles size={16} />
                <span>AI Analysis</span>
              </div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Utensils size={16} />
                <span>Food Tracking</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}