
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Aptitude from './pages/Aptitude';
import Quiz from './pages/Quiz';
import Coding from './pages/Coding';
import Editor from './pages/Editor';
import Resume from './pages/Resume';
import Interview from './pages/Interview';
import Leaderboard from './pages/Leaderboard';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
    const { token, loading } = useAuth();
    if (loading) return <div className="loading-screen">Loading...</div>;
    return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/*" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/aptitude" element={<Aptitude />} />
                      <Route path="/quiz/:category" element={<Quiz />} />
                      <Route path="/coding" element={<Coding />} />
                      <Route path="/editor/:id" element={<Editor />} />
                      <Route path="/resume" element={<Resume />} />
                      <Route path="/interview" element={<Interview />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                  </MainLayout>
                </PrivateRoute>
              } 
            />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
