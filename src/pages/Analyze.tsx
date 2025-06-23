import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FoodAnalysis from '../components/FoodAnalysis';

export default function Analyze() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <FoodAnalysis />
      </div>
      <Footer />
    </div>
  );
}