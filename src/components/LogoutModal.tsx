import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-6">
                <LogOut className="text-white" size={28} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Confirm Logout
              </h2>
              
              <p className="text-white/80 mb-8">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}