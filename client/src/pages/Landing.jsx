import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Brain, Cpu, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
            Pension<span className="neon-text-blue">Vault</span> AI
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10">
            Secure, Transparent, and AI-Powered. The next generation of smart-contract pension tracking.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/login" className="neon-button-blue flex items-center gap-2 text-lg">
              Get Started <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
          <FeatureCard 
            icon={<Shield className="text-neon-blue" />} 
            title="Blockchain Secure" 
            desc="Every contribution is hashed and logged on the Ethereum blockchain for ultimate transparency." 
          />
          <FeatureCard 
            icon={<Brain className="text-neon-purple" />} 
            title="AI Powered" 
            desc="Intelligent forecasting and anomaly detection to keep your retirement on track." 
          />
          <FeatureCard 
            icon={<Cpu className="text-neon-pink" />} 
            title="Vault ID" 
            desc="One lifelong Wallet ID that works across all employers and organizations." 
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card flex flex-col items-center text-center p-8"
  >
    <div className="mb-4 p-4 rounded-2xl bg-white/5">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-white/50">{desc}</p>
  </motion.div>
);

export default Landing;
