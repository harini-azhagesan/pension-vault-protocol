import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Users, FileText, CheckCircle, Search } from 'lucide-react';

const EmployerDashboard = () => {
    const [dragActive, setDragActive] = useState(false);

    return (
        <div className="p-10 max-w-7xl mx-auto">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold mb-2">Employer <span className="neon-text-purple">Console</span></h2>
                    <p className="text-white/50">Manage employee contributions and compliance status.</p>
                </div>
                <div className="flex gap-4">
                    <button className="neon-button-purple">Export Report</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2">
                    <div 
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
                        className={`glass-card border-dashed border-2 transition-all h-80 flex flex-col items-center justify-center ${dragActive ? 'border-neon-purple bg-secondary/5' : 'border-white/10'}`}
                    >
                        <div className="p-6 bg-white/5 rounded-full mb-4">
                            <Upload className="text-neon-purple" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload Monthly Data</h3>
                        <p className="text-white/40 mb-6 text-center max-w-xs">Drag and drop your CSV/XLSX file here to process employee contributions.</p>
                        <input type="file" className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                            Browse Files
                        </label>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Recent Uploads</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input 
                                    type="text" 
                                    className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-purple"
                                    placeholder="Search entries..."
                                />
                            </div>
                        </div>
                        
                        <div className="glass-card p-0 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Batch ID</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Date</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Employees</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Amount</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { id: 'BATCH-402', date: 'Mar 15, 2026', count: 124, amount: '₹5,24,000', status: 'Success' },
                                        { id: 'BATCH-398', date: 'Feb 12, 2026', count: 124, amount: '₹5,20,000', status: 'Success' },
                                        { id: 'BATCH-392', date: 'Jan 10, 2026', count: 122, amount: '₹5,10,000', status: 'Success' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-neon-purple">{row.id}</td>
                                            <td className="px-6 py-4">{row.date}</td>
                                            <td className="px-6 py-4">{row.count}</td>
                                            <td className="px-6 py-4 font-bold">{row.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-md bg-accent/20 text-accent text-[10px] font-bold uppercase">Processed</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="glass-card">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="text-neon-blue" />
                            <h4 className="font-bold">Compliance Overview</h4>
                        </div>
                        <div className="space-y-4">
                            <ComplianceMetric label="Contribution Rate" value="98%" color="green" />
                            <ComplianceMetric label="KYC Verified" value="100%" color="blue" />
                            <ComplianceMetric label="Blockchain Sync" value="Syncing..." color="purple" />
                        </div>
                    </div>

                    <div className="glass-card relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FileText className="mb-4 text-neon-blue" size={32} />
                        <h4 className="font-bold mb-2">Annual Audit Report</h4>
                        <p className="text-sm text-white/40 mb-4">View and download your organization's annual pension audit compliant with GOV-PENS-2026.</p>
                        <button className="text-xs font-bold text-neon-blue uppercase tracking-widest hover:underline">Download PDF</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ComplianceMetric = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-white/40">{label}</span>
            <span className={`text-neon-${color}`}>{value}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '90%' }}
                className={`h-full bg-neon-${color}`} 
            />
        </div>
    </div>
);

export default EmployerDashboard;
