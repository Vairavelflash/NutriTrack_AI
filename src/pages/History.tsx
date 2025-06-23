import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Filter, RefreshCw, Target } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface NutritionEntry {
  id: string;
  meal_date: string;
  username: string;
  meal_name: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  total_vitamin_e: number;
  total_iron: number;
  food_items: any[];
  created_at: string;
}

export default function History() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [nutritionHistory, setNutritionHistory] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchNutritionHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Build query
      let query = supabase
        .from('nutrition_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('meal_date', { ascending: false });

      // Apply date filter if provided
      if (dateFilter) {
        query = query.eq('meal_date', dateFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setNutritionHistory(data || []);

    } catch (error) {
      console.error('Error fetching nutrition history:', error);
      setError('Failed to load nutrition history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionHistory();
  }, [dateFilter]);

  // Filter data based on date
  const filteredData = nutritionHistory;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter]);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* White Circle Icon - Top Right (for pages without header) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed top-20 right-6 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full overflow-hidden shadow-2xl cursor-pointer animate-pulse-glow"
        >
          <img 
            src="/white_circle_360x360 copy.png" 
            alt="Brand Icon"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-4">
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
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input-field pl-12 pr-4"
                  />
                </div>
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="btn-ghost text-sm px-4 py-2"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchNutritionHistory}
                  className="btn-ghost text-sm px-4 py-2 flex items-center"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mb-4 animate-spin">
                <RefreshCw className="text-white" size={24} />
              </div>
              <p className="text-white/80">Loading your nutrition history...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-8 text-center mb-8"
            >
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchNutritionHistory}
                className="btn-primary flex items-center justify-center mx-auto"
              >
                <RefreshCw className="mr-2" size={20} />
                Retry
              </button>
            </motion.div>
          )}

          {/* History Table */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white font-display">Nutrition Records</h3>
                <p className="text-white/70 mt-2">
                  Showing {paginatedData.length} of {filteredData.length} records
                </p>
              </div>
              
              {paginatedData.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-left p-4 text-white/80 font-medium">Date</th>
                          <th className="text-left p-4 text-white/80 font-medium">Meal Name</th>
                          <th className="text-left p-4 text-white/80 font-medium">User</th>
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
                            <td className="p-4 text-white/90">{new Date(meal.meal_date).toLocaleDateString()}</td>
                            <td className="p-4 text-white font-medium">{meal.meal_name}</td>
                            <td className="p-4 text-white/80">{meal.username}</td>
                            <td className="p-4 text-center">
                              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {Math.round(meal.total_calories)}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {Math.round(meal.total_protein)}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {Math.round(meal.total_carbs)}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {Math.round(meal.total_fat)}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {Math.round(meal.total_fiber)}
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
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl mb-6 animate-float">
                    <Target className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 font-display">No Records Found</h3>
                  <p className="text-white/70 mb-6">
                    {dateFilter 
                      ? `No nutrition records found for ${new Date(dateFilter).toLocaleDateString()}.`
                      : 'Start analyzing your meals to build your nutrition history.'
                    }
                  </p>
                  {dateFilter && (
                    <button 
                      onClick={() => setDateFilter('')}
                      className="btn-secondary mr-4"
                    >
                      Clear Filter
                    </button>
                  )}
                  <button 
                    onClick={() => window.location.href = '/analyze'}
                    className="btn-primary"
                  >
                    Analyze a Meal
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}