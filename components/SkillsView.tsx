
import React from 'react';

const SkillsView: React.FC = () => {
  const skillGroups = [
    {
      title: "Core Languages",
      skills: ["Java", "Python", "JavaScript", "SQL", "HTML/CSS"]
    },
    {
      title: "Frameworks & Tools",
      skills: ["React.js", "Node.js", "Express", "Tailwind CSS", "Git/GitHub"]
    },
    {
      title: "Data & Architecture",
      skills: ["PostgreSQL", "MongoDB", "RESTful APIs", "System Design"]
    },
    {
      title: "Professional Skills",
      skills: ["Agile Development", "Technical Documentation", "Problem Solving"]
    }
  ];

  return (
    <div className="p-8 md:p-12 h-full overflow-y-auto bg-slate-950">
      <header className="mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Technical Proficiency</h2>
        <p className="text-slate-400">My toolbelt for building modern software solutions, developed through L5 studies.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {skillGroups.map((group, i) => (
          <div key={i}>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <div 
                  key={skill}
                  className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 font-medium hover:border-indigo-500/40 hover:bg-slate-800 transition-all cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 bg-indigo-600/5 rounded-3xl border border-indigo-500/20">
         <h3 className="text-xl font-bold text-white mb-4">Education Milestone</h3>
         <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-600 rounded-xl text-white">🎓</div>
            <div>
               <p className="font-bold text-white">GSNDP CYANIKA</p>
               <p className="text-slate-400">L5 Software Development - Expected Completion 2025</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SkillsView;
