import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, CheckCircle, XCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

const Quiz = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, [category]);

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, isFinished]);

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`https://nansynth-ai.onrender.com/api/aptitude/quiz/${category}`);
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            navigate('/aptitude');
        }
    };

    const handleOptionSelect = (optIdx) => {
        setAnswers({ ...answers, [currentIdx]: optIdx });
    };

    const handleSubmit = () => {
        setIsFinished(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateScore = () => {
    let correct = 0;

    questions.forEach((q, idx) => {
        const selectedIndex = answers[idx];

        if (
            selectedIndex !== undefined &&
            q.options[selectedIndex] === q.answer
        ) {
            correct++;
        }
    });

    return {
        correct,
        total: questions.length,
        percent:
            questions.length > 0
                ? Math.round((correct / questions.length) * 100)
                : 0
    };
};

    if (loading) return <div className="loading-screen">Loading Questions...</div>;
    if (questions.length === 0) return <div className="main-content">No questions found in this category.</div>;

    if (isFinished) {
        const stats = calculateScore();
        return (
            <div className="quiz-result glass-card">
                <CheckCircle size={64} color="#10b981" />
                <h1>Quiz Completed!</h1>
                <div className="score-badge">{stats.percent}%</div>
                <div className="score-details">
    <p>Total Questions: {stats.total}</p>
    <p>Correct Answers: {stats.correct}</p>
    <p>Wrong Answers: {stats.total - stats.correct}</p>
</div>
                <button className="btn-primary-custom" onClick={() => navigate('/aptitude')}>
                    Back to Aptitude
                </button>
            </div>
        );
    }

    const currentQ = questions[currentIdx];

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="quiz-meta">
                    <h2>{category}</h2>
                    <span>Question {currentIdx + 1} of {questions.length}</span>
                </div>
                <div className="quiz-timer">
                    <Timer size={20} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="glass-card quiz-card">
                <div className="question-text">
                    {currentQ.question}
                </div>
                <div className="options-list">
                    {currentQ.options.map((opt, idx) => (
                        <div 
                            key={idx} 
                            className={`option-item ${answers[currentIdx] === idx ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(idx)}
                        >
                            <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-content">{opt}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="quiz-footer">
                <button 
                    className="btn-outline-custom" 
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(prev => prev - 1)}
                >
                    <ChevronLeft size={20} /> Previous
                </button>
                
                {currentIdx < questions.length - 1 ? (
                    <button className="btn-primary-custom" onClick={() => setCurrentIdx(prev => prev + 1)}>
                        Next <ChevronRight size={20} />
                    </button>
                ) : (
                    <button className="btn-primary-custom finish-btn" onClick={handleSubmit}>
                        Submit Quiz <Send size={20} />
                    </button>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .quiz-container { max-width: 800px; margin: 0 auto; }
                .quiz-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .quiz-timer {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border-radius: 20px;
                    font-weight: 700;
                }
                .quiz-card { padding: 32px; margin-bottom: 24px; }
                .question-text { font-size: 20px; font-weight: 600; margin-bottom: 32px; line-height: 1.6; }
                .options-list { display: flex; flex-direction: column; gap: 16px; }
                .option-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .option-item:hover { background: rgba(255,255,255,0.06); border-color: var(--primary); }
                .option-item.selected {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: var(--primary);
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
                }
                .option-label {
                    width: 32px;
                    height: 32px;
                    background: var(--glass-border);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                }
                .selected .option-label { background: var(--primary); color: white; }
                .quiz-footer { display: flex; justify-content: space-between; align-items: center; }
                .btn-outline-custom {
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: white;
                    padding: 10px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .finish-btn { background: #10b981; }
                .quiz-result { text-align: center; padding: 60px; max-width: 500px; margin: 40px auto; }
                .score-badge { font-size: 48px; font-weight: 800; color: var(--primary); margin: 24px 0; }
                .score-details { margin-bottom: 32px; color: var(--text-muted); }
            `}} />
        </div>
    );
};

export default Quiz;
