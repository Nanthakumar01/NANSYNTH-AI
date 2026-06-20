import React, { createContext, useState, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeNotification(id), 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="notification-wrapper">
                {notifications.map(n => (
                    <div key={n.id} className={`notification-item ${n.type}`}>
                        {n.type === 'success' && <CheckCircle size={20} />}
                        {n.type === 'error' && <AlertCircle size={20} />}
                        {n.type === 'info' && <Info size={20} />}
                        <span className="msg">{n.message}</span>
                        <button onClick={() => removeNotification(n.id)}><X size={16} /></button>
                    </div>
                ))}
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .notification-wrapper {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .notification-item {
                    min-width: 300px;
                    padding: 16px;
                    border-radius: 12px;
                    background: var(--bg-card);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--glass-border);
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    animation: slideIn 0.3s ease forwards;
                }
                .notification-item.success { border-left: 4px solid #10b981; }
                .notification-item.error { border-left: 4px solid #ef4444; }
                .notification-item.info { border-left: 4px solid var(--primary); }
                .notification-item .msg { flex: 1; font-size: 14px; font-weight: 500; }
                .notification-item button { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}} />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
