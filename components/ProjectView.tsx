
import React from 'react';

const ProjectView: React.FC = () => {
  const projects = [
    {
      title: "School Management System",
      description: "A comprehensive database system for managing student records and grades at GSNDP CYANIKA.",
      tech: ["Java", "MySQL", "Swing"],
      category: "Desktop"
    },
    {
      title: "EcoTrack Rwanda",
      description: "A mobile-first web app to track deforestation and conservation efforts in Northern Province.",
      tech: ["React", "Firebase", "Leaflet"],
      category: "Web"
    },
    {
      title: "AI Resume Scanner",
      description: "An automated tool that ranks candidates based on skill match using LLM logic.",
      tech: ["Python", "Flask", "Gemini API"],
      category: "AI"
    }
  ];

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto bg-slate-950">
      <header className="mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Project Gallery</h2>
        <p className="text-slate-400">A collection of my recent software engineering works.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((p, i) => (
          <div key={i} className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all">
            <div className="h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-6xl group-hover:scale-110 transition-transform duration-500 opacity-20">💻</span>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{p.category}</span>
                <div className="flex space-x-2">
                  {p.tech.map(t => (
                    <span key={t} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{p.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{p.description}</p>
              <button className="flex items-center text-sm font-bold text-white group/btn">
                View Details
                <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectView;
