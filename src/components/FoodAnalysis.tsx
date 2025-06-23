import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Image, Loader, CheckCircle, X, Utensils, Zap, Apple, Beef, Wheat, Droplets, Save } from 'lucide-react';
import {Mistral} from '@mistralai/mistralai';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';

interface FoodItem {
  item: string;
  calories: string;
  protein: string;
  fat: string;
  vitamin_e: string;
  carbohydrates: string;
  fiber: string;
  iron: string;
}

interface AnalysisResponse {
  food_items: FoodItem[];
}

interface NutritionTotals {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalVitaminE: number;
  totalIron: number;
}

export default function FoodAnalysis() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);

  const IMAGE_API_KEY = "186ed0db199b69c9e7ed2c6eb61f118c";
  const MISTRAL_API_KEY = "KQpq9x34XSgnQf2Be8ISxmsh12sxifRD";

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      setImage(compressedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
      setError(null);
      setResponse(null);
    } catch (error) {
      console.error('Error compressing image:', error);
      setError('Failed to process image. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setResponse(null);
    setError(null);

    try {
      const client = new Mistral({ apiKey: MISTRAL_API_KEY });

      // Upload image to ImageBB
      const formData = new FormData();
      formData.append("image", image);
      formData.append("expiration", "60");

      const uploadResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMAGE_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        throw new Error('Failed to upload image');
      }

     if (uploadData?.success) {
        // Analyze with Mistral AI
        const chatResponse = await client.chat.complete({
          model: "pixtral-12b",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Identify the food items in the image and return only a structured JSON response in the following format:
{
  "food_items": [
    {
      "item": "",
      "calories": "",
      "protein": "",
      "fat": "",
      "vitamin_e": "",
      "carbohydrates": "",
      "fiber": "",
      "iron": ""
    }
  ]
}
Ensure the response is for the entire plate, summing up all the individual pieces. Ensure the response is valid JSON without any additional text, explanations, or formatting outside the JSON structure.`,
                },
                {
                  type: "image_url",
                  imageUrl: uploadData.data.url,
                },
              ],
            },
          ],
        });
        // Parse the response
        const cleanedText =
          chatResponse?.choices?.[0]?.message?.content &&
          typeof chatResponse.choices[0].message.content === "string"
            ? chatResponse.choices[0].message.content
                .replace(/```json|```/g, "")
                .trim()
            : "";

        if (!cleanedText) {
          throw new Error("No response from AI analysis");
        }

        const parsedResponse = JSON.parse(cleanedText);
        setResponse(parsedResponse);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTotals = (foodItems: FoodItem[]): NutritionTotals => {
    return foodItems.reduce((totals, item) => {
      return {
        totalCalories: totals.totalCalories + (parseFloat(item.calories) || 0),
        totalProtein: totals.totalProtein + (parseFloat(item.protein) || 0),
        totalCarbs: totals.totalCarbs + (parseFloat(item.carbohydrates) || 0),
        totalFat: totals.totalFat + (parseFloat(item.fat) || 0),
        totalFiber: totals.totalFiber + (parseFloat(item.fiber) || 0),
        totalVitaminE: totals.totalVitaminE + (parseFloat(item.vitamin_e) || 0),
        totalIron: totals.totalIron + (parseFloat(item.iron) || 0),
      };
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      totalVitaminE: 0,
      totalIron: 0,
    });
  };

  const handleSubmit = async () => {
    if (!response?.food_items) {
      setError('No nutrition data to save');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const totals = calculateTotals(response.food_items);

      // Insert nutrition entry
      const { error: insertError } = await supabase
        .from('nutrition_entries')
        .insert({
          user_id: user.id,
          username: user.user_metadata?.display_name || 'User',
          meal_date: mealDate,
          total_calories: totals.totalCalories,
          total_protein: totals.totalProtein,
          total_carbs: totals.totalCarbs,
          total_fat: totals.totalFat,
          total_fiber: totals.totalFiber,
          total_vitamin_e: totals.totalVitaminE,
          total_iron: totals.totalIron,
          food_items: response.food_items
        });

      if (insertError) {
        throw insertError;
      }

      // Clear the form
      clearImage();
      setMealDate(new Date().toISOString().split('T')[0]);
      
      // Show success message
      alert('Nutrition data saved successfully!');
      
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      setError('Failed to save nutrition data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setResponse(null);
    setError(null);
  };

  const getNutrientIcon = (nutrient: string) => {
    switch (nutrient.toLowerCase()) {
      case 'calories':
        return Zap;
      case 'protein':
        return Beef;
      case 'carbohydrates':
        return Wheat;
      case 'fat':
        return Droplets;
      case 'fiber':
        return Apple;
      case 'vitamin_e':
        return Apple;
      case 'iron':
        return Apple;
      default:
        return Utensils;
    }
  };

  const getNutrientColor = (nutrient: string) => {
    switch (nutrient.toLowerCase()) {
      case 'calories':
        return 'from-red-500 to-orange-500';
      case 'protein':
        return 'from-blue-500 to-cyan-500';
      case 'carbohydrates':
        return 'from-green-500 to-emerald-500';
      case 'fat':
        return 'from-purple-500 to-pink-500';
      case 'fiber':
        return 'from-yellow-500 to-amber-500';
      case 'vitamin_e':
        return 'from-indigo-500 to-purple-500';
      case 'iron':
        return 'from-gray-500 to-slate-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section id="analyze" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass rounded-3xl p-8 border-2 border-dashed border-white/20 hover:border-primary-400/50 transition-all duration-300">
              {!image && !isAnalyzing && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mb-6">
                    <Upload className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Upload Your Food Photo</h3>
                  <p className="text-white/70 mb-6">
                    Choose an image file from your device
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <label className="btn-primary flex items-center justify-center cursor-pointer">
                      <Camera className="mr-2" size={20} />
                      Take Photo
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <label className="btn-ghost flex items-center justify-center cursor-pointer">
                      <Image className="mr-2" size={20} />
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {image && imagePreview && !isAnalyzing && (
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <img
                      src={imagePreview}
                      alt="Food to analyze"
                      className="max-w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Analyze</h3>
                  <p className="text-white/70 mb-6">
                    Click the button below to start AI analysis
                  </p>
                  <button 
                    onClick={analyzeImage}
                    className="btn-primary flex items-center justify-center mx-auto"
                  >
                    <Zap className="mr-2" size={20} />
                    Analyze Food
                  </button>
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

              {error && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
                    <X className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Analysis Failed</h3>
                  <p className="text-red-200 mb-6">{error}</p>
                  <button 
                    onClick={clearImage}
                    className="btn-secondary"
                  >
                    Try Again
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
            {response?.food_items && response.food_items.length > 0 ? (
              <div className="space-y-6">
                <div className="glass rounded-3xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <CheckCircle className="text-emerald-400 mr-3" size={28} />
                    Analysis Complete!
                  </h3>
                  <p className="text-white/70 mb-6">
                    Here's the nutritional breakdown of your meal:
                  </p>
                  
                  {/* Individual Food Items */}
                  {response.food_items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-6">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Utensils className="text-primary-400 mr-2" size={20} />
                        {item.item}
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(item).map(([key, value], index) => {
                          if (key === 'item') return null;
                          
                          const Icon = getNutrientIcon(key);
                          const color = getNutrientColor(key);
                          const label = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                          
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
                                    <Icon className="text-white" size={16} />
                                  </div>
                                  <span className="text-white font-medium">{label}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold text-white">{value}</span>
                                  {key === 'calories' && <span className="text-white/60 ml-1">kcal</span>}
                                  {key !== 'calories' && <span className="text-white/60 ml-1">g</span>}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Totals Summary */}
                  {(() => {
                    const totals = calculateTotals(response.food_items);
                    return (
                      <div className="mt-8 p-6 bg-gradient-to-r from-primary-500/20 to-emerald-500/20 rounded-2xl border border-primary-400/30">
                        <h4 className="text-xl font-bold text-white mb-4 text-center">Total Nutrition Summary</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/20">
                                <th className="text-left p-3 text-white/80 font-medium">Nutrient</th>
                                <th className="text-right p-3 text-white/80 font-medium">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-white/10">
                                <td className="p-3 text-white">Calories</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalCalories.toFixed(1)} kcal
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="p-3 text-white">Protein</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalProtein.toFixed(1)}g
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="p-3 text-white">Carbohydrates</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalCarbs.toFixed(1)}g
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="p-3 text-white">Fat</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalFat.toFixed(1)}g
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="p-3 text-white">Fiber</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalFiber.toFixed(1)}g
                                  </span>
                                </td>
                              </tr>
                              <tr className="border-b border-white/10">
                                <td className="p-3 text-white">Vitamin E</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalVitaminE.toFixed(1)}g
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-3 text-white">Iron</td>
                                <td className="p-3 text-right">
                                  <span className="bg-gradient-to-r from-gray-500 to-slate-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {totals.totalIron.toFixed(1)}g
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {/* Meal Date and Submit */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Meal Date
                      </label>
                      <input
                        type="date"
                        value={mealDate}
                        onChange={(e) => setMealDate(e.target.value)}
                        className="input-field w-full"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button 
                        onClick={clearImage}
                        className="btn-secondary flex-1"
                      >
                        Analyze Another
                      </button>
                      <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="btn-primary flex-1 flex items-center justify-center"
                      >
                        <Save className="mr-2" size={20} />
                        {isSaving ? 'Saving...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-2xl mb-6">
                  <Utensils className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Nutrition Results
                </h3>
                <p className="text-white/70">
                  Upload and analyze a food image to see detailed nutritional information here.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}