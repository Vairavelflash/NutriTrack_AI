import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

export default function NutritionTable() {
  const nutritionData = [
    { date: '2024-01-15', meal: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 28, fat: 18, fiber: 8 },
    { date: '2024-01-15', meal: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 52, fat: 6, fiber: 12 },
    { date: '2024-01-14', meal: 'Salmon with Quinoa', calories: 520, protein: 42, carbs: 35, fat: 22, fiber: 6 },
    { date: '2024-01-14', meal: 'Greek Yogurt Parfait', calories: 180, protein: 15, carbs: 25, fat: 5, fiber: 4 },
    { date: '2024-01-13', meal: 'Veggie Stir Fry', calories: 320, protein: 12, carbs: 45, fat: 14, fiber: 10 },
  ];

  const weeklyStats = [
    { label: 'Avg Daily Calories', value: '1,850', change: '+5%', icon: Target },
    { label: 'Total Protein', value: '112g', change: '+12%', icon: TrendingUp },
    { label: 'Days Tracked', value: '7/7', change: '100%', icon: Calendar },
    { label: 'Goals Met', value: '85%', change: '+8%', icon: Award },
  ];

  return (
    <section id="progress" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Your Nutrition Progress
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Track your daily intake and monitor your health journey with detailed analytics
          </p>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {weeklyStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card text-center group hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/70 text-sm mb-2">{stat.label}</p>
              <span className="text-emerald-400 text-sm font-medium">{stat.change}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Nutrition Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">Recent Meals</h3>
            <p className="text-white/70 mt-2">Your latest nutrition tracking data</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-white/80 font-medium">Date</th>
                  <th className="text-left p-4 text-white/80 font-medium">Meal</th>
                  <th className="text-center p-4 text-white/80 font-medium">Calories</th>
                  <th className="text-center p-4 text-white/80 font-medium">Protein (g)</th>
                  <th className="text-center p-4 text-white/80 font-medium">Carbs (g)</th>
                  <th className="text-center p-4 text-white/80 font-medium">Fat (g)</th>
                  <th className="text-center p-4 text-white/80 font-medium">Fiber (g)</th>
                </tr>
              </thead>
              <tbody>
                {nutritionData.map((meal, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-white/90">{meal.date}</td>
                    <td className="p-4 text-white font-medium">{meal.meal}</td>
                    <td className="p-4 text-center">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {meal.calories}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {meal.protein}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {meal.carbs}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {meal.fat}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {meal.fiber}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-white/10 text-center">
            <button className="btn-primary">
              View Complete History
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}