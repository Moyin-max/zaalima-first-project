const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

const topbarCode = `
import React from 'react';

export default function Topbar() {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white border-b border-slate-200 font-manrope text-sm antialiased">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tight text-slate-900">OpsMind AI</span>
        <div className="relative w-96 hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-body-sm focus:ring-2 focus:ring-secondary/20 outline-none" placeholder="Search SOPs or documentation..." type="text"/>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-primary-container text-white px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">publish</span>
          Upload SOP
        </button>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="w-8 h-8 rounded-full border border-slate-200 ml-2 bg-slate-300 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover"/>
          </div>
        </div>
      </div>
    </header>
  );
}
`;

const sidebarCode = `
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onNewChat }) {
  const [history, setHistory] = useState([
    { id: '1', title: 'Q4 Travel Reimbursement' },
    { id: '2', title: 'Security Onboarding v2' },
    { id: '3', title: 'Remote Work Eligibility' }
  ]);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col pt-16 z-40 bg-white border-r border-slate-200 font-manrope text-sm font-medium">
      <div className="p-6 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]">psychology</span>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-none">OpsMind AI</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Enterprise Intelligence</div>
          </div>
        </div>
        <button onClick={() => onNewChat(Date.now().toString())} className="w-full flex items-center gap-3 px-4 py-3 bg-secondary text-white rounded-xl mb-6 hover:opacity-90 transition-all shadow-lg shadow-secondary/10">
          <span className="material-symbols-outlined">chat_bubble</span>
          <span>New Query</span>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation</div>
        
        <NavLink to="/chat" className={({isActive}) => isActive ? "flex items-center gap-3 px-4 py-3 rounded-none bg-slate-50 text-secondary border-r-2 border-secondary" : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"}>
          <span className="material-symbols-outlined">chat_bubble</span>
          <span>Query Agent</span>
        </NavLink>
        
        <NavLink to="/admin" className={({isActive}) => isActive ? "flex items-center gap-3 px-4 py-3 rounded-none bg-slate-50 text-secondary border-r-2 border-secondary" : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"}>
          <span className="material-symbols-outlined">database</span>
          <span>Knowledge Base</span>
        </NavLink>

        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all" href="#">
          <span className="material-symbols-outlined">monitoring</span>
          <span>System Analytics</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>

        <div className="px-3 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Queries</div>
        <div className="space-y-1">
          {history.map(h => (
            <a key={h.id} className="block px-4 py-2 text-body-sm text-slate-500 hover:text-slate-900 truncate" href="#">{h.title}</a>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <a className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all mb-1" href="#">
          <span className="material-symbols-outlined text-[20px]">help_center</span>
          <span>Support</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/20 rounded-lg transition-all" href="#">
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
}
`;

const chatWindowCode = `
import React, { useState } from 'react';

export default function ChatWindow({ messages, isStreaming, streamingText, onSend }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <main className="ml-64 pt-16 h-screen flex flex-col bg-surface">
      {!messages.length && !isStreaming ? (
        <div className="flex-shrink-0 px-8 py-12 text-center">
          <h1 className="font-h1 text-h1 text-primary-container mb-4">How can I help you with our SOPs today?</h1>
          <p className="font-body-md text-slate-500 max-w-2xl mx-auto">Access the latest enterprise procedures, compliance guidelines, and operational workflows with AI-powered precision.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 max-w-4xl mx-auto mt-8">
            <div onClick={() => onSend("Give me the Expense Form")} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-secondary/30 transition-all cursor-pointer group text-left">
              <span className="material-symbols-outlined text-secondary mb-3">receipt_long</span>
              <h4 className="font-h3 text-label-md mb-2">Expense Form</h4>
              <p className="font-body-sm text-slate-500">Download the 2024 International Reimbursement template.</p>
            </div>
            <div onClick={() => onSend("Open Travel Registry")} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-secondary/30 transition-all cursor-pointer group text-left">
              <span className="material-symbols-outlined text-secondary mb-3">flight_takeoff</span>
              <h4 className="font-h3 text-label-md mb-2">Travel Registry</h4>
              <p className="font-body-sm text-slate-500">Register your upcoming high-budget trip for approval.</p>
            </div>
            <div onClick={() => onSend("Contact Finance")} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-secondary/30 transition-all cursor-pointer group text-left">
              <span className="material-symbols-outlined text-secondary mb-3">account_balance_wallet</span>
              <h4 className="font-h3 text-label-md mb-2">Finance Contact</h4>
              <p className="font-body-sm text-slate-500">Directly message the Travel Compliance department.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-8 pb-32 space-y-8 scrollbar-hide pt-8">
          <div className="max-w-4xl mx-auto w-full space-y-8">
            {messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="flex justify-end items-start gap-4">
                  <div className="bg-primary-container text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                    <p className="font-body-md whitespace-pre-wrap">{m.content}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User avatar" className="w-full h-full object-cover"/>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start items-start gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]">psychology</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-secondary"></div>
                    <div className="space-y-4">
                      <p className="font-body-md text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </p>
                      {m.citations && m.citations.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                          <span className="font-label-sm text-slate-400 mr-2 uppercase tracking-tight">Verified Sources:</span>
                          {m.citations.map((c, idx) => (
                            <button key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-secondary-container/30 text-on-secondary-container border border-secondary/20 rounded-full font-label-sm hover:bg-secondary-container/50 transition-colors">
                              <span className="material-symbols-outlined text-[14px]">description</span>
                              {c.label || 'Document'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
            {isStreaming && (
              <div className="flex justify-start items-start gap-4">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-[18px] animate-pulse">psychology</span>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-secondary animate-pulse"></div>
                  <div className="space-y-4">
                    <p className="font-body-md text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {streamingText}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-0 left-64 right-0 p-8 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none z-10">
        <div className="max-w-4xl mx-auto w-full pointer-events-auto">
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2 flex items-end gap-2 focus-within:border-secondary transition-all">
            <button className="p-3 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 py-3 font-body-md resize-none scrollbar-hide outline-none" 
              placeholder="Ask a question about any SOP..." 
              rows="1" 
              style={{ minHeight: '48px', maxHeight: '200px' }}
            ></textarea>
            <div className="flex items-center gap-2 pb-1.5 pr-2">
              <button className="p-3 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button onClick={handleSend} disabled={!input.trim()} className="bg-primary-container text-white p-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-50">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <span className="font-label-sm text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">history</span> 
              Syncing with Knowledge Base v1.9
            </span>
            <span className="font-label-sm text-slate-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span> 
              Enterprise Grade Privacy
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
`;

