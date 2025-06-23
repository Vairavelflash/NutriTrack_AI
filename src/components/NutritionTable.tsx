import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award, Target, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

interface WeeklyStats {
  avgCalories: number;
  totalProtein: number;
  daysTracked: number;
  goalsMetPercentage: number;
}

export default function NutritionTable() {
  const navigate = useNavigate();
  const [nutritionData, setNutritionData] = useState<NutritionEntry[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    avgCalories: 0,
    totalProtein: 0,
    daysTracked: 0,
    goalsMetPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Fetch nutrition entries for the current user
      const { data, error: fetchError } = await supabase
        .from('nutrition_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('meal_date', { ascending: false })
        .limit(10);

      if (fetchError) {
        throw fetchError;
      }

      setNutritionData(data || []);
      
      // Calculate weekly stats
      if (data && data.length > 0) {
        const last7Days = data.slice(0, 7);
        const totalCalories = last7Days.reduce((sum, entry) => sum + entry.total_calories, 0);
        const totalProtein = last7Days.reduce((sum, entry) => sum + entry.total_protein, 0);
        const avgCalories = totalCalories / last7Days.length;
        
        // Calculate unique days tracked in the last 7 days
        const uniqueDates = new Set(last7Days.map(entry => entry.meal_date));
        const daysTracked = uniqueDates.size;
        
        // Simple goals met calculation (assuming 2000 cal target)
        const goalsMetCount = last7Days.filter(entry => entry.total_calories >= 1500 && entry.total_calories <= 2500).length;
        const goalsMetPercentage = (goalsMetCount / last7Days.length) * 100;

        setWeeklyStats({
          avgCalories,
          totalProtein,
          daysTracked,
          goalsMetPercentage
        });
      }

    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      setError('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const weeklyStatsDisplay = [
    { 
      label: 'Avg Daily Calories', 
      value: weeklyStats.avgCalories > 0 ? `${Math.round(weeklyStats.avgCalories)}` : '0', 
      change: '+5%', 
      icon: Target 
    },
    { 
      label: 'Total Protein', 
      value: `${Math.round(weeklyStats.totalProtein)}g`, 
      change: '+12%', 
      icon: TrendingUp 
    },
    { 
      label: 'Days Tracked', 
      value: `${weeklyStats.daysTracked}/7`, 
      change: '100%', 
      icon: Calendar 
    },
    { 
      label: 'Goals Met', 
      value: `${Math.round(weeklyStats.goalsMetPercentage)}%`, 
      change: '+8%', 
      icon: Award 
    },
  ];

  if (loading) {
    return (
      <section id="progress" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mb-4 animate-spin">
              <RefreshCw className="text-white" size={24} />
            </div>
            <p className="text-white/80">Loading your nutrition data...</p>
          </div>
        </div>
      </section>
    );
  }

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
          {weeklyStatsDisplay.map((stat, index) => (
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

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 text-center mb-8"
          >
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchNutritionData}
              className="btn-primary flex items-center justify-center mx-auto"
            >
              <RefreshCw className="mr-2" size={20} />
              Retry
            </button>
          </motion.div>
        )}

        {/* Nutrition Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Recent Meals</h3>
              <p className="text-white/70 mt-2">Your latest nutrition tracking data</p>
            </div>
            <button 
              onClick={fetchNutritionData}
              className="btn-ghost flex items-center"
            >
              <RefreshCw className="mr-2" size={16} />
              Refresh
            </button>
          </div>
          
          {nutritionData.length > 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {nutritionData.map((meal, index) => (
                    <motion.tr
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl mb-6">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No Nutrition Data Yet</h3>
              <p className="text-white/70 mb-6">
                Start analyzing your meals to see your nutrition progress here.
              </p>
              <button 
                onClick={() => navigate('/analyze')}
                className="btn-primary"
              >
                Analyze Your First Meal
              </button>
            </div>
          )}
          
          {nutritionData.length > 0 && (
            <div className="p-6 border-t border-white/10 text-center">
              <button 
                onClick={() => navigate('/history')}
                className="btn-primary"
              >
                View Complete History
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}