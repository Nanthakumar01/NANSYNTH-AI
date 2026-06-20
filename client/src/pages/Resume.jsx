import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Award, Zap, List } from 'lucide-react';

const Resume = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/resume/history');
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please select a file first.');
        if (file.type !== 'application/pdf') return setError('Only PDF files are supported.');

        setUploading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('http://localhost:5000/api/resume/analyze', formData);
            setAnalysis(res.data);
            fetchHistory();
        } catch (err) {
            setError('Analysis failed. Please check your connection or API key.');
        } finally {
            setUploading(false);
        }
    };

    const ScoreGauge = ({ score }) => {
        const color = score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';
        return (
            <div className="gauge-container">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="10" 
                        strokeDasharray={`${score * 2.83} 283`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                    <text x="50" y="55" fontSize="24" fontWeight="800" textAnchor="middle" fill="white">{score}</text>
                </svg>
            </div>
        );
    };

    return (
        <div className="resume-container">
            <div className="header-flex">
                <div>
                    <h1>AI Resume Analyzer</h1>
                    <p>Get instant feedback and ATS optimization tips for your resume.</p>
                </div>
            </div>

            <div className="resume-grid">
                <div className="upload-section">
                    <div className="glass-card upload-card">
                        <h2>Upload Resume</h2>
                        <form onSubmit={handleUpload}>
                            <div className={`dropzone ${file ? 'has-file' : ''}`}>
                                <input type="file" onChange={handleFileChange} accept=".pdf" id="resume-upload" />
                                <label htmlFor="resume-upload">
                                    <Upload size={32} />
                                    <span>{file ? file.name : 'Click to select or drag PDF'}</span>
                                </label>
                            </div>
                            {error && <div className="error-msg"><AlertCircle size={14} /> {error}</div>}
                            <button className="btn-primary-custom w-100 mt-4" disabled={uploading}>
                                {uploading ? <><Loader2 className="animate-spin" size={18} /> Analyzing...</> : 'Analyze Resume'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card history-card mt-4">
                        <h3>Previous Analyses</h3>
                        <div className="history-list">
                            {history.length === 0 ? <p className="empty-text">No history found.</p> : 
                                history.map(item => (
                                    <div key={item._id} className="history-item">
                                        <FileText size={16} />
                                        <div className="history-info">
                                            <span>{item.fileName}</span>
                                            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        <div className="history-score">{item.atsScore}%</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className="analysis-result">
                    {analysis ? (
                        <div className="glass-card result-card">
                            <div className="result-header">
                                <ScoreGauge score={analysis.atsScore} />
                                <div className="header-text">
                                    <h2>ATS Score</h2>
                                    <p>Based on our AI evaluation of your profile.</p>
                                </div>
                            </div>

                            <div className="analysis-grid">
                                <div className="analysis-box">
                                    <h3><Zap size={18} /> Identified Skills</h3>
                                    <div className="tag-cloud">
                                        {analysis.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                                    </div>
                                </div>
                                <div className="analysis-box">
                                    <h3><AlertCircle size={18} color="#f59e0b" /> Missing Skills</h3>
                                    <div className="tag-cloud">
                                        {analysis.missingSkills.map((s, i) => <span key={i} className="skill-tag missing">{s}</span>)}
                                    </div>
                                </div>
                            </div>

                            <div className="recommendations-box mt-4">
                                <h3><List size={18} /> Recommendations</h3>
                                <ul>
                                    {analysis.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card placeholder-card">
                            <Award size={48} />
                            <h2>Ready for Analysis?</h2>
                            <p>Upload your resume to see detailed AI-powered insights here.</p>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .resume-grid { display: grid; grid-template-columns: 350px 1fr; gap: 24px; }
                .upload-card { padding: 32px; }
                .dropzone {
                    border: 2px dashed var(--glass-border);
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }
                .dropzone input { opacity: 0; position: absolute; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer; }
                .dropzone label { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-muted); cursor: pointer; }
                .dropzone:hover, .dropzone.has-file { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
                .dropzone.has-file label { color: white; }

                .error-msg { color: #fe2a2a; color: #ef4444; font-size: 13px; margin-top: 12px; display: flex; align-items: center; gap: 6px; }
                .history-card { padding: 24px; max-height: 400px; overflow-y: auto; }
                .history-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
                .history-item { 
                    display: flex; align-items: center; gap: 12px; padding: 12px; 
                    background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--glass-border);
                }
                .history-info { flex: 1; display: flex; flex-direction: column; }
                .history-info span { font-size: 13px; font-weight: 600; }
                .history-info small { font-size: 11px; color: var(--text-muted); }
                .history-score { font-weight: 700; color: var(--primary); font-size: 14px; }

                .result-card { padding: 32px; }
                .result-header { display: flex; align-items: center; gap: 32px; margin-bottom: 40px; }
                .gauge-container { width: 120px; height: 120px; }
                .header-text h2 { font-size: 28px; margin-bottom: 4px; }
                .header-text p { color: var(--text-muted); }

                .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .analysis-box h3 { font-size: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
                .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
                .skill-tag { 
                    padding: 4px 12px; background: rgba(99, 102, 241, 0.1); color: #818cf8; 
                    border-radius: 20px; font-size: 12px; font-weight: 600; 
                }
                .skill-tag.missing { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
                .recommendations-box { padding-top: 24px; border-top: 1px solid var(--glass-border); }
                .recommendations-box h3 { font-size: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
                .recommendations-box ul { padding-left: 20px; color: var(--text-muted); font-size: 14px; line-height: 1.8; }

                .placeholder-card { 
                    height: 100%; padding: 60px; display: flex; flex-direction: column; 
                    align-items: center; justify-content: center; text-align: center; color: var(--text-muted);
                }
                .placeholder-card h2 { margin-top: 24px; margin-bottom: 12px; color: white; }
                
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1024px) { .resume-grid { grid-template-columns: 1fr; } }
            `}} />
        </div>
    );
};

export default Resume;
