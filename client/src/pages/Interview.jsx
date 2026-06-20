import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Loader2, Play, ChevronRight, ChevronDown, CheckCircle2, Info, UserCircle } from 'lucide-react';

const Interview = () => {
    const [role, setRole] = useState('Frontend Developer');
    const [generating, setGenerating] = useState(false);
    const [session, setSession] = useState(null);
    const [history, setHistory] = useState([]);
    const [expandedIdx, setExpandedIdx] = useState(null);

    const roles = [
        'Frontend Developer', 
        'Backend Developer', 
        'Full Stack Developer', 
        'Software Engineer', 
        'Data Scientist', 
        'DevOps Engineer',
        'Mobile Developer'
    ];

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/interview/history');
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await axios.post('http://localhost:5000/api/interview/generate', { role });
            setSession(res.data);
            fetchHistory();
        } catch (err) {
            alert('Generation failed. Please check your Gemini API key.');
        } finally {
            setGenerating(false);
        }
    };

    const QuestionCard = ({ q, idx }) => (
        <div className={`glass-card question-accordion ${expandedIdx === idx ? 'expanded' : ''}`}>
            <div className="accordion-header" onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}>
                <div className="header-main">
                    <span className={`cat-tag ${q.category.toLowerCase()}`}>{q.category}</span>
                    <h3>{q.question}</h3>
                </div>
                {expandedIdx === idx ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            {expandedIdx === idx && (
                <div className="accordion-body">
                    <div className="answer-hint">
                        <div className="hint-label"><CheckCircle2 size={16} /> Suggested Answer / Key Points</div>
                        <p>{q.suggestedAnswer}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="interview-container">
            <div className="header-flex">
                <div>
                    <h1>AI Interview Generator</h1>
                    <p>Get personalized interview questions based on your target career role.</p>
                </div>
            </div>

            <div className="interview-grid">
                <div className="generator-settings">
                    <div className="glass-card settings-card">
                        <h2>Selection</h2>
                        <div className="form-group mt-4">
                            <label><UserCircle size={16} /> Target Role</label>
                            <select 
                                className="form-control-custom role-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <button 
                            className="btn-primary-custom w-100 mt-4" 
                            disabled={generating}
                            onClick={handleGenerate}
                        >
                            {generating ? <><Loader2 className="animate-spin" size={18} /> Generating...</> : <><Play size={18} /> Generate Questions</>}
                        </button>
                    </div>

                    <div className="glass-card history-card mt-4">
                        <h3>Session History</h3>
                        <div className="history-list">
                            {history.length === 0 ? <p className="empty-text">No previous sessions.</p> : 
                                history.map(item => (
                                    <div key={item._id} className="history-item" onClick={() => setSession(item)}>
                                        <MessageSquare size={16} />
                                        <div className="history-info">
                                            <span>{item.role}</span>
                                            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className="questions-display">
                    {session ? (
                        <div className="session-view">
                            <div className="session-header">
                                <h2>Questions for {session.role}</h2>
                                <p>{session.questions.length} AI-generated questions found.</p>
                            </div>
                            <div className="questions-list">
                                {session.questions.map((q, i) => <QuestionCard key={i} q={q} idx={i} />)}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card placeholder-card">
                            <MessageSquare size={48} />
                            <h2>Ready to Practice?</h2>
                            <p>Select a role and click "Generate Questions" to start your simulation.</p>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .interview-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
                .settings-card { padding: 24px; }
                .settings-card h2 { font-size: 18px; }
                
                .question-accordion { margin-bottom: 16px; border-radius: 12px; transition: all 0.3s ease; }
                .accordion-header { 
                    padding: 20px; display: flex; align-items: center; justify-content: space-between; 
                    cursor: pointer; gap: 20px;
                }
                .header-main { flex: 1; }
                .cat-tag { 
                    font-size: 10px; font-weight: 700; text-transform: uppercase; 
                    padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; display: inline-block;
                }
                .cat-tag.technical { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
                .cat-tag.behavioral { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .cat-tag.scenario { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .accordion-header h3 { font-size: 16px; margin: 0; line-height: 1.5; }
                
                .accordion-body { padding: 0 20px 20px; border-top: 1px solid var(--glass-border); margin-top: 5px; padding-top: 20px; }
                .answer-hint { background: rgba(255,255,255,0.02); padding: 16px; border-radius: 8px; border-left: 3px solid var(--primary); }
                .hint-label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
                .answer-hint p { font-size: 14px; color: var(--text-muted); margin: 0; line-height: 1.6; }
                
                .history-item { cursor: pointer; transition: all 0.2s ease; }
                .history-item:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
                
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1024px) { .interview-grid { grid-template-columns: 1fr; } }
                .role-select {
    background: #111827;
    color: white;
    border: 1px solid #374151;
}

.role-select option {
    background: #111827;
    color: white;
}
            `}} />
           
        </div>
    );
};

export default Interview;
