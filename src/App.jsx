import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import { useChat } from './hooks/useChat';

function ProtectedLayout() {
  const [chatHistory, setChatHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, isStreaming, streamingText, sendMessage, clearMessages } = useChat(activeId);

  const handleNewChat = (id) => {
    if (messages.length > 0) {
      const title = messages[0]?.content?.slice(0, 40) + '...' || 'New Chat';
      setChatHistory(prev => [{ id: activeId || id, title }, ...prev.filter(h => h.id !== activeId)]);
    }
    clearMessages();
    setActiveId(id);
    setSidebarOpen(false);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        activeId={activeId}
        setActiveId={setActiveId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Routes>
        <Route path="/chat" element={
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            streamingText={streamingText}
            sendMessage={sendMessage}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        } />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicLandingRoute() {
  const { dark, toggleDark } = useTheme();

  return <LandingPage darkMode={dark} onToggleDark={toggleDark} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLandingRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/*" element={
        <RequireAuth>
          <ProtectedLayout />
        </RequireAuth>
      } />
    </Routes>
  );
}
