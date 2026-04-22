import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ExternalLink, Cpu, Database, CheckCircle } from 'lucide-react';

const BlockchainVerification = () => {
    const [verifying, setVerifying] = useState(false);
    const [results, setResults] = useState(null);

    const handleVerify = () => {
        setVerifying(true);
        setTimeout(() => {
            setVerifying(false);
            setResults({
                hash: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                status: 'Confirmed',
                block: '19420852',
                timestamp: new Date().toLocaleString()
            });
        }, 2000);
    };

    return (
        <div className="p-10 max-w-5xl mx-auto min-h-screen flex flex-col items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-12"
            >
                <div className="w-20 h-20 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-blue/30">
                    <Shield className="text-neon-blue" size={40} />
                </div>
                <h2 className="text-5xl font-bold mb-4">Blockchain <span className="neon-text-blue">Trust</span> Protocol</h2>
                <p className="text-white/50 text-xl max-w-2xl">Verify the integrity of your pension contributions directly on the decentralized ledger.</p>
            </motion.div>

            <div className="glass-card w-full max-w-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/30 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        <span className="text-[10px] font-bold text-accent uppercase">Mainnet v2.4</span>
                    </div>
                </div>

                {!verifying && !results && (
                    <motion.div exit={{ opacity: 0 }}>
                        <p className="mb-8 text-white/40">Enter contribution hash or click verify to run deep integrity check.</p>
                        <button 
                            onClick={handleVerify}
                            className="neon-button-blue px-12 py-4 text-xl font-bold"
                        >
                            Run Integrity Audit
                        </button>
                    </motion.div>
                )}

                {verifying && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-24 h-24">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 border-4 border-neon-blue border-t-transparent rounded-full"
                            />
                            <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon-blue animate-pulse" size={32} />
                        </div>
                        <p className="font-mono text-neon-blue animate-pulse">Scanning Merkle Trees...</p>
                    </div>
                )}

                <AnimatePresence>
                    {results && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-left space-y-6"
                        >
                            <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl">
                                <CheckCircle className="text-accent" />
                                <span className="font-bold text-accent">Data Integrity Verified Successfully</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon={<Database size={16} />} label="Transaction Hash" value={results.hash} />
                                <InfoItem icon={<Cpu size={16} />} label="Block Number" value={results.block} />
                                <InfoItem icon={<CheckCircle size={16} />} label="Status" value={results.status} />
                                <InfoItem icon={<Database size={16} />} label="Timestamp" value={results.timestamp} />
                            </div>

                            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                <ExternalLink size={18} /> View on Etherscan
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 text-white/30 text-xs mb-1 uppercase tracking-widest">
            {icon} {label}
        </div>
        <div className="font-mono text-sm break-all">{value}</div>
    </div>
);

export default BlockchainVerification;
