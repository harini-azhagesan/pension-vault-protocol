import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Building2, TrendingUp, Loader2 } from 'lucide-react';
import axios from 'axios';

const EmployerLeaderboard = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/contributions/leaderboard/scores`);
                setScores(res.data);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-white/20">
                <Loader2 size={32} className="animate-spin mb-4 text-[#00f2ff]" />
                <p className="uppercase tracking-widest text-xs">Aggregating Global Trust Scores...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Trophy className="text-yellow-400" /> Employer Trust Leaderboard
                    </h3>
                    <p className="text-white/40 text-sm mt-1">Real-time reliability rankings based on blockchain contribution consistency.</p>
                </div>
                <div className="hidden md:block bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 block">Latest Block</span>
                    <span className="text-xs font-mono text-[#00f2ff]">#19,403,281</span>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/30">
                        <tr>
                            <th className="px-6 py-4 font-normal">Rank</th>
                            <th className="px-6 py-4 font-normal">Employer Entity</th>
                            <th className="px-6 py-4 font-normal">Reliability Score</th>
                            <th className="px-6 py-4 font-normal">Total Volume</th>
                            <th className="px-6 py-4 font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {scores.map((employer, index) => (
                            <motion.tr 
                                key={employer.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-white/[0.02] transition-colors group"
                            >
                                <td className="px-6 py-5">
                                    <span className={`text-lg font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-white/20'}`}>
                                        #{index + 1}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-[#00f2ff]/50 transition-colors">
                                            <Building2 size={18} className="text-white/40 group-hover:text-[#00f2ff]" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-[#00f2ff] transition-colors">{employer.id}</div>
                                            <div className="text-[10px] text-white/30 uppercase tracking-widest">Global ID: {employer.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${employer.trustScore}%` }}
                                                className="h-full bg-gradient-to-r from-[#00f2ff] to-[#7000ff]"
                                            />
                                        </div>
                                        <span className="font-mono text-[#00f2ff] font-bold">{employer.trustScore.toFixed(1)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-mono text-sm text-white/60">
                                    ₹{employer.totalAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-5">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${employer.rating === 'Elite' ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20' : 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20'}`}>
                                        <ShieldCheck size={12} /> {employer.rating}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {scores.length === 0 && (
                    <div className="p-12 text-center text-white/20 italic">No blockchain data available for aggregation.</div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-[#7000ff]/5 border border-[#7000ff]/20 rounded-2xl flex items-start gap-3">
                    <TrendingUp className="text-[#7000ff] shrink-0" size={20} />
                    <p className="text-xs text-white/50 leading-relaxed">
                        <strong className="text-white block mb-1">How is this calculated?</strong>
                        Trust scores are determined by the frequency of blockchain transactions, the total volume secured, and the lack of "Contribution Gaps" (missed months).
                    </p>
                </div>
                <div className="p-5 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-[#00f2ff] shrink-0" size={20} />
                    <p className="text-xs text-white/50 leading-relaxed">
                        <strong className="text-white block mb-1">Verify Authenticity</strong>
                        Every ranking is verifiable. You can pull the raw ledger for any employer and cross-reference the hashes with the official Ethereum nodes.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default EmployerLeaderboard;
