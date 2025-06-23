import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function History() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const itemsPerPage = 10;

  // Sample data - replace with actual data from your backend
  const nutritionHistory = [
    { id: 1, date: '2024-01-15', meal: 'Grilled Chicken Salad', calories: 420, protein: 35, carbs: 28, fat: 18, fiber: 8 },
    { id: 2, date: '2024-01-15', meal: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 52, fat: 6, fiber: 12 },
    { id: 3, date: '2024-01-14', meal: 'Salmon with Quinoa', calories: 520, protein: 42, carbs: 35, fat: 22, fiber: 6 },
    { id: 4, date: '2024-01-14', meal: 'Greek Yogurt Parfait', calories: 180, protein: 15, carbs: 25, fat: 5, fiber: 4 },
    { id: 5, date: '2024-01-13', meal: 'Veggie Stir Fry', calories: 320, protein: 12, carbs: 45, fat: 14, fiber: 10 },
    { id: 6, date: '2024-01-13', meal: 'Protein Smoothie', calories: 250, protein: 25, carbs: 30, fat: 8, fiber: 5 },
    { id: 7, date: '2024-01-12', meal: 'Turkey Sandwich', calories: 380, protein: 28, carbs: 42, fat: 12, fiber: 6 },
    { id: 8, date: '2024-01-12', meal: 'Mixed Nuts', calories: 160, protein: 6, carbs: 8, fat: 14, fiber: 3 },
    { id: 9, date: '2024-01-11', meal: 'Grilled Fish Tacos', calories: 450, protein: 32, carbs: 38, fat: 18, fiber: 7 },
    { id: 10, date: '2024-01-11', meal: 'Fruit Bowl', calories: 120, protein: 2, carbs: 30, fat: 1, fiber: 8 },
    { id: 11, date: '2024-01-10', meal: 'Chicken Curry', calories: 480, protein: 38, carbs: 35, fat: 20, fiber: 5 },
    { id: 12, date: '2024-01-10', meal: 'Brown Rice', calories: 220, protein: 5, carbs: 45, fat: 2, fiber: 4 },
  ];

  // Filter data based on date
  const filteredData = dateFilter 
    ? nutritionHistory.filter(item => item.date === dateFilter)
    : nutritionHistory;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Nutrition History
            </h1>
            <p className="text-xl text-white/80">
              Track your complete nutrition journey over time
            </p>
          </motion.div>

          {/* Date Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Filter className="text-primary-400" size={20} />
                <span className="text-white font-medium">Filter by Date</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input-field pl-12 pr-4"
                  />
                </div>
                {dateFilter && (
                  <button
                    onClick={() => {
                      setDateFilter('');
                      setCurrentPage(1);
                    }}
                    className="btn-ghost text-sm px-4 py-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* History Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white">Nutrition Records</h3>
              <p className="text-white/70 mt-2">
                Showing {paginatedData.length} of {filteredData.length} records
              </p>
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
                  {paginatedData.map((meal, index) => (
                    <motion.tr
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-white/70 text-sm">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="glass hover:bg-white/20 p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="text-white" size={20} />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white'
                            : 'glass hover:bg-white/20 text-white/80'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="glass hover:bg-white/20 p-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="text-white" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}