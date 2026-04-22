import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ContributionHeatMap = ({ contributions = [] }) => {
    // Build a map of "YYYY-MM" -> amount
    const contributionMap = useMemo(() => {
        const map = {};
        contributions.forEach(c => {
            let key = '';
            // Handle both "January 2026" and "2026-04" formats
            if (c.month && c.year) {
                const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                const idx = monthNames.indexOf(c.month);
                if (idx !== -1) {
                    key = `${c.year}-${String(idx + 1).padStart(2, '0')}`;
                } else {
                    key = `${c.month}`; // already formatted like "2026-04"
                }
            }
            if (key) map[key] = (map[key] || 0) + c.amount;
        });
        return map;
    }, [contributions]);

    // Generate last 12 months
    const cells = useMemo(() => {
        const now = new Date();
        const result = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const amount = contributionMap[key] || 0;
            result.push({
                key,
                label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
                month: MONTHS[d.getMonth()],
                amount,
            });
        }
        return result;
    }, [contributionMap]);

    const maxAmount = Math.max(...cells.map(c => c.amount), 1);

    const getColor = (amount) => {
        if (amount === 0) return { bg: 'bg-white/5', border: 'border-white/5', glow: '' };
        const ratio = amount / maxAmount;
        if (ratio > 0.75) return { bg: 'bg-[#00f2ff]/80', border: 'border-[#00f2ff]', glow: 'shadow-[0_0_12px_rgba(0,242,255,0.5)]' };
        if (ratio > 0.4)  return { bg: 'bg-[#00f2ff]/40', border: 'border-[#00f2ff]/50', glow: 'shadow-[0_0_8px_rgba(0,242,255,0.2)]' };
        return { bg: 'bg-[#00f2ff]/15', border: 'border-[#00f2ff]/20', glow: '' };
    };

    const totalMonths = cells.filter(c => c.amount > 0).length;
    const totalAmount = cells.reduce((acc, c) => acc + c.amount, 0);
    const streak = (() => {
        let s = 0;
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].amount > 0) s++;
            else break;
        }
        return s;
    })();

    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity size={20} className="text-[#00f2ff]" />
                    Contribution Activity
                </h3>
                <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-white/5 border border-white/5" /> None
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#00f2ff]/20 border border-[#00f2ff]/30" /> Low
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-[#00f2ff]/80 border border-[#00f2ff]" style={{boxShadow:'0 0 8px rgba(0,242,255,0.4)'}} /> High
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-12 gap-2 mb-6">
                {cells.map((cell, i) => {
                    const { bg, border, glow } = getColor(cell.amount);
                    return (
                        <div key={cell.key} className="flex flex-col items-center gap-1 group relative">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
                                className={`w-full aspect-square rounded-lg border ${bg} ${border} ${glow} cursor-pointer transition-all hover:scale-110`}
                            />
                            <span className="text-[9px] text-white/20 group-hover:text-white/60 transition-colors">
                                {cell.month}
                            </span>
                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a1a1b] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <p className="font-bold">{cell.label}</p>
                                <p className="text-white/50">{cell.amount > 0 ? `₹${cell.amount.toLocaleString()}` : 'No contribution'}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#00f2ff]">{totalMonths}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Active Months</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#4ade80]">{streak}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Current Streak</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">₹{(totalAmount / 100000).toFixed(1)}L</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">12M Total</p>
                </div>
            </div>
        </div>
    );
};

export default ContributionHeatMap;
