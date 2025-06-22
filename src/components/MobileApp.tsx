import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Star, Users } from 'lucide-react';

export default function MobileApp() {
  const features = [
    'Offline photo analysis',
    'Voice note recording',
    'Smart notifications',
    'Barcode scanning',
    'Meal planning',
    'Progress widgets',
  ];

  const stats = [
    { value: '50K+', label: 'Downloads' },
    { value: '4.9', label: 'App Store Rating' },
    { value: '25K+', label: 'Active Users' },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center glass rounded-full px-4 py-2 mb-6">
              <Smartphone className="text-emerald-400 mr-2" size={20} />
              <span className="text-white/90 font-medium">Mobile App Available</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Track Nutrition
              <br />
              <span className="gradient-text">On The Go</span>
            </h2>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Take your nutrition tracking anywhere with our powerful mobile app. 
              Snap photos, get instant analysis, and stay on top of your health goals 
              even when you're away from your computer.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" />
                  <span className="text-white/90 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button className="btn-primary flex items-center justify-center">
                <Download className="mr-2" size={20} />
                App Store
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <Download className="mr-2" size={20} />
                Google Play
              </button>
            </motion.div>
          </motion.div>

          {/* Mobile App Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative mx-auto w-80">
              {/* Phone Frame */}
              <div className="glass rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 py-3 text-white text-sm">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-white/60 rounded-sm" />
                      <div className="w-4 h-2 bg-white/60 rounded-sm" />
                      <div className="w-6 h-3 bg-white/60 rounded-sm" />
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="px-6 pb-8">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl mx-auto mb-3" />
                      <h3 className="text-white font-bold">NutriTrack AI</h3>
                    </div>

                    {/* Recent Analysis */}
                    <div className="glass rounded-2xl p-4 mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl" />
                        <div>
                          <div className="text-white font-medium text-sm">Grilled Salmon</div>
                          <div className="text-white/60 text-xs">520 calories</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-400">28g protein</span>
                        <span className="text-green-400">15g carbs</span>
                        <span className="text-purple-400">22g fat</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="glass rounded-xl p-3 text-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-lg mx-auto mb-2" />
                        <span className="text-white text-xs">Analyze</span>
                      </button>
                      <button className="glass rounded-xl p-3 text-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-2" />
                        <span className="text-white text-xs">Progress</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass rounded-full p-3"
              >
                <Star className="text-emerald-400" size={20} />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                className="absolute -bottom-4 -left-4 glass rounded-full p-3"
              >
                <Users className="text-primary-400" size={20} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}