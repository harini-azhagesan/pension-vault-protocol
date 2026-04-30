import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Fingerprint, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate success and auto-login as the demo user
      localStorage.setItem('user', JSON.stringify({ upid: 'UPL-2026-8402', name: 'Harini Sundar', role: 'Employee' }));
      navigate('/dashboard');
    }, 4000);
  };

  return (
    <div className="min-h-screen flex bg-[#050505] selection:bg-primary/30 selection:text-primary overflow-hidden">
      {/* Left Side: Cinematic Hero */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0a0a0b]"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-background opacity-60" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background via-transparent to-background opacity-40" />
        
        <img 
          src="/vault-hero.png" 
          alt="Digital Vault" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-80"
        />

        <div className="relative z-20 p-16 flex flex-col justify-end h-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <Globe size={12} />
              Global Pension Ledger v2.0
            </div>
            <h2 className="text-6xl font-black tracking-tighter leading-none mb-6">
              SECURE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">FUTURE LEGACY.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-12">
              The world's first cryptographically verified universal pension system. Managed by AI, secured by the chain.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-primary font-bold text-xl mb-1">99.9%</div>
                <div className="text-white/30 text-xs uppercase tracking-tighter">Uptime Protocol</div>
              </div>
              <div>
                <div className="text-secondary font-bold text-xl mb-1">256-bit</div>
                <div className="text-white/30 text-xs uppercase tracking-tighter">Standard Encryption</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Abstract background glows */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-secondary/10 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShieldCheck className="text-primary" size={24} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Pension<span className="text-primary">Vault</span></h1>
              </div>
              
              <div className="flex gap-1.5 p-1 rounded-lg bg-white/5 border border-white/5">
                {['en', 'hi', 'ta'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      language === lang 
                        ? 'bg-primary text-black' 
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <h3 className="text-3xl font-display font-bold mb-2">{t('welcomeBack')}</h3>
            <p className="text-white/40">Provide your credentials to access your secure ledger.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Identity Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-12"
                  placeholder="name@organization.gov"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Secure Access Key</label>
                <a href="#" className="text-[10px] uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">Forgot Key?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-secondary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-12 focus:border-secondary/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button 
                type="submit"
                disabled={loading || isScanning}
                className="w-full relative group overflow-hidden bg-primary text-black py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all duration-300 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-105" />
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Secure Vault</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              <button 
                type="button"
                onClick={handleBiometricScan}
                disabled={loading || isScanning}
                className="w-full py-4 rounded-xl border border-white/10 text-white/60 font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3 group"
              >
                <Fingerprint size={20} className="group-hover:text-primary transition-colors" />
                Vault Sentry™ Biometric Access
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/30">
              New identity? <Link to="/signup" className="text-primary hover:text-white transition-colors">Create Access Portal</Link>
            </div>
            <div className="flex items-center gap-4 text-white/20">
               <Fingerprint size={20} className="hover:text-primary transition-colors cursor-pointer" />
               <ShieldCheck size={20} className="hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
          
          {/* Biometric Scanning Overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center"
              >
                <div className="relative mb-12">
                   {/* Scanning Glows */}
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                   />
                   
                   <div className="relative w-48 h-48 border-2 border-primary/20 rounded-full flex items-center justify-center overflow-hidden">
                      <Fingerprint size={100} className="text-primary/40" />
                      
                      {/* Scanning Line */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_#00f2ff] z-10"
                      />
                   </div>
                </div>
                
                <h2 className="text-2xl font-bold tracking-tighter mb-2">Vault Sentry™</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold">Scanning Biometric Data...</p>
                </div>
                
                <div className="mt-12 flex gap-4">
                   <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/30 uppercase tracking-widest leading-none">
                      PVE Auth ID: 8829-X
                   </div>
                   <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/30 uppercase tracking-widest leading-none">
                      Network Node: SECURE-01
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Professional Compliance Section */}
          <div className="mt-8 grid grid-cols-3 gap-4 opacity-50">
            <div className="flex flex-col items-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <CheckCircle2 size={16} className="text-primary mb-1" />
              <span className="text-[8px] uppercase tracking-widest text-white/60">ISO 27001</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <Lock size={16} className="text-secondary mb-1" />
              <span className="text-[8px] uppercase tracking-widest text-white/60">GDPR Ready</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
              <Globe size={16} className="text-white/40 mb-1" />
              <span className="text-[8px] uppercase tracking-widest text-white/60">EVM Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

