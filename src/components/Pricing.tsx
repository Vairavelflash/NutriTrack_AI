import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      icon: Star,
      description: 'Perfect for individuals starting their nutrition journey',
      features: [
        '10 photo analyses per month',
        'Basic nutrition tracking',
        'Weekly progress reports',
        'Mobile app access',
        'Email support',
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      icon: Zap,
      description: 'Ideal for serious health enthusiasts',
      features: [
        'Unlimited photo analyses',
        'Advanced nutrition tracking',
        'Daily insights & recommendations',
        'Meal planning suggestions',
        'Priority support',
        'Export data',
        'Custom goals',
      ],
      color: 'from-primary-500 to-emerald-500',
      popular: true,
    },
    {
      name: 'Premium',
      price: '$39',
      period: '/month',
      icon: Crown,
      description: 'For professionals and nutrition coaches',
      features: [
        'Everything in Pro',
        'White-label solution',
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'Nutrition consultant access',
      ],
      color: 'from-purple-500 to-pink-500',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Start your nutrition journey with the perfect plan for your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative glass rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary-400 shadow-2xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mb-4 shadow-lg`}>
                  <plan.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mt-0.5`}>
                      <Check className="text-white w-3 h-3" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-lg'
                    : 'glass hover:bg-white/20 text-white border border-white/30 hover:border-white/50'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white/70 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="inline-flex items-center space-x-6 text-sm text-white/60">
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day money back guarantee</span>
            <span>✓ No setup fees</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}