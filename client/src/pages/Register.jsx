import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon, Briefcase } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Try a different email.');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card auth-card">
                <div className="auth-header">
                    <div className="auth-logo">PF</div>
                    <h1>Create Account</h1>
                    <p>Start your journey to success today</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label><UserIcon size={16} /> Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control-custom"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control-custom"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control-custom"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><Briefcase size={16} /> Role</label>
                        <select
                            name="role"
                            className="form-control-custom"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Student">Student</option>
                            
                        </select>
                    </div>
                    <button type="submit" className="btn-primary-custom w-100">
                        <UserPlus size={20} /> Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent),
                                radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15), transparent);
                }
                .auth-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 40px;
                }
                .auth-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .auth-logo {
                    width: 60px;
                    height: 60px;
                    background: var(--accent-gradient);
                    border-radius: 12px;
                    margin: 0 auto 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 800;
                    color: white;
                }
                .auth-header h1 {
                    font-size: 28px;
                    margin-bottom: 8px;
                }
                .auth-header p {
                    color: var(--text-muted);
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    color: var(--text-muted);
                    font-size: 14px;
                    font-weight: 500;
                }
                .auth-footer {
                    margin-top: 24px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 14px;
                }
                .auth-footer a {
                    color: var(--primary);
                    text-decoration: none;
                    font-weight: 600;
                }
                .alert-danger {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                }
                .w-100 { width: 100%; }
                select.form-control-custom option {
                    background: var(--bg-dark);
                    color: white;
                }
            `}} />
        </div>
    );
};

export default Register;
