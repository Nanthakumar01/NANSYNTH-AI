import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { 
        LayoutDashboard, 
        BookOpen, 
        Code, 
        FileText, 
        MessageSquare, 
        Trophy, 
        Bell, 
        LogOut,
        User
    } from 'lucide-react';
    import { useAuth } from '../context/AuthContext';
    
    const Sidebar = () => {
        const { user, logout } = useAuth();
    
        const menuItems = [
            { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
            { path: '/aptitude', icon: <BookOpen size={20} />, label: 'Aptitude' },
            { path: '/coding', icon: <Code size={20} />, label: 'Coding Practice' },
            { path: '/resume', icon: <FileText size={20} />, label: 'Resume Analyzer' },
            { path: '/interview', icon: <MessageSquare size={20} />, label: 'AI Interview' },
            { path: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
        ];
    
        return (
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="auth-logo">NS</div>
                    <span className="brand-name">NANSYNTH AI</span>
                </div>
    
                <div className="sidebar-user">
                    <div className="user-avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                </div>
    
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path} 
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
    
                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
    
                <style dangerouslySetInnerHTML={{ __html: `
                    .sidebar-header {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 32px;
                    }
                    .brand-name {
                        font-family: 'Outfit', sans-serif;
                        font-size: 20px;
                        font-weight: 700;
                        background: var(--accent-gradient);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .sidebar-user {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 16px;
                        background: rgba(255, 255, 255, 0.03);
                        border-radius: 12px;
                        margin-bottom: 24px;
                    }
                    .user-avatar {
                        width: 40px;
                        height: 40px;
                        background: var(--glass-border);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--primary);
                    }
                    .user-info {
                        display: flex;
                        flex-direction: column;
                    }
                    .user-name {
                        font-size: 14px;
                        font-weight: 600;
                    }
                    .user-role {
                        font-size: 12px;
                        color: var(--text-muted);
                    }
                    .sidebar-nav {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        flex: 1;
                    }
                    .nav-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px 16px;
                        color: var(--text-muted);
                        text-decoration: none;
                        border-radius: 8px;
                        transition: all 0.2s ease;
                    }
                    .nav-item:hover {
                        background: rgba(255, 255, 255, 0.05);
                        color: var(--text-main);
                    }
                    .nav-item.active {
                        background: var(--primary);
                        color: white;
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                    }
                    .sidebar-footer {
                        margin-top: auto;
                        padding-top: 24px;
                    }
                    .logout-btn {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px 16px;
                        background: transparent;
                        border: 1px solid var(--glass-border);
                        color: #ef4444;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .logout-btn:hover {
                        background: rgba(239, 68, 68, 0.1);
                    }
                `}} />
            </div>
        );
    };
    
    export default Sidebar;
    
