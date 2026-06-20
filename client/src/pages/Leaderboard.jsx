import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star, TrendingUp, User } from 'lucide-react';

const Leaderboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/analytics/leaderboard');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const RankIcon = ({ rank }) => {
        if (rank === 0) return <Trophy size={24} color="#fbbf24" />;
        if (rank === 1) return <Medal size={24} color="#94a3b8" />;
        if (rank === 2) return <Medal size={24} color="#b45309" />;
        return <span className="rank-number">{rank + 1}</span>;
    };

    if (loading) return <div className="loading-screen">Loading Leaderboard...</div>;

    return (
        <div className="leaderboard-container">
            <div className="header-flex">
                <div>
                    <h1>Leaderboard</h1>
                    <p>Recognizing the top performers in placement preparation.</p>
                </div>
            </div>

            <div className="leaderboard-grid">
                <div className="glass-card podium-section">
                    <div className="podium-item second">
                        <div className="avatar-box silver">
                            <User size={32} />
                            <div className="rank-badge">2</div>
                        </div>
                        <h3>{students[1]?.name || '---'}</h3>
                        <p>{students[1]?.stats?.averageScore || 0}% Score</p>
                    </div>
                    <div className="podium-item first">
                        <div className="avatar-box gold">
                            <Trophy size={48} />
                            <div className="rank-badge">1</div>
                        </div>
                        <h3>{students[0]?.name || '---'}</h3>
                        <p>{students[0]?.stats?.averageScore || 0}% Score</p>
                    </div>
                    <div className="podium-item third">
                        <div className="avatar-box bronze">
                            <User size={32} />
                            <div className="rank-badge">3</div>
                        </div>
                        <h3>{students[2]?.name || '---'}</h3>
                        <p>{students[2]?.stats?.averageScore || 0}% Score</p>
                    </div>
                </div>

                <div className="glass-card table-section">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Student</th>
                                <th>Role</th>
                                <th>Aptitude Avg</th>
                                <th>Coding Solved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={student._id} className={idx < 3 ? `top-rank rank-${idx}` : ''}>
                                    <td><RankIcon rank={idx} /></td>
                                    <td>
                                        <div className="student-cell">
                                            <div className="mini-avatar"><User size={14} /></div>
                                            <span>{student.name}</span>
                                        </div>
                                    </td>
                                    <td><span className="role-tag">{student.role}</span></td>
                                    <td><span className="score-val">{student.stats.averageScore}%</span></td>
                                    <td><span className="count-val">{student.stats.codingProblemsSolved}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .podium-section {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    gap: 40px;
                    padding: 40px;
                    margin-bottom: 32px;
                    background: linear-gradient(to top, rgba(99, 102, 241, 0.05), transparent);
                }
                .podium-item { text-align: center; display: flex; flex-direction: column; align-items: center; }
                .avatar-box {
                    width: 80px; height: 80px; border-radius: 50%; background: var(--glass-border);
                    display: flex; align-items: center; justify-content: center; position: relative;
                    margin-bottom: 16px; border: 2px solid transparent;
                }
                .avatar-box.gold { width: 120px; height: 120px; border-color: #fbbf24; box-shadow: 0 0 20px rgba(251, 191, 36, 0.2); }
                .avatar-box.silver { border-color: #94a3b8; }
                .avatar-box.bronze { border-color: #b45309; }
                .rank-badge {
                    position: absolute; bottom: -5px; right: -5px; width: 28px; height: 28px;
                    background: var(--primary); border-radius: 50%; display: flex; align-items: center;
                    justify-content: center; font-size: 14px; font-weight: 800; border: 2px solid var(--bg-dark);
                }
                .podium-item h3 { font-size: 18px; margin-bottom: 4px; }
                .podium-item p { color: var(--text-muted); font-size: 14px; }
                .podium-item.first { order: 2; margin-bottom: 20px; }
                .podium-item.second { order: 1; }
                .podium-item.third { order: 3; }

                .table-section { padding: 0; overflow: hidden; }
                .leaderboard-table { width: 100%; border-collapse: collapse; text-align: left; }
                .leaderboard-table th { padding: 20px 24px; color: var(--text-muted); font-size: 13px; text-transform: uppercase; font-weight: 700; border-bottom: 1px solid var(--glass-border); }
                .leaderboard-table td { padding: 16px 24px; border-bottom: 1px solid var(--glass-border); font-size: 14px; }
                .rank-number { font-weight: 700; color: var(--text-muted); }
                .student-cell { display: flex; align-items: center; gap: 12px; font-weight: 600; }
                .mini-avatar { width: 28px; height: 28px; background: var(--glass-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .role-tag { font-size: 11px; padding: 2px 8px; background: rgba(255,255,255,0.05); border-radius: 4px; color: var(--text-muted); }
                .score-val { color: var(--primary); font-weight: 700; }
                .count-val { font-weight: 700; }
                
                tr.top-rank { background: rgba(99, 102, 241, 0.02); }
                tr.rank-0 { background: rgba(251, 191, 36, 0.05); }
                
                @media (max-width: 768px) {
                    .podium-section { flex-direction: column; align-items: center; gap: 40px; }
                    .podium-item.first { order: 1; }
                    .podium-item.second { order: 2; }
                    .podium-item.third { order: 3; }
                }
            `}} />
        </div>
    );
};

export default Leaderboard;
