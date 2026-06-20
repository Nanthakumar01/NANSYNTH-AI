import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';

const Aptitude = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                'https://nansynth-ai.onrender.com/api/aptitude/categories'
            );

            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (category) => {
        navigate(`/quiz/${encodeURIComponent(category)}`);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                Loading Categories...
            </div>
        );
    }

    return (
        <div className="aptitude-container">
            <div className="header-flex">
                <div>
                    <h1>Aptitude Assessment</h1>
                    <p>
                        Choose a category to start practicing and improve your skills.
                    </p>
                </div>
            </div>

            <div className="category-grid">
                {categories.map((catData) => (
                    <div
                        key={catData._id}
                        className="glass-card category-card"
                        onClick={() => handleStartQuiz(catData._id)}
                    >
                        <div className="cat-icon-box">
                            <BookOpen size={24} />
                        </div>

                        <div className="cat-info">
                            <h3>{catData._id}</h3>
                            <p>
                                {catData.count} Questions Available
                            </p>
                        </div>

                        <div className="cat-action">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .header-flex {
                        margin-bottom: 32px;
                    }

                    .category-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 24px;
                    }

                    .category-card {
                        padding: 24px;
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .category-card:hover {
                        transform: translateY(-5px);
                        border-color: var(--primary);
                        background: rgba(255,255,255,0.08);
                    }

                    .cat-icon-box {
                        width: 56px;
                        height: 56px;
                        background: var(--glass-border);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--primary);
                    }

                    .cat-info {
                        flex: 1;
                    }

                    .cat-info h3 {
                        font-size: 18px;
                        margin-bottom: 4px;
                    }

                    .cat-info p {
                        color: var(--text-muted);
                        font-size: 14px;
                    }

                    .cat-action {
                        color: var(--text-muted);
                        transition: transform 0.3s ease;
                    }

                    .category-card:hover .cat-action {
                        transform: translateX(5px);
                        color: var(--primary);
                    }
                `
                }}
            />
        </div>
    );
};

export default Aptitude;