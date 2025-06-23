import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Clock, Crown } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    email: string;
    lastSeen: string;
    plan: string;
  } | null;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!user) return null;

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'pro':
        return 'from-primary-500 to-emerald-500';
      case 'premium':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'premium':
        return Crown;
      default:
        return User;
    }
  };

  const PlanIcon = getPlanIcon(user.plan);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/30"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 glass hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
            >
              <X className="text-white" size={20} />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Profile Avatar */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                <User className="text-white" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6">
                Profile Information
              </h2>

              {/* User Details */}
              <div className="space-y-4 text-left">
                {/* Username */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Username</p>
                      <p className="text-white font-medium">{user.username}</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Mail className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Email</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Last Seen */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Clock className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Last Seen</p>
                      <p className="text-white font-medium">{user.lastSeen}</p>
                    </div>
                  </div>
                </div>

                {/* Plan */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getPlanColor(user.plan)} rounded-xl flex items-center justify-center`}>
                      <PlanIcon className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Plan</p>
                      <p className="text-white font-medium capitalize">{user.plan}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={onClose}
                  className="btn-primary w-full"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}