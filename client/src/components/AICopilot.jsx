import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, User, Cpu, X, Minimize2, Maximize2, Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AICopilot = ({ user, contributions }) => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: t('copilotGreeting') || `Hello ${user.name}! I'm your Vault Savings Copilot. I've analyzed your ${contributions?.length || 0} contributions. How can I help you optimize your retirement today?` }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(true);
    const scrollRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            
            // Map language codes
            if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
            else if (language === 'ta') recognitionRef.current.lang = 'ta-IN';
            else recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [language]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInput(''); // clear input when starting to listen
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakResponse = (text) => {
        if (!autoSpeak || !('speechSynthesis' in window)) return;
        const utterance = new SpeechSynthesisUtterance(text);
        if (language === 'hi') utterance.lang = 'hi-IN';
        else if (language === 'ta') utterance.lang = 'ta-IN';
        else utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        // Simulated AI Logic for Prototype
        setTimeout(() => {
            let response = "";
            const lowerMsg = userMessage.toLowerCase();

            if (lowerMsg.includes('balance') || lowerMsg.includes('how much') || lowerMsg.includes('शेष') || lowerMsg.includes('இருப்பு')) {
                const total = contributions?.reduce((acc, c) => acc + c.amount, 0) || 0;
                response = `Based on the blockchain ledger, your total recorded balance is ₹${total.toLocaleString()}. You're doing great!`;
                if(language === 'hi') response = `ब्लॉकचेन लेजर के अनुसार, आपका कुल रिकॉर्ड किया गया शेष शून्य है क्योंकि आपने अब तक निवेश नहीं किया है।`;
                if(language === 'ta') response = `பிளாக்செயின் லெட்ஜரின்படி, பதிவுசெய்யப்பட்ட உங்கள் மொத்த இருப்பு ₹${total.toLocaleString()} ஆகும். சிறப்பான தொடக்கம்!`;
            } else if (lowerMsg.includes('optimize') || lowerMsg.includes('improve') || lowerMsg.includes('save more')) {
                response = "To hit your ₹1.4 Crore goal by 2050, I recommend increasing your monthly contribution by just 5%. This small shift could add ₹12 Lakhs to your final corpus due to compound interest.";
                if(language === 'hi') response = "२०५० तक अपने ₹१.४ करोड़ के लक्ष्य तक पहुँचने के लिए, मैं आपके मासिक योगदान को केवल ५% बढ़ाने की सलाह देता हूँ।";
                if(language === 'ta') response = "2050 ஆம் ஆண்டளவில் உங்கள் ₹1.4 கோடி இலக்கை எட்ட, உங்கள் மாதாந்திர பங்களிப்பை 5% அதிகரிக்கப் பரிந்துரைக்கிறேன்.";
            } else if (lowerMsg.includes('tax')) {
                response = "Your current contributions qualify for Section 80C deductions. If you increase your voluntary contribution by ₹5,000, you could save an additional ₹1,500 in monthly tax liabilities.";
            } else if (lowerMsg.includes('safe') || lowerMsg.includes('blockchain')) {
                response = "Every rupee is secured via a SHA-256 hash on our decentralized ledger. Even if this UI goes down, your funds are permanently locked and verifiable on-chain.";
            } else {
                response = "That's a great question! I'm currently monitoring your contribution consistency. Is there anything specific about your retirement timeline or legacy plan you'd like to discuss?";
                if(language === 'hi') response = "यह एक अच्छा सवाल है! क्या आप अपनी सेवानिवृत्ति समयरेखा या विरासत योजना के बारे में कुछ विशिष्ट चर्चा करना चाहेंगे?";
                if(language === 'ta') response = "இது ஒரு நல்ல கேள்வி! உங்கள் ஓய்வு காலவரிசை அல்லது மரபுத் திட்டத்தைப் பற்றி நீங்கள் குறிப்பாக விவாதிக்க விரும்புகிறீர்களா?";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            speakResponse(response);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating FAB */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-6 flex items-center gap-2 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] rounded-2xl px-4 py-3 shadow-[0_0_30px_rgba(0,242,255,0.4)] z-50 group"
                >
                    <MessageSquare size={20} className="text-white shrink-0" />
                    <span className="text-white text-sm font-bold tracking-wide">AI Chat</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0A0A0B] animate-pulse" />
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            height: isMinimized ? '60px' : '500px'
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-full max-w-[380px] bg-[#111112] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#00f2ff]/10 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-[#00f2ff]/30">
                                    <Sparkles size={16} className="text-[#00f2ff]" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">Savings Copilot</h4>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[8px] text-white/30 uppercase tracking-tighter">AI Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setAutoSpeak(!autoSpeak)} className={`p-2 rounded-lg transition-all ${autoSpeak ? 'text-[#00f2ff] bg-[#00f2ff]/10' : 'text-white/20 hover:text-white hover:bg-white/5'}`} title="Toggle Voice Response">
                                    <Volume2 size={14} />
                                </button>
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                    {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div 
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
                                >
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1 border ${msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-[#7000ff]/10 border-[#7000ff]/30'}`}>
                                                    {msg.role === 'user' ? <User size={12} className="text-white/40" /> : <Cpu size={12} className="text-[#7000ff]" />}
                                                </div>
                                                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#00f2ff] text-black font-medium' : 'bg-white/5 text-white/70 border border-white/5'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-2 p-3 bg-white/5 border border-white/5 rounded-2xl">
                                                <div className="flex gap-1">
                                                    <div className="w-1 h-1 bg-[#00f2ff] rounded-full animate-bounce" />
                                                    <div className="w-1 h-1 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <div className="w-1 h-1 bg-[#00f2ff] rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5">
                                    <div className="relative flex items-center gap-2">
                                        <button 
                                            type="button"
                                            onClick={toggleListening}
                                            className={`p-3 rounded-xl transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                                            title="Voice Input"
                                        >
                                            {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                                        </button>
                                        <div className="relative flex-1">
                                            <input 
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder={isListening ? t('saySomething') || "Listening..." : t('typeMessage') || "Ask about your savings..."}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs outline-none focus:border-[#00f2ff] transition-all"
                                            />
                                            <button 
                                                type="submit"
                                                className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all ${input.trim() ? 'bg-[#00f2ff] text-black hover:shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                                                disabled={!input.trim()}
                                            >
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[8px] text-white/20 mt-2 text-center uppercase tracking-widest">Powered by PensionVault Neural Network v4.2</p>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AICopilot;
