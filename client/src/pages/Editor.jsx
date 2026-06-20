import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Play, Send, Zap, Info, FileCode } from 'lucide-react';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {
        fetchProblem();
    }, [id]);

    const fetchProblem = async () => {
        try {
            const res = await axios.get(`https://nansynth-ai.onrender.com/api/coding/${id}`);
            setProblem(res.data);
            setCode(`// Write your solution here\nfunction solution() {\n  \n}`);
            setLoading(false);
        } catch (err) {
            console.error(err);
            navigate('/coding');
        }
    };
    const handleSubmit = async () => {

    try {

        const res = await axios.post(
            'https://nansynth-ai.onrender.com/api/coding/submit',
            {
                code,
                language,
                problemId: problem._id
            }
        );

        if (res.data.passed) {

            setOutput(
                `✅ Passed\n\nExpected: ${res.data.expectedOutput}\nGot: ${res.data.actualOutput}`
            );

        } else {

            setOutput(
                `❌ Failed\n\nExpected: ${res.data.expectedOutput}\nGot: ${res.data.actualOutput}`
            );

        }

    } catch (err) {

        setOutput('Submission Failed');

    }
};

    const handleRunCode = async () => {
    try {
        setOutput('Running code...');

        const res = await axios.post(
    'https://nansynth-ai.onrender.com/api/coding/run',
    {
        code,
        language
    }
);

        setOutput(
    res.data.output || 'No Output'
);

    } catch (err) {
        setOutput('Execution Failed');
        console.error(err);
    }
};

    if (loading) return <div className="loading-screen">Loading Editor...</div>;

    return (
        <div className="editor-container">
            <div className="editor-header">
                <button className="back-link" onClick={() => navigate('/coding')}>
                    <ChevronLeft size={18} /> Back to Challenges
                </button>
                <div className="problem-title-small">
                    {problem.title}
                    <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                    </span>
                </div>
                <div className="editor-actions">
                    <button className="btn-run" onClick={handleRunCode}><Play size={16} /> Run</button>
                    <button className="btn-submit" onClick={handleSubmit}><Send size={16} /> Submit</button>
                </div>
            </div>

            <div className="editor-layout">
                <div className="problem-sidebar glass-card">
                    <div className="sidebar-tabs">
                        <button 
                            className={activeTab === 'description' ? 'active' : ''} 
                            onClick={() => setActiveTab('description')}
                        ><Info size={16} /> Description</button>
                        <button 
                            className={activeTab === 'examples' ? 'active' : ''} 
                            onClick={() => setActiveTab('examples')}
                        ><Zap size={16} /> Examples</button>
                    </div>

                    <div className="sidebar-content">
                        {activeTab === 'description' ? (
                            <div className="desc-view">
                                <h3>Overview</h3>
                                <p>{problem.description}</p>
                                
                                <h3 className="mt-4">Constraints</h3>
                                <ul>
                                    {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>

                                <h3 className="mt-4">Input Format</h3>
                                <p>{problem.inputFormat}</p>

                                <h3 className="mt-4">Output Format</h3>
                                <p>{problem.outputFormat}</p>
                            </div>
                        ) : (
                            <div className="examples-view">
                                {problem.sampleTestCases.map((tc, i) => (
                                    <div key={i} className="testcase-box">
                                        <h4>Example {i + 1}</h4>
                                        <div className="tc-item">
                                            <strong>Input:</strong> <code>{tc.input}</code>
                                        </div>
                                        <div className="tc-item">
                                            <strong>Output:</strong> <code>{tc.output}</code>
                                        </div>
                                        {tc.explanation && (
                                            <div className="tc-item">
                                                <strong>Explanation:</strong> <p>{tc.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="code-editor-area glass-card">
                    <div className="editor-toolbar">
    <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
    >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
    </select>
</div>
                    <textarea 
                        className="code-textarea"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Start coding..."
                    />
                    <div className="output-panel">
                        <div className="output-header">Console Output</div>
                        <pre className="output-content">{output || 'No output yet. Click Run to see results.'}</pre>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .editor-container { 
                    margin: -32px; /* Offset main padding */
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                    .language-select {
    background: #111827;
    color: white;
    border: 1px solid #374151;
    padding: 6px 12px;
    border-radius: 6px;
    outline: none;
}
                .editor-header {
                    height: 56px;
                    background: #111827;
                    border-bottom: 1px solid var(--glass-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                }
                .back-link { 
                    background: transparent; border: none; color: var(--text-muted); 
                    display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 14px;
                }
                .problem-title-small { display: flex; align-items: center; gap: 12px; font-weight: 600; }
                .difficulty-tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
                .difficulty-tag.easy { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .difficulty-tag.medium { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .difficulty-tag.hard { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
                .editor-actions { display: flex; gap: 12px; }
                .btn-run, .btn-submit {
                    padding: 6px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
                    display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s ease;
                }
                .btn-run { background: var(--glass-border); color: white; }
                .btn-submit { background: var(--primary); color: white; }
                .btn-submit:hover { background: var(--primary-hover); }

                .editor-layout { flex: 1; display: grid; grid-template-columns: 400px 1fr; overflow: hidden; background: #0f172a; }
                .problem-sidebar { border-radius: 0; border: none; border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; }
                .sidebar-tabs { display: flex; padding: 12px; gap: 8px; border-bottom: 1px solid var(--glass-border); }
                .sidebar-tabs button {
                    background: transparent; border: none; color: var(--text-muted); padding: 8px 12px;
                    border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px;
                }
                .sidebar-tabs button.active { background: rgba(255,255,255,0.05); color: white; }
                .sidebar-content { padding: 24px; overflow-y: auto; flex: 1; }
                .sidebar-content h3 { font-size: 16px; margin-bottom: 12px; }
                .sidebar-content p { color: var(--text-muted); font-size: 14px; line-height: 1.6; }
                .mt-4 { margin-top: 24px; }
                .sidebar-content ul { padding-left: 20px; color: var(--text-muted); font-size: 14px; }
                .testcase-box { background: rgba(255,255,255,0.02); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 1px solid var(--glass-border); }
                .tc-item { margin-bottom: 8px; font-size: 13px; }
                .tc-item code { background: #1e293b; padding: 2px 6px; border-radius: 4px; color: var(--secondary); }

                .code-editor-area { border-radius: 0; border: none; display: flex; flex-direction: column; }
                .editor-toolbar { padding: 8px 16px; background: #1f2937; border-bottom: 1px solid var(--glass-border); }
                .lang-tag { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
                .code-textarea {
                    flex: 1; background: transparent; border: none; color: #e2e8f0; font-family: 'Fira Code', 'Courier New', monospace;
                    font-size: 15px; padding: 24px; resize: none; outline: none; line-height: 1.6;
                }
                .output-panel { height: 200px; background: #0b0f1a; border-top: 1px solid var(--glass-border); padding: 20px; display: flex; flex-direction: column; }
                .output-header { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; }
                .output-content { font-family: monospace; font-size: 13px; color: #94a3b8; margin: 0; flex: 1; overflow-y: auto; }
            `}} />
        </div>
    );
};

export default Editor;
