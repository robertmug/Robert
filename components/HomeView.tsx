
import React, { useState, useEffect } from 'react';
import { ViewMode } from '../types';

interface HomeProps {
  onNavigate: (view: ViewMode) => void;
}

const HomeView: React.FC<HomeProps> = ({ onNavigate }) => {
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Typewriter logic
  const [displayText, setDisplayText] = useState('');
  const fullText = "Building the Future of Code.";
  
  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !senderMessage) return;

    setIsSending(true);
    
    // Simulate API call / Message sending process
    setTimeout(() => {
      setIsSending(false);
      setShowNotification(true);
      setSenderEmail('');
      setSenderMessage('');
      
      // Hide notification after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
    }, 1500);
  };

  const renderStyledText = () => {
    // We want "Building the " to be white
    // "Future" to be gradient
    // " of Code." to be white
    
    const parts = [
      { text: "Building the ", style: "text-white" },
      { text: "Future", style: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-sm" },
      { text: " of Code.", style: "text-white" }
    ];

    let currentVisibleLength = 0;
    return parts.map((part, index) => {
      const partStart = fullText.indexOf(part.text, currentVisibleLength);
      const partEnd = partStart + part.text.length;
      
      // Calculate how much of this part should be visible
      const visiblePart = fullText.slice(
        Math.max(partStart, 0),
        Math.min(partEnd, displayText.length)
      );
      
      currentVisibleLength = partEnd;

      return (
        <span key={index} className={part.style}>
          {visiblePart}
        </span>
      );
    });
  };

  const socialLinks = [
    {
      name: "WhatsApp",
      value: "0734311902",
      url: "https://wa.me/250734311902",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.484 2.247 2.247 3.484 5.232 3.484 8.404 0 6.556-5.332 11.888-11.888 11.888-2.013 0-3.986-.511-5.741-1.483l-6.246 1.637zM6.34 19.105l.35.209c1.42.844 3.058 1.29 4.743 1.29 5.201 0 9.432-4.231 9.432-9.432 0-2.521-.982-4.891-2.765-6.674-1.783-1.783-4.153-2.765-6.674-2.765-5.201 0-9.432 4.231-9.432 9.432 0 1.835.532 3.63 1.539 5.195l.233.364-1.01 3.693 3.784-.992zM15.932 13.09c-.328-.164-1.94-.958-2.241-1.069-.301-.11-.52-.164-.739.164-.219.328-.848 1.069-1.039 1.288-.192.219-.383.246-.711.082-.328-.164-1.386-.511-2.641-1.63-.977-.872-1.637-1.948-1.829-2.276-.192-.328-.02-.505.145-.669.148-.148.328-.383.493-.575.164-.192.219-.328.328-.548.11-.219.055-.411-.027-.575-.082-.164-.739-1.781-1.012-2.438-.267-.641-.54-.553-.739-.563-.191-.01-.41-.012-.629-.012s-.575.082-.876.411c-.301.328-1.15 1.123-1.15 2.74s1.178 3.178 1.342 3.397c.164.219 2.318 3.541 5.616 4.965.784.339 1.396.541 1.873.691.788.251 1.505.216 2.071.131.63-.094 1.94-.794 2.214-1.562.274-.767.274-1.425.192-1.562-.082-.136-.301-.219-.629-.383z"/></svg>
      ),
      color: "text-[#25D366] group-hover:bg-[#25D366]/10"
    },
    {
      name: "Instagram",
      value: "@New_Robert12",
      url: "https://instagram.com/New_Robert12",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      ),
      color: "text-[#E1306C] group-hover:bg-[#E1306C]/10"
    },
    {
      name: "Facebook",
      value: "Ro Bert",
      url: "https://www.facebook.com/search/top/?q=Ro%20Bert",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ),
      color: "text-[#1877F2] group-hover:bg-[#1877F2]/10"
    }
  ];

  return (
    <div className="p-5 md:p-10 lg:p-12 h-full overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 relative">
      
      {/* Success Notification Toast */}
      {showNotification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-green-900/40 flex items-center space-x-3 border border-green-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold tracking-tight">Message sent to Robert successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto pt-4 md:pt-10">
        <header className="mb-10 md:mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            L5 Software Development @ GSNDP
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight md:leading-none min-h-[1.2em]">
            <span className="typewriter-cursor">
              {renderStyledText()}
            </span>
          </h2>
          <p className="text-slate-400 text-base md:text-xl max-w-2xl leading-relaxed">
            I'm <span className="text-white font-bold">Mugisha Robert</span>, a software developer passionate about creating scalable applications and exploring AI.
          </p>
        </header>

        {/* School Link Section */}
        <div className="mb-12 md:mb-16">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-indigo-500/30 transition-all shadow-xl">
            <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">Official Institution</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-white text-xl font-bold mb-1">GSNDP</p>
                <p className="text-slate-500 text-sm">Quality Education in Software Engineering</p>
              </div>
              <a 
                href="https://www.gsndp.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg text-sm md:text-base whitespace-nowrap"
              >
                WWW.GSNDP.COM
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2-0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-indigo-400 mb-2">12+</div>
            <p className="text-slate-500 font-medium uppercase text-[10px] md:text-xs tracking-widest">Projects Completed</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">L5</div>
            <p className="text-slate-500 font-medium uppercase text-[10px] md:text-xs tracking-widest">Education Level</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-sm">
            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">AI</div>
            <p className="text-slate-500 font-medium uppercase text-[10px] md:text-xs tracking-widest">Innovation Focus</p>
          </div>
        </div>

        {/* Contact Links Section */}
        <section className="mb-16 md:mb-20">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-8">Reach Out & Connect</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-indigo-500/50 transition-all hover:shadow-xl"
              >
                <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all ${link.color}`}>
                  {link.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-sm md:text-base truncate">{link.name}</h4>
                  <p className="text-slate-500 text-xs md:text-sm truncate">{link.value}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Direct Message Form Section */}
        <section className="mb-16 md:mb-20">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Direct Messaging</h3>
                <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
                  Have a specific inquiry or project? Send me a direct message here. I usually respond within 24 hours.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">My Primary Email</p>
                      <p className="text-white font-bold text-sm md:text-base">robertmugisha908@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Your Valid Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Your Message (A few words)</label>
                  <textarea 
                    required
                    rows={4}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Hi Robert, I'd like to talk about..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none placeholder:text-slate-700 shadow-inner"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Secure Message</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* AI Twin CTA Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl mb-12">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Interested in my work?</h3>
            <p className="text-indigo-100 mb-8 max-w-md text-sm md:text-base">Talk to my AI Digital Twin to learn more about my coding philosophy and projects.</p>
            <button 
              onClick={() => onNavigate(ViewMode.AI_AGENT)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-lg"
            >
              Start Chat
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        <footer className="text-center py-10 border-t border-slate-800/50">
          <p className="text-slate-600 text-[10px] md:text-xs uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Mugisha Robert • Designed for Excellence
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomeView;
