import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Key, AlertOctagon, CheckCircle2, Loader2, Users, ShieldAlert, Timer } from 'lucide-react';
import axios from 'axios';

const LegacySettings = ({ user }) => {
    const [heirAddress, setHeirAddress] = useState('');
    const [timeoutPeriod, setTimeoutPeriod] = useState(31536000); 
    const [loading, setLoading] = useState(false);
    const [pingLoading, setPingLoading] = useState(false);
    const [claimLoading, setClaimLoading] = useState(false);
    const [heirInfo, setHeirInfo] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchHeirInfo = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/legacy/${user.upid}`);
            if (res.data.heirs && res.data.heirs.length > 0) {
                setHeirInfo(res.data);
                setHeirAddress(res.data.heirs.join(', '));
            }
        } catch (err) {
            console.error("Error fetching heir info:", err);
        }
    };

    useEffect(() => {
        fetchHeirInfo();
    }, [user.upid]);

    const handleSetHeir = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/legacy/set-heir`, {
                upid: user.upid,
                heirAddress,
                timeoutSeconds: timeoutPeriod
            });
            setMessage({ type: 'success', text: 'Beneficiaries securely locked onto the blockchain!' });
            fetchHeirInfo();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || err.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePing = async () => {
        setPingLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/legacy/ping`, { upid: user.upid });
            setMessage({ type: 'success', text: 'Heartbeat pinged! Countdown reset & any pending claims cancelled.' });
            fetchHeirInfo();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || err.message });
        } finally {
            setPingLoading(false);
        }
    };

    const handleInitiateClaim = async () => {
        setClaimLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/legacy/claim-initiate`, { upid: user.upid });
            setMessage({ type: 'success', text: 'Claim initiated. 3-day safety timelock has started.' });
            fetchHeirInfo();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || err.message });
        } finally {
            setClaimLoading(false);
        }
    };

    const handleExecuteClaim = async () => {
        setClaimLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/legacy/claim-execute`, { upid: user.upid });
            setMessage({ type: 'success', text: 'Inheritance executed. Protocol finalized.' });
            fetchHeirInfo();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || err.message });
        } finally {
            setClaimLoading(false);
        }
    };

    const isClaimPending = heirInfo && heirInfo.claimTimestamp !== "0";
    const TIMELOCK_SECONDS = 3 * 24 * 60 * 60; // 3 Days match contract

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-12"
        >
            <div className="bg-white/5 border border-[#ef4444]/20 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ef4444]/5 blur-[80px] rounded-full pointer-events-none" />
                
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <ShieldAlert className="text-[#ef4444]" /> Dead Man's Switch (V2)
                </h3>
                <p className="text-white/50 max-w-2xl mb-8 leading-relaxed">
                    Automated inheritance with **3-Day Timelock Protection**. If you fail to ping, heirs must wait 72 hours before claiming, giving you a final window to cancel the protocol.
                </p>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${message.type === 'success' ? 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#4ade80]' : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'}`}>
                        <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                        <span className="text-sm">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Heir Setup Form */}
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Users size={20} className="text-[#00f2ff]" /> Multi-Heir Designates
                        </h4>
                        <form onSubmit={handleSetHeir} className="space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Heir Wallet Addresses (Comma separated)</label>
                                <textarea 
                                    value={heirAddress}
                                    onChange={(e) => setHeirAddress(e.target.value)}
                                    placeholder="0x..., 0x..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00f2ff] focus:bg-white/10 transition-all font-mono text-xs min-h-[80px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Absence Period (Before claim is possible)</label>
                                <select 
                                    value={timeoutPeriod}
                                    onChange={(e) => setTimeoutPeriod(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00f2ff] focus:bg-[#111] transition-all text-sm"
                                >
                                    <option value={60}>1 Minute (FOR TESTING)</option>
                                    <option value={86400}>1 Day</option>
                                    <option value={31536000}>1 Year</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-[#ef4444] border border-[#ef4444]/50 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Lock Inheritance Protocol'}
                            </button>
                        </form>
                    </div>

                    {/* Ping Heartbeat Panel */}
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
                        <div>
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <HeartPulse size={20} className="text-[#4ade80]" /> Vitality Heartbeat
                            </h4>
                            
                            {heirInfo && heirInfo.lastPing !== "0" ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#4ade80]/5 border border-[#4ade80]/20 rounded-xl font-mono text-xs text-[#4ade80]">
                                        Last Ping: {new Date(Number(heirInfo.lastPing) * 1000).toLocaleString()}<br/>
                                        Protocol Status: {heirInfo.isDeceased ? 'FINALIZED / TRANSFERRED' : isClaimPending ? 'CLAIM PENDING (TIMELOCK ACTIVE)' : 'PROTECTED / ACTIVE'}
                                    </div>
                                    
                                    {isClaimPending && (
                                        <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
                                            <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-widest mb-2">
                                                <Timer size={14} /> Security Timelock Count-up
                                            </div>
                                            <p className="text-[10px] text-white/50 mb-3">
                                                A claim was initiated on {new Date(Number(heirInfo.claimTimestamp) * 1000).toLocaleString()}. Heirs can execute after 72 hours.
                                            </p>
                                            <button 
                                                onClick={handleExecuteClaim}
                                                disabled={claimLoading}
                                                className="w-full py-2 bg-yellow-400 text-black rounded-lg text-xs font-bold uppercase hover:bg-yellow-500 transition-all"
                                            >
                                                {claimLoading ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Finalize & Execute Transfer'}
                                            </button>
                                        </div>
                                    )}

                                    {!isClaimPending && !heirInfo.isDeceased && (
                                        <button 
                                            onClick={handleInitiateClaim}
                                            disabled={claimLoading}
                                            className="w-full py-2 bg-white/5 border border-white/10 text-white/40 rounded-lg text-[10px] font-bold uppercase hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            [Heir Mode] Initiate Inheritance Claim
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-white/30 italic">No heartbeat history detected. Lock the protocol first.</p>
                            )}
                        </div>

                        <button 
                            onClick={handlePing}
                            disabled={pingLoading || !heirInfo || heirInfo.isDeceased}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all mt-auto flex items-center justify-center gap-2 ${(!heirInfo || heirInfo.isDeceased) ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-[#4ade80] text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.4)]'}`}
                        >
                            {pingLoading ? <Loader2 className="animate-spin" size={20} /> : <><HeartPulse size={20} /> Ping Network (I am alive)</>}
                        </button>
                    </div>

                    {/* Protocol Risks & Limitations */}
                    <div className="md:col-span-2 mt-4 bg-[#ef4444]/5 border border-[#ef4444]/20 p-6 rounded-2xl relative overflow-hidden">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-[#ef4444]">
                            <AlertOctagon size={16} /> Safety Rectifications Installed (V2)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/50 leading-relaxed">
                            <div>
                                <strong className="text-white/80 block mb-1">1. 72-Hour Timelock Safety Buffer</strong>
                                Inheritance claims no longer execute instantly. If a claim is triggered, a 3-day clock starts. Any activity (Ping) by you during this window automatically destroys the pending claim.
                            </div>
                            <div>
                                <strong className="text-white/80 block mb-1">2. Multi-Heir Decentralization</strong>
                                You can now set multiple wallet addresses. Upon execution, the smart contract records all designates as authorized owners, reducing the risk of a single lost wallet.
                            </div>
                            <div>
                                <strong className="text-white/80 block mb-1">3. Automated Cancellation</strong>
                                If a malicious heir tries to claim your funds while you are alive, your next "Ping" will not only reset the timer but also cancel their claim and rotate security keys.
                            </div>
                            <div>
                                <strong className="text-white/80 block mb-1">4. Prototype Mode</strong>
                                This version runs on a local Hardhat node. For mainnet deployment, an Oracle (Chainlink) would be used to verify official death certificate APIs.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LegacySettings;
