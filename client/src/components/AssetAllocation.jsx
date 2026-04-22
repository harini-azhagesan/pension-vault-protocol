import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Shield, Layers } from 'lucide-react';

const AssetAllocation = () => {
  const data = {
    labels: ['Govt Bonds', 'Corporate Equities', 'Infrastucture Fund', 'Gold & Metals'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          '#00f2ff', // Cyan
          '#7000ff', // Purple
          '#bc13fe', // Light Purple
          '#4ade80', // Green
        ],
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111112',
        titleFont: { family: 'Outfit', size: 14 },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        displayColors: true,
      },
    },
    cutout: '75%',
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <PieChart size={20} className="text-[#00f2ff]" />
          Asset Allocation
        </h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20 font-bold uppercase tracking-widest">
          Diversified
        </span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center gap-8">
        <div className="relative w-48 h-48 lg:w-40 lg:h-40 shrink-0">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase text-white/30 tracking-widest">Risk</span>
            <span className="text-xl font-bold">Low</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <AllocationItem label="Govt Bonds" value="45%" color="#00f2ff" icon={<Shield size={12} />} />
          <AllocationItem label="Corp Equities" value="30%" color="#7000ff" icon={<TrendingUp size={12} />} />
          <AllocationItem label="Infrastructure" value="15%" color="#bc13fe" icon={<Layers size={12} />} />
          <AllocationItem label="Gold & Metals" value="10%" color="#4ade80" icon={<TrendingUp size={12} />} />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <p className="text-[10px] text-white/30 leading-relaxed italic">
          *Your portfolio is automatically rebalanced by the PensionVault AI to maintain a low-risk profile while targeting 8.5% annual growth.
        </p>
      </div>
    </div>
  );
};

const AllocationItem = ({ label, value, color, icon }) => (
  <div className="flex items-center justify-between group cursor-help">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-white/60 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold">{value}</span>
      <div className="text-white/20 group-hover:text-primary transition-colors">{icon}</div>
    </div>
  </div>
);

export default AssetAllocation;
