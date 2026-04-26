import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
  const { messages, isStreaming, streamingText, sendMessage, clearMessages } = useChat(activeId);

  const handleNewChat = (id) => {
    if (messages.length > 0) {
      const title = messages[0]?.content?.slice(0, 40) + '...' || 'New Chat';
      setChatHistory(prev => [{ id: activeId || id, title }, ...prev.filter(h => h.id !== activeId)]);
    }
    clearMessages();
    setActiveId(id);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen">
      <Topbar />
      <Sidebar
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        activeId={activeId}
        setActiveId={setActiveId}
      />
      <Routes>
        <Route path="/chat" element={
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            streamingText={streamingText}
            sendMessage={sendMessage}
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

export default function App() {
  return (
    <Routes>
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
