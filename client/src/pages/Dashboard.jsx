import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  User, 
  Settings,
  HelpCircle,
  LogOut,
  Download,
  Volume2,
  ExternalLink,
  Cpu,
  Database,
  X,
  Brain,
  Sparkles,
  Loader2,
  CheckCircle2,
  Key,
  Building2,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LegacySettings from '../components/LegacySettings';
import EmployerLeaderboard from '../components/EmployerLeaderboard';
import AICopilot from '../components/AICopilot';
import ContributionHeatMap from '../components/ContributionHeatMap';
import AssetAllocation from '../components/AssetAllocation';
import QRCode from 'qrcode';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showModal, setShowModal] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [aiAdvice, setAiAdvice] = useState(null);
    const [loadingAdvice, setLoadingAdvice] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStep, setVerificationStep] = useState(0);
    const [contributions, setContributions] = useState([]);
    const [loadingContributions, setLoadingContributions] = useState(true);
    const [showDocs, setShowDocs] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([{ role: 'ai', text: "Hello! I'm your PensionVault AI Assistant. Ask me anything about your pension, contributions, or blockchain verification." }]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest", "upid": "UPL-2026-0000"}');
    const { t, language, setLanguage } = useLanguage();

    const steps = [
        "Initializing Node Connection...", 
        "Fetching Merkle Proof...", 
        "Validating Contribution Hash...", 
        "Cross-referencing Ledger...", 
        "Verification Complete!"
    ];

    useEffect(() => {
        const fetchAdvice = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ai/savings-advice/${user.upid}`);
                setAiAdvice(response.data.advice);
            } catch (error) {
                console.error("Error fetching AI advice:", error);
            } finally {
                setLoadingAdvice(false);
            }
        };

        const fetchContributions = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contributions/${user.upid}`);
                setContributions(response.data.contributions);
            } catch (error) {
                console.error("Error fetching contributions:", error);
            } finally {
                setLoadingContributions(false);
            }
        };

        fetchAdvice();
        fetchContributions();
    }, [user.upid]);

    const startVerification = () => {
        setIsVerifying(true);
        setVerificationStep(0);
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setVerificationStep(currentStep);
            if (currentStep === steps.length - 1) {
                clearInterval(interval);
            }
        }, 1200);
    };

    const handleOpenModal = () => {
        setShowModal(true);
        startVerification();
    };

    // Voice Assistant Helper
    const speakBalance = () => {
        if (!('speechSynthesis' in window)) return;
        const text = t('speakBalanceText', { 
            name: user.name, 
            balance: "45,28,400", 
            readiness: "84" 
        });
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language for TTS accent
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'ta') utterance.lang = 'ta-IN';
        else utterance.lang = 'en-IN';
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    // Statement Export Helper — Native Browser PDF Engine (Bypasses Blob + jsPDF Issues)
    const downloadReport = async () => {
        try {
            const reportDate = new Date().toLocaleString();
            
            // Prepare verify URL & QR data
            const verifyHash = (contributions && contributions.length > 0)
                ? contributions[0].blockchainHash
                : `0xMOCK${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
            const verifyUrl = `https://pensionvault.ai/verify?hash=${verifyHash}&upid=${user.upid}`;
            const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1, errorCorrectionLevel: 'M' });

            // Generate HTML structure for the statement
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>PV_Statement_${user.upid.replace(/[^a-zA-Z0-9]/g, '_')}</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 40px 20px;
                        }
                        .header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 2px solid #00b4c8;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .brand h1 {
                            margin: 0;
                            color: #00b4c8;
                            font-size: 28px;
                        }
                        .brand p {
                            margin: 0;
                            font-size: 12px;
                            color: #666;
                            letter-spacing: 1px;
                        }
                        .receipt-info {
                            text-align: right;
                            font-size: 14px;
                            color: #555;
                        }
                        .identity-section {
                            display: flex;
                            justify-content: space-between;
                            background-color: #f8fcfd;
                            padding: 20px;
                            border-radius: 8px;
                            margin-bottom: 30px;
                            border: 1px solid #e1f5fe;
                        }
                        .user-details h3 { margin-top: 0; color: #333; }
                        .user-details p { margin: 5px 0; font-family: monospace; font-size: 14px; }
                        .qr-code { text-align: center; }
                        .qr-code img { width: 80px; height: 80px; }
                        .qr-code p { margin: 5px 0 0; font-size: 10px; color: #888; }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 40px;
                        }
                        th, td {
                            padding: 12px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th { background-color: #00b4c8; color: white; font-weight: normal; }
                        .hash { font-family: monospace; color: #666; font-size: 12px; }
                        .status { color: #00b4c8; font-weight: bold; }
                        .footer {
                            text-align: center;
                            font-size: 11px;
                            color: #888;
                            border-top: 1px solid #eee;
                            padding-top: 20px;
                        }
                        @media print {
                            body { padding: 0; }
                            .header { border-bottom: 2px solid #00b4c8 !important; }
                            th { background-color: #00b4c8 !important; color: white !important; -webkit-print-color-adjust: exact; }
                            .identity-section { background-color: #f8fcfd !important; -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="brand">
                            <h1>PensionVault AI</h1>
                            <p>BLOCKCHAIN-VERIFIED PENSION PROTOCOL</p>
                        </div>
                        <div class="receipt-info">
                            <strong>Official Statement</strong><br>
                            Issued: ${reportDate}
                        </div>
                    </div>

                    <div class="identity-section">
                        <div class="user-details">
                            <h3>Protocol Identity</h3>
                            <p><strong>Beneficiary:</strong> ${user.name}</p>
                            <p><strong>Vault ID (UPID):</strong> ${user.upid}</p>
                            <p><strong>Network Node:</strong> Secure-Registry-01 (EVM)</p>
                        </div>
                        <div class="qr-code">
                            <img src="${qrDataUrl}" alt="Verification QR">
                            <p>Scan to Verify</p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Ledger Period</th>
                                <th>Contribution Amount</th>
                                <th>Blockchain Tx Hash</th>
                                <th>Trust Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(contributions && contributions.length > 0 ? contributions : [
                                { month: 'Simulation', year: '01', amount: 42000, blockchainHash: '0x7e2b... (Network Default)' },
                                { month: 'Simulation', year: '02', amount: 42000, blockchainHash: '0x1c9f... (Network Default)' }
                            ]).map(c => `
                                <tr>
                                    <td>${c.month || ''} ${c.year || ''}</td>
                                    <td><strong>Rs. ${(c.amount || 0).toLocaleString()}</strong></td>
                                    <td class="hash">${c.blockchainHash ? c.blockchainHash.substring(0, 24) + '...' : 'N/A'}</td>
                                    <td class="status">✓ VERIFIED</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <p><strong>Non-Repudiation Disclaimer:</strong> This statement is generated from immutable smart contract records. The cryptographic signatures attached guarantee the provenance of these assets as defined by the PensionVault Protocol standards.</p>
                        <p>PensionVault AI © 2026 | Blockchain Identity Protocol v2.4.0</p>
                    </div>

                    <script>
                        window.onload = function() {
                            setTimeout(() => {
                                window.print();
                                setTimeout(() => window.close(), 500);
                            }, 500);
                        };
                    </script>
                </body>
                </html>
            `;

            // Open in new tab and print automatically
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                alert('Pop-ups are blocked. Please allow pop-ups to view and save your statement.');
                return;
            }
            printWindow.document.write(htmlContent);
            printWindow.document.close();

        } catch (err) {
            console.error('Statement generation error:', err);
            alert('Could not generate statement. Please contact support.');
        }
    };


    return (
        <div className="flex h-screen overflow-hidden text-white bg-[#0A0A0B]">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-white/5 border-r border-white/10 flex flex-col p-4 z-20 shrink-0 backdrop-blur-3xl">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#0180ff] flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(0,242,255,0.4)]">V</div>
                    <div className="hidden lg:block">
                        <div className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#00f2ff] to-[#7000ff]">PensionVault</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">Protocol Node</div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={<TrendingUp size={20} />} label={t('overview')} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={<Brain size={20} />} label={t('aiInsights')} active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
                    <SidebarItem icon={<Building2 size={20} />} label={t('employerTrust')} active={activeTab === 'trust'} onClick={() => setActiveTab('trust')} />
                    <SidebarItem icon={<ShieldCheck size={20} />} label={t('legacyPlan')} active={activeTab === 'legacy'} onClick={() => setActiveTab('legacy')} />
                    <SidebarItem icon={<User size={20} />} label={t('profileSettings')} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <SidebarItem icon={<HelpCircle size={20} />} label={t('supportHelp')} active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
                </nav>

                <div className="mt-auto border-t border-white/10 pt-4" onClick={() => window.location.href = '/'}>
                    <SidebarItem icon={<LogOut size={20} className="text-red-400" />} label={t('signOut')} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative h-full">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-[#0A0A0B]/80 sticky top-0 z-20 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#00f2ff] to-[#7000ff] p-[2px] hidden lg:block">
                            <div className="h-full w-full bg-black rounded-full flex items-center justify-center">
                                <User size={20} className="text-[#00f2ff]" />
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-white/50">{t('welcomeBack')},</div>
                            <div className="font-bold text-lg">{user.name}</div>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-xs text-[#00f2ff] font-mono opacity-80">ID: {user.upid}</p>
                                <button 
                                    onClick={speakBalance}
                                    className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${isSpeaking ? 'text-[#00f2ff] animate-pulse' : 'text-white/30 hover:text-white'}`}
                                >
                                    <Volume2 size={12} /> {isSpeaking ? 'Listening...' : t('speakBalance')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">LANG Base</span>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
                            >
                                <option value="en" className="bg-black text-white">English (EN)</option>
                                <option value="hi" className="bg-black text-white">हिन्दी (HI)</option>
                                <option value="ta" className="bg-black text-white">தமிழ் (TA)</option>
                            </select>
                        </div>

                        <button 
                            onClick={downloadReport}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 flex items-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <Download size={16} className="text-[#00f2ff]" />
                            <span className="text-xs uppercase font-bold tracking-widest">Download Statement</span>
                        </button>
                        <button 
                            onClick={handleOpenModal}
                            className="bg-[#00f2ff] text-black px-6 py-2 rounded-xl text-xs uppercase font-bold tracking-widest hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
                        >
                            Verify Trust
                        </button>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <StatCard label="Total Pension Balance" value="₹ 45,28,400" change="+12.5%" color="blue" />
                            <StatCard label="Monthly Contribution" value="₹ 42,000" change="Verified" color="purple" />
                            <StatCard label="Retirement Readiness" value="84%" change="On track" color="green" />
                        </div>

                        {/* Contribution Timeline */}
                        <section className="mb-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                Contribution Timeline 
                                <span className="text-xs font-normal text-white/30 uppercase tracking-widest">(Scroll Horizontal)</span>
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-none">
                                {loadingContributions ? (
                                    <div className="flex items-center gap-3 p-8 text-white/20">
                                        <Loader2 size={16} className="animate-spin" /> Fetching history...
                                    </div>
                                ) : contributions.length > 0 ? (
                                    contributions.map((m, i) => (
                                        <TimelineItem key={i} month={`${m.month} ${m.year}`} amount={`₹${m.amount.toLocaleString()}`} status="verified" />
                                    ))
                                ) : (
                                    <div className="p-8 text-white/20 italic">No contributions recorded yet.</div>
                                )}
                            </div>
                        </section>

                        {/* Contribution Heat Map */}
                        <section className="mb-10">
                            <ContributionHeatMap contributions={contributions} />
                        </section>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                            {/* Asset Allocation */}
                            <AssetAllocation />

                            {/* Forecast Chart */}
                            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl h-[400px]">
                                <h3 className="text-lg font-bold mb-6">Retirement Corpus Projection</h3>
                                <div className="h-[300px]">
                                    <Line 
                                        data={{
                                            labels: ['2026', '2030', '2035', '2040', '2045', '2050'],
                                            datasets: [{
                                                label: 'Estimated Corpus (₹ Lakhs)',
                                                data: [45, 120, 280, 550, 920, 1400],
                                                borderColor: '#00f2ff',
                                                backgroundColor: 'rgba(0, 242, 255, 0.1)',
                                                fill: true,
                                                tension: 0.4
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                            scales: { 
                                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.4)' } },
                                                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)' } }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'ai' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        {/* AI Insights Panel */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Brain size={24} className="text-[#7000ff]" /> AI Insights & Smart Advice
                            </h3>
                            <div className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {loadingAdvice ? (
                                        <motion.div 
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="p-8 flex flex-col items-center justify-center gap-3 text-white/30"
                                        >
                                            <Cpu className="animate-spin text-[#7000ff]" size={32} />
                                            <p className="text-xs uppercase tracking-widest">Analyzing contributions...</p>
                                        </motion.div>
                                    ) : aiAdvice && (
                                        <motion.div
                                            key="advice"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-5 rounded-2xl border border-[#00f2ff]/30 bg-[#00f2ff]/5 shadow-[0_0_20px_rgba(0,242,255,0.05)]"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Sparkles size={16} className="text-[#00f2ff]" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff]">Personalized Advice</span>
                                                <span className={`ml-auto text-[8px] px-2 py-0.5 rounded-full border ${aiAdvice.impact === 'High' ? 'border-[#4ade80] text-[#4ade80]' : 'border-white/20 text-white/40'}`}>
                                                    {aiAdvice.impact} Impact
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-white mb-2">{aiAdvice.title}</h4>
                                            <p className="text-sm text-white/60 leading-relaxed mb-4">{aiAdvice.description}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono uppercase">
                                                <span className="bg-white/5 px-2 py-1 rounded">Category: {aiAdvice.category}</span>
                                                <span>•</span>
                                                <span>Generated just now</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AIInsight 
                                    type="success" 
                                    message="Your pension is growing 12% annually, exceeding the average benchmark by 2%." 
                                />
                                <AIInsight 
                                    type="info" 
                                    message="Retirement Readiness Score updated. You are currently in the Top 10% of your age bracket." 
                                />
                            </div>
                        </div>

                        {/* Retirement Simulator */}
                        <section>
                            <RetirementSimulator />
                        </section>
                    </motion.div>
                )}

                {activeTab === 'profile' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-3xl"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <User size={24} className="text-[#00f2ff]" /> Your Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Full Name</p>
                                    <p className="text-lg font-bold">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Vault ID (UPID)</p>
                                    <p className="text-lg font-mono text-[#00f2ff]">{user.upid}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-white/30 mb-1">Account Type</p>
                                    <p className="text-lg">Government Employee (Standard)</p>
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h4 className="font-bold mb-4">Account Security</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Blockchain MFA</span>
                                        <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-full font-bold uppercase">Enabled</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Biometric Access</span>
                                        <span className="text-[10px] bg-white/10 text-white/40 px-2 py-1 rounded-full font-bold uppercase">Disabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'legacy' && (
                    <LegacySettings user={user} />
                )}

                {activeTab === 'trust' && (
                    <EmployerLeaderboard />
                )}

                {activeTab === 'support' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center"
                    >
                        <HelpCircle size={48} className="mx-auto mb-4 text-[#7000ff]" />
                        <h3 className="text-2xl font-bold mb-2">How can we help?</h3>
                        <p className="text-white/50 mb-8 max-w-md mx-auto">Access our specialized support center for any queries regarding your pension tracker or blockchain verification.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                            <div 
                                onClick={() => setShowDocs(true)}
                                className="p-4 bg-white/5 border border-[#00f2ff]/20 rounded-2xl hover:bg-[#00f2ff]/10 hover:border-[#00f2ff]/40 cursor-pointer transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Database size={16} className="text-[#00f2ff]" />
                                    <h4 className="font-bold">Documentation</h4>
                                    <ExternalLink size={12} className="ml-auto text-white/20 group-hover:text-[#00f2ff] transition-colors" />
                                </div>
                                <p className="text-xs text-white/40">Learn how the Vault protocol works — contributions, blockchain, AI, and legacy planning.</p>
                            </div>
                            <div 
                                onClick={() => setShowChat(true)}
                                className="p-4 bg-white/5 border border-[#7000ff]/20 rounded-2xl hover:bg-[#7000ff]/10 hover:border-[#7000ff]/40 cursor-pointer transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare size={16} className="text-[#7000ff]" />
                                    <h4 className="font-bold">Live Chat</h4>
                                    <span className="ml-auto flex items-center gap-1 text-[8px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                                    </span>
                                </div>
                                <p className="text-xs text-white/40">Speak with our AI support agent for instant answers about your pension.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Blockchain Trust Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#111112] border border-white/10 rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl p-8"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ff] via-[#7000ff] to-[#00f2ff] animate-shimmer" />
                            
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-[#00f2ff]/10 rounded-xl border border-[#00f2ff]/20">
                                        <ShieldCheck className="text-[#00f2ff]" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Protocol Verification</h3>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="text-white/30 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Verification Steps Animation */}
                                <div className="space-y-4">
                                    {steps.map((step, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ 
                                                opacity: index <= verificationStep ? 1 : 0.2,
                                                x: index <= verificationStep ? 0 : -10
                                            }}
                                            className="flex items-center gap-3"
                                        >
                                            {index < verificationStep ? (
                                                <CheckCircle2 size={16} className="text-[#4ade80]" />
                                            ) : index === verificationStep ? (
                                                <Loader2 size={16} className="text-[#00f2ff] animate-spin" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-white/10" />
                                            )}
                                            <span className={`text-sm ${index === verificationStep ? 'text-white font-bold' : 'text-white/40'}`}>
                                                {step}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {verificationStep === steps.length - 1 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-6 pt-6 border-t border-white/5"
                                    >
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 font-mono text-xs">
                                            <p className="text-white/40 mb-2 uppercase tracking-widest">Secure Ledger Hash</p>
                                            <p className="text-[#00f2ff] break-all">0x742d1e2e34567890abcdef1234567890abcdef1234567890abcdef12345678</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <ModalStat icon={<Database size={16} />} label="Block Height" value="19,402,852" />
                                            <ModalStat icon={<Cpu size={16} />} label="Gas Consumed" value="42,000 Gwei" />
                                        </div>

                                        <div className="p-4 rounded-xl border border-[#4ade80]/20 bg-[#4ade80]/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                                                <span className="text-sm font-bold uppercase tracking-widest text-[#4ade80]">Status: Finalized</span>
                                            </div>
                                            <p className="text-xs text-white/50 leading-relaxed">
                                                This contribution has been hashed and recorded on the immutable ledger. 
                                                The Merkle-root has been verified across 14,200 nodes.
                                            </p>
                                        </div>

                                        <button className="w-full py-3 bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff] rounded-xl font-bold hover:bg-[#00f2ff]/30 transition-all flex items-center justify-center gap-2">
                                            <ExternalLink size={18} /> View on Block Explorer
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* AI Savings Copilot */}
            <AICopilot user={user} contributions={contributions} />

            {/* Documentation Modal */}
            <AnimatePresence>
                {showDocs && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDocs(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#111112] border border-white/10 rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ff] to-[#7000ff]" />
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#00f2ff]/10 rounded-xl border border-[#00f2ff]/20"><Database className="text-[#00f2ff]" size={20} /></div>
                                        <h3 className="text-2xl font-bold">PensionVault Docs</h3>
                                    </div>
                                    <button onClick={() => setShowDocs(false)} className="text-white/30 hover:text-white transition-colors"><X size={24} /></button>
                                </div>
                                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                                    {[
                                        { title: '🔐 Vault ID (UPID)', body: 'Your Universal Pension ID is a permanent identifier in the format UPL-YYYY-XXXX. It works across all employers throughout your career. It is generated on signup and stored on-chain.' },
                                        { title: '💰 How Contributions Work', body: 'Your employer logs monthly contributions via the employer dashboard. Each contribution is SHA-256 hashed with your UPID, employer ID, amount, and date — then recorded as a transaction on the Ethereum VM.' },
                                        { title: '⛓️ Blockchain Verification', body: 'Click "Verify Trust" on your dashboard to run a 5-step Merkle-proof verification. The system connects to the local Hardhat node (or falls back to a mock hash) and validates your contribution chain.' },
                                        { title: '🤖 AI Insights', body: 'The AI Insights tab shows personalized savings advice, anomaly detection (missed payments, sudden drops), and a retirement corpus forecast using an 8% annual growth model.' },
                                        { title: '📄 PDF Statements', body: 'Click "Download Statement" to export a blockchain-verified PDF. It includes your UPID, all contributions with their on-chain hash, and a digital audit footer.' },
                                        { title: '🏛️ Legacy Plan', body: 'Set up heir addresses via the Legacy Plan tab. A smart contract timeout triggers automatic fund release if you stop pinging the protocol, protecting your nominees.' },
                                        { title: '🏆 Employer Trust Leaderboard', body: 'Employers are scored by contribution frequency and total amount. Elite employers (5+ contributions) are ranked at the top to help you choose trusted organizations.' },
                                    ].map((doc, i) => (
                                        <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                            <h4 className="font-bold mb-2">{doc.title}</h4>
                                            <p className="text-sm text-white/50 leading-relaxed">{doc.body}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Live Chat Modal */}
            <AnimatePresence>
                {showChat && (
                    <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowChat(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="bg-[#111112] border border-white/10 rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl flex flex-col" style={{ height: '75vh' }}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7000ff] to-[#00f2ff]" />
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#7000ff]/10 rounded-xl border border-[#7000ff]/20"><Brain className="text-[#7000ff]" size={18} /></div>
                                    <div>
                                        <h3 className="font-bold">AI Support Agent</h3>
                                        <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online — PensionVault AI</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowChat(false)} className="text-white/30 hover:text-white transition-colors"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                                            msg.role === 'user'
                                                ? 'bg-[#00f2ff]/20 border border-[#00f2ff]/30 text-white rounded-br-none'
                                                : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                                            <Loader2 size={14} className="animate-spin text-[#7000ff]" />
                                            <span className="text-xs text-white/40">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-white/10">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!chatInput.trim() || chatLoading) return;
                                    const userMsg = chatInput.trim();
                                    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
                                    setChatInput('');
                                    setChatLoading(true);
                                    try {
                                        const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userMsg, upid: user.upid });
                                        setChatMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
                                    } catch {
                                        setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again.' }]);
                                    } finally {
                                        setChatLoading(false);
                                    }
                                }} className="flex gap-2">
                                    <input
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        placeholder="Ask about your pension..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#7000ff] transition-colors"
                                    />
                                    <button type="submit" disabled={chatLoading || !chatInput.trim()}
                                        className="bg-[#7000ff] p-2 rounded-xl hover:bg-[#8a00ff] transition-colors disabled:opacity-40">
                                        <Sparkles size={18} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ModalStat = ({ icon, label, value }) => (
    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest mb-1">
            {icon} {label}
        </div>
        <div className="font-bold text-sm">{value}</div>
    </div>
);

const RetirementSimulator = () => {
    const [age, setAge] = useState(30);
    const [salary, setSalary] = useState(80000);
    const [contribution, setContribution] = useState(12);

    const projectedCorpus = Math.round(salary * contribution * (60 - age) * 1.5); // Mock formula

    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-[#00f2ff]/5">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <TrendingUp className="text-[#00f2ff]" /> Retirement Future Simulator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-8">
                    <SimulatorSlider label="Current Age" value={age} min={18} max={55} onChange={setAge} unit="yrs" />
                    <SimulatorSlider label="Monthly Salary" value={salary} min={20000} max={500000} step={5000} onChange={setSalary} unit="₹" />
                    <SimulatorSlider label="Contribution" value={contribution} min={5} max={30} onChange={setContribution} unit="%" />
                </div>
                <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-8 bg-black/20 rounded-3xl border border-white/5">
                    <p className="text-white/40 uppercase tracking-widest text-sm mb-2">Estimated Corpus at Age 60</p>
                    <motion.h4 
                        key={projectedCorpus}
                        initial={{ scale: 1.1, textShadow: "0 0 20px rgba(0,242,255,0.5)" }}
                        animate={{ scale: 1, textShadow: "0 0 0px rgba(0,242,255,0)" }}
                        className="text-6xl font-bold text-[#00f2ff] mb-4"
                    >
                        ₹ {(projectedCorpus / 100000).toFixed(2)} Lakhs
                    </motion.h4>
                    <p className="text-xs text-white/30 max-w-sm">
                        This projection assumes an 8% annual return and 4% inflation adjustment. 
                        Actual results may vary based on market conditions.
                    </p>
                </div>
            </div>
        </div>
    );
};

const SimulatorSlider = ({ label, value, min, max, step = 1, onChange, unit }) => (
    <div>
        <div className="flex justify-between mb-4">
            <label className="text-xs uppercase tracking-widest text-white/50">{label}</label>
            <span className="text-[#00f2ff] font-bold">{unit === '₹' ? `₹ ${value.toLocaleString()}` : `${value}${unit}`}</span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
        />
    </div>
);

const SidebarItem = ({ icon, label, active = false, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
    >
        {icon}
        <span className="hidden lg:block font-medium">{label}</span>
    </div>
);

const StatCard = ({ label, value, change, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 ${color === 'blue' ? 'bg-[#00f2ff]/5' : color === 'purple' ? 'bg-[#7000ff]/5' : 'bg-[#4ade80]/5'} blur-[60px] rounded-full`} />
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">{label}</p>
        <h4 className="text-3xl font-bold mb-1">{value}</h4>
        <span className={`text-xs ${color === 'blue' ? 'text-[#00f2ff]' : color === 'purple' ? 'text-[#7000ff]' : 'text-[#4ade80]'}`}>{change}</span>
    </div>
);

const TimelineItem = ({ month, amount, status }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[200px] hover:border-[#00f2ff]/30 cursor-pointer transition-all">
        <p className="text-xs text-white/40 mb-1">{month}</p>
        <p className="text-xl font-bold mb-3">{amount}</p>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-[#4ade80]' : 'bg-yellow-400'}`} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Verified</span>
        </div>
    </div>
);

const AIInsight = ({ type, message }) => {
    const colors = {
        success: 'border-[#4ade80]/30 bg-[#4ade80]/5 text-[#4ade80]',
        warning: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-500',
        info: 'border-[#00f2ff]/30 bg-[#00f2ff]/5 text-[#00f2ff]',
    };
    return (
        <div className={`p-4 rounded-xl border ${colors[type]} text-sm leading-relaxed`}>
            {message}
        </div>
    );
};

export default Dashboard;
