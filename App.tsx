
import React, { useState } from 'react';
import { ViewMode } from './types';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import ProjectView from './components/ProjectView';
import SkillsView from './components/SkillsView';
import AIAgentView from './components/AIAgentView';
import VoiceView from './components/VoiceView';
import Dashboard from './components/Dashboard';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import LiveView from './components/LiveView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case ViewMode.HOME:
        return <HomeView onNavigate={setCurrentView} />;
      case ViewMode.PROJECTS:
        return <ProjectView />;
      case ViewMode.SKILLS:
        return <SkillsView />;
      case ViewMode.AI_AGENT:
        return <AIAgentView />;
      case ViewMode.VOICE:
        return <VoiceView />;
      case ViewMode.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewMode.CHAT:
        return <ChatView />;
      case ViewMode.IMAGE:
        return <ImageView />;
      case ViewMode.LIVE:
        return <LiveView />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
             <span className="text-xs font-black text-white italic">MR</span>
           </div>
           <h1 className="font-bold text-base text-white">Mugisha Robert</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:relative z-50 lg:z-auto transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          activeView={currentView} 
          onNavigate={handleNavigate} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 relative overflow-hidden flex flex-col pt-16 lg:pt-0">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
