
import React from 'react';
import { ViewMode } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const features = [
    {
      title: "Reasoning Chat",
      description: "Harness Gemini 3 Pro for complex problem solving, coding assistance, and deep reasoning.",
      icon: "🧠",
      target: ViewMode.CHAT,
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Visual Studio",
      description: "Generate and edit images instantly with Gemini 2.5 Flash Image. High fidelity, low latency.",
      icon: "🎨",
      target: ViewMode.IMAGE,
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "Live Voice",
      description: "Low-latency real-time voice conversations. Talk to AI as naturally as a human.",
      icon: "🎙️",
      target: ViewMode.LIVE,
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-bold mb-4">Welcome to Nexus AI</h2>
        <p className="text-gray-400 text-lg max-w-2xl">
          The next generation of intelligence. Explore multi-modal capabilities powered by the latest Gemini models.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <button
            key={feature.title}
            onClick={() => onNavigate(feature.target)}
            className="text-left group relative bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            <div className="mt-6 flex items-center text-sm font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Launch Module 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        ))}
      </div>

      <section className="mt-16 bg-gray-900/50 border border-gray-800 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="font-medium text-gray-200">System initialization successful</p>
                <p className="text-xs text-gray-500">Connected to Gemini-3-Pro-Preview • {i}h ago</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
