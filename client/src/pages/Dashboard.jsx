import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Award,
    ChevronRight,
    BookOpen,
    Code,
    FileText
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';


const data = [
    { name: 'Mon', score: 40 },
    { name: 'Tue', score: 30 },
    { name: 'Wed', score: 65 },
    { name: 'Thu', score: 45 },
    { name: 'Fri', score: 80 },
    { name: 'Sat', score: 55 },
    { name: 'Sun', score: 90 },
];

const StatCard = ({ title, value, icon, trend, color }) => (
    <div className="glass-card stat-card">
        <div className="stat-header">
            <div className={`stat-icon ${color}`}>{icon}</div>
            {trend && <span className="stat-trend">+{trend}%</span>}
        </div>
        <div className="stat-content">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalProblems: 0,
        totalUsers: 0
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const res = await axios.get(
                'http://localhost:5000/api/dashboard/stats'
            );

            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-content">
            <div className="welcome-section">
                <h1>Hello, {user?.name} 👋</h1>
                <p>Welcome back! Let's continue your preparation journey.</p>
            </div>

            <div className="stats-grid">
    <StatCard
        title="Aptitude Questions"
        value={stats.totalQuestions}
        icon={<BookOpen size={20} />}
        color="indigo"
    />

    <StatCard
        title="Registered Users"
        value={stats.totalUsers}
        icon={<TrendingUp size={20} />}
        color="cyan"
    />

    <StatCard
        title="Coding Problems"
        value={stats.totalProblems}
        icon={<Code size={20} />}
        color="amber"
    />

    <StatCard
        title="Resume Score"
        value="85/100"
        icon={<Award size={20} />}
        color="emerald"
    />
</div>

            <div className="dashboard-main-grid">
                <div className="glass-card chart-section">
                    <div className="section-header">
                        <h2>Performance Overview</h2>
                        <select className="form-control-custom select-sm">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-list">
                        <div className="action-item" onClick={() => navigate('/aptitude')}>
                            <div className="action-icon"><BookOpen size={18} /></div>
                            <div className="action-info">
                                <h3>Practice Aptitude</h3>
                                <p>Take a quick 10-min quiz</p>
                            </div>
                            <ChevronRight size={20} />
                        </div>
                        <div className="action-item" onClick={() => navigate('/coding')}>
                            <div className="action-icon"><Code size={18} /></div>
                            <div className="action-info">
                                <h3>Solve Challenge</h3>
                                <p>Array & Strings level 1</p>
                            </div>
                            <ChevronRight size={20} />
                        </div>
                        <div className="action-item" onClick={() => navigate('/resume')}>
                            <div className="action-icon"><FileText size={18} /></div>
                            <div className="action-info">
                                <h3>Update Resume</h3>
                                <p>Analyze your latest PDF</p>
                            </div>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .welcome-section {
                    margin-bottom: 32px;
                }
                .welcome-section h1 { font-size: 32px; margin-bottom: 8px; }
                .welcome-section p { color: var(--text-muted); }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }
                .stat-card {
                    padding: 24px;
                }
                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-icon.indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
                .stat-icon.cyan { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }
                .stat-icon.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .stat-icon.emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                
                .stat-trend { font-size: 12px; color: #10b981; font-weight: 600; }
                .stat-content h3 { font-size: 24px; margin-bottom: 4px; }
                .stat-content p { color: var(--text-muted); font-size: 14px; }

                .dashboard-main-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                }
                .chart-section, .quick-actions { padding: 24px; }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .select-sm { width: auto; padding: 4px 12px; font-size: 13px; }

                .action-list { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
                .action-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid transparent;
                }
                .action-item:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: var(--glass-border);
                    transform: translateX(4px);
                }
                .action-icon {
                    width: 36px;
                    height: 36px;
                    background: var(--glass-border);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .action-info { flex: 1; }
                .action-info h3 { font-size: 15px; margin-bottom: 2px; }
                .action-info p { font-size: 12px; color: var(--text-muted); }

                @media (max-width: 1024px) {
                    .dashboard-main-grid { grid-template-columns: 1fr; }
                }
            `}} />
        </div>
    );
};

export default Dashboard;