const appCode = `
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const handleSend = (text) => {
    const userMsg = { role: 'user', content: text, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText('Analyzing your query against enterprise SOPs...');
    
    // Mock response
    setTimeout(() => {
      setStreamingText('');
      setIsStreaming(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Based on our knowledge base, here is the answer to your query.\\n\\n1. **First Step**: Verify the document.\\n2. **Second Step**: Approve via the portal.',
        citations: [{label: 'Policy Doc v4.2'}],
        id: Date.now() + 1
      }]);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <BrowserRouter>
      <div className="bg-background text-on-surface font-body-md min-h-screen">
        <Topbar />
        <Sidebar onNewChat={handleNewChat} />
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={
            <ChatWindow 
              messages={messages} 
              isStreaming={isStreaming} 
              streamingText={streamingText} 
              onSend={handleSend} 
            />
          } />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
`;

const adminDashboardCode = `
import React from 'react';

export default function AdminDashboard() {
  return (
    <main className="pt-24 pb-12 px-6 xl:ml-64 bg-surface min-h-screen">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-label-sm">
              <span>Admin</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900">Knowledge Base</span>
            </nav>
            <h2 className="text-h2 font-h2 text-primary">SOP Repository</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mt-2">Manage and index Standard Operating Procedures to enhance agent response precision and corporate compliance.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-outline-variant px-5 py-2.5 rounded-lg font-label-md text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined">refresh</span>
              Re-index Database
            </button>
            <button className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-lg font-label-md hover:bg-opacity-90 transition-colors shadow-lg">
              <span className="material-symbols-outlined">add</span>
              Upload New SOP
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
            <span className="text-label-sm text-on-surface-variant">TOTAL DOCUMENTS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-h3 font-h3">1,284</span>
              <span className="text-xs text-secondary font-medium">+12 this week</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
            <span className="text-label-sm text-on-surface-variant">ACTIVE CHUNKS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-h3 font-h3">45.2k</span>
              <span className="text-xs text-on-surface-variant font-medium">Vector Optimized</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-2">
            <span className="text-label-sm text-on-surface-variant">STORAGE USED</span>
            <div className="flex items-baseline gap-2">
              <span className="text-h3 font-h3">4.2 GB</span>
              <span className="text-xs text-on-surface-variant font-medium">of 10 GB</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-secondary/20 shadow-sm border-l-4 flex flex-col gap-2">
            <span className="text-label-sm text-secondary">INDEXING STATUS</span>
            <div className="flex items-center gap-2">
              <span className="text-h3 font-h3 text-secondary">Healthy</span>
              <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center gap-4">
              <h3 className="font-h3 text-body-lg font-semibold">Document Catalog</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-surface-container text-xs font-semibold rounded text-on-surface-variant">1,284 Total</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-outline-variant rounded-lg overflow-hidden">
                <button className="px-3 py-1.5 bg-surface-container-low text-on-surface-variant"><span className="material-symbols-outlined text-[20px]">filter_list</span></button>
                <input className="border-none text-sm px-3 py-1.5 focus:ring-0 w-48 outline-none" placeholder="Filter by name..." type="text"/>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant border-b border-outline-variant font-semibold">Document Name</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant border-b border-outline-variant font-semibold text-center">Pages</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant border-b border-outline-variant font-semibold">Date Uploaded</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant border-b border-outline-variant font-semibold">Status</th>
                  <th className="px-6 py-4 text-label-md text-on-surface-variant border-b border-outline-variant font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container-lowest transition-colors bg-white">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary-container/20 rounded flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <div className="font-body-md font-semibold text-primary">Q4_Retail_Safety_Protocol_v2.pdf</div>
                        <div className="text-xs text-on-surface-variant">7.2 MB • PDF</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-body-sm">42</td>
                  <td className="px-6 py-4 font-body-sm text-on-surface-variant">Oct 24, 2023, 11:02 AM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Indexing
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-low/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container rounded flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">article</span>
                      </div>
                      <div>
                        <div className="font-body-md font-semibold text-primary">Emergency_Evacuation_Guidelines.docx</div>
                        <div className="text-xs text-on-surface-variant">1.4 MB • DOCX</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-body-sm">8</td>
                  <td className="px-6 py-4 font-body-sm text-on-surface-variant">Oct 23, 2023, 04:45 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-bold border border-secondary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'components', 'Topbar.jsx'), topbarCode);
fs.writeFileSync(path.join(srcDir, 'components', 'Sidebar.jsx'), sidebarCode);
fs.writeFileSync(path.join(srcDir, 'components', 'ChatWindow.jsx'), chatWindowCode);
fs.writeFileSync(path.join(srcDir, 'components', 'AdminDashboard.jsx'), adminDashboardCode);
fs.writeFileSync(path.join(srcDir, 'App.jsx'), appCode);
console.log('Successfully refactored components to match new UI.');
