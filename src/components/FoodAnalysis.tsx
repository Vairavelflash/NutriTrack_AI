import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Image, Loader, CheckCircle } from 'lucide-react';

export default function FoodAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  return (
    <section id="analyze" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            AI Food Analysis
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Upload a photo of your meal and let our AI analyze the nutritional content instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass rounded-3xl p-8 border-2 border-dashed border-white/20 hover:border-primary-400/50 transition-all duration-300">
              {!isAnalyzing && !analysisComplete && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mb-6">
                    <Upload className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Upload Your Food Photo</h3>
                  <p className="text-white/70 mb-6">
                    Drag and drop an image or click to browse
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handleAnalyze}
                      className="btn-primary flex items-center justify-center"
                    >
                      <Camera className="mr-2" size={20} />
                      Take Photo
                    </button>
                    <button 
                      onClick={handleAnalyze}
                      className="btn-ghost flex items-center justify-center"
                    >
                      <Image className="mr-2" size={20} />
                      Choose File
                    </button>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mb-6 animate-pulse">
                    <Loader className="text-white animate-spin" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Analyzing Your Food...</h3>
                  <p className="text-white/70 mb-6">
                    Our AI is processing the nutritional content
                  </p>
                  <div className="bg-white/10 rounded-full h-2 mb-4">
                    <motion.div
                      className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                    />
                  </div>
                </div>
              )}

              {analysisComplete && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Analysis Complete!</h3>
                  <p className="text-white/70 mb-6">
                    Check your nutrition data below
                  </p>
                  <button 
                    onClick={() => {
                      setAnalysisComplete(false);
                      setIsAnalyzing(false);
                    }}
                    className="btn-secondary"
                  >
                    Analyze Another
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-6">
              {[
                { label: 'Calories', value: '520', unit: 'kcal', color: 'from-red-500 to-orange-500' },
                { label: 'Protein', value: '28', unit: 'g', color: 'from-blue-500 to-cyan-500' },
                { label: 'Carbs', value: '45', unit: 'g', color: 'from-green-500 to-emerald-500' },
                { label: 'Fat', value: '22', unit: 'g', color: 'from-purple-500 to-pink-500' },
                { label: 'Fiber', value: '8', unit: 'g', color: 'from-yellow-500 to-amber-500' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="card flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color}`} />
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">{item.value}</span>
                    <span className="text-white/60 ml-1">{item.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}