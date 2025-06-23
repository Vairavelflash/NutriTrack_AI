import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-transparent to-emerald-900/50" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-bounce-gentle" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-bounce-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/10 to-transparent rounded-full animate-glow" />
      </motion.div>

      {/* Nutrition Theme Image - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-20 right-8 z-20 hidden lg:block"
      >
        <div className="relative">
          {/* Main food image container */}
          <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
            <img 
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Healthy nutrition bowl"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating nutrition badges */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -left-4 glass rounded-2xl p-3 shadow-lg"
          >
            <div className="text-center">
              <div className="text-emerald-400 font-bold text-lg">520</div>
              <div className="text-white/80 text-xs">Calories</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 -right-4 glass rounded-2xl p-3 shadow-lg"
          >
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">28g</div>
              <div className="text-white/80 text-xs">Protein</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/2 -left-8 transform -translate-y-1/2 glass rounded-2xl p-3 shadow-lg"
          >
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">45g</div>
              <div className="text-white/80 text-xs">Carbs</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Track Your Nutrition</span>
            <br />
            <span className="text-white">With AI Precision</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Snap a photo of your meal and get instant nutrition analysis with calories, 
            protein, carbs, and more. Transform your health journey with smart tracking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
        >
          <button 
            onClick={() => navigate('/analyze')}
            className="btn-primary text-lg px-8 py-4 group shadow-xl"
          >
            <Camera className="mr-3 group-hover:rotate-12 transition-transform" size={24} />
            Start Analyzing Food
          </button>
          <button className="btn-ghost text-lg px-8 py-4 shadow-lg">
            Watch Demo
          </button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Camera,
              title: "Instant Analysis",
              description: "AI analyzes your food photos in seconds"
            },
            {
              icon: Zap,
              title: "Real-time Results",
              description: "Get immediate nutrition breakdowns"
            },
            {
              icon: TrendingUp,
              title: "Track Progress",
              description: "Monitor your health journey over time"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
              className="card text-center group backdrop-blur-md border border-white/20"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 glass rounded-full flex justify-center backdrop-blur-md border border-white/30">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}