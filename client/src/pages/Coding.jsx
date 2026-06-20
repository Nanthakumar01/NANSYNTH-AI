import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Code, Search, Filter, ChevronRight, Zap } from 'lucide-react';

const Coding = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/coding');
            setProblems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProblems = filter === 'All' 
        ? problems 
        : problems.filter(p => p.difficulty === filter);

    if (loading) return <div className="loading-screen">Loading Challenges...</div>;

    return (
        <div className="coding-container">
            <div className="header-flex">
                <div>
                    <h1>Coding Practice</h1>
                    <p>Sharpen your algorithm skills with our curated challenges.</p>
                </div>
                <div className="filter-box">
                    <button 
                        className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
                        onClick={() => setFilter('All')}
                    >All</button>
                    <button 
                        className={`filter-btn ${filter === 'Easy' ? 'active' : ''}`}
                        onClick={() => setFilter('Easy')}
                    >Easy</button>
                    <button 
                        className={`filter-btn ${filter === 'Medium' ? 'active' : ''}`}
                        onClick={() => setFilter('Medium')}
                    >Medium</button>
                    <button 
                        className={`filter-btn ${filter === 'Hard' ? 'active' : ''}`}
                        onClick={() => setFilter('Hard')}
                    >Hard</button>
                </div>
            </div>

            <div className="problem-list">
                {filteredProblems.length === 0 ? (
                    <div className="empty-state">No challenges found in this category.</div>
                ) : (
                    filteredProblems.map(problem => (
                        <div key={problem._id} className="glass-card problem-card" onClick={() => navigate(`/editor/${problem._id}`)}>
                            <div className="problem-main">
                                <div className="problem-status">
                                    <Code size={20} />
                                </div>
                                <div className="problem-info">
                                    <h3>{problem.title}</h3>
                                    <div className="problem-meta">
                                        <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                                            {problem.difficulty}
                                        </span>
                                        <span className="dot">•</span>
                                        <span className="category-meta">{problem.category}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="solve-btn">
                                Solve <ChevronRight size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .header-flex { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-end; 
                    margin-bottom: 32px; 
                }
                .filter-box {
                    display: flex;
                    gap: 8px;
                    background: var(--glass-border);
                    padding: 4px;
                    border-radius: 10px;
                }
                .filter-btn {
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }
                .filter-btn.active {
                    background: var(--primary);
                    color: white;
                }
                .problem-list { display: flex; flex-direction: column; gap: 16px; }
                .problem-card {
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .problem-card:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: var(--primary);
                    transform: translateX(4px);
                }
                .problem-main { display: flex; align-items: center; gap: 20px; }
                .problem-status {
                    width: 44px;
                    height: 44px;
                    background: var(--glass-border);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                }
                .problem-info h3 { font-size: 18px; margin-bottom: 4px; }
                .problem-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; }
                .difficulty-badge.easy { color: #10b981; }
                .difficulty-badge.medium { color: #f59e0b; }
                .difficulty-badge.hard { color: #ef4444; }
                .dot { color: var(--text-muted); }
                .category-meta { color: var(--text-muted); }
                .solve-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: var(--glass-border);
                    border: 1px solid var(--glass-border);
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .problem-card:hover .solve-btn {
                    background: var(--primary);
                    border-color: var(--primary);
                }
                .empty-state { text-align: center; padding: 60px; color: var(--text-muted); font-style: italic; }
            `}} />
        </div>
    );
};

export default Coding;
