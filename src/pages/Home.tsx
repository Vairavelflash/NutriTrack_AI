import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FoodAnalysis from '../components/FoodAnalysis';
import NutritionTable from '../components/NutritionTable';
import Pricing from '../components/Pricing';
import MobileApp from '../components/MobileApp';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FoodAnalysis />
      <NutritionTable />
      <Pricing />
      <MobileApp />
      <Footer />
    </div>
  );
}