import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for Logout
import { useUser } from '../context/UserContext';
import API from '../api/axios';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, ExternalLink, User as UserIcon, Loader2, LogOut, X, MapPin, Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user, setUser } = useUser(); // Added setUser for logout
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatReply, setChatReply] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await API.get('/news');
        setArticles(response.data.articles || []);
      } catch (err) {
        console.error("News Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // PERMANENT FIX: Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('guru_token');
    setUser(null);
    navigate('/login');
  };

  const handleBhashaIt = async (article) => {
    const id = user?._id || user?.userId;
    if (!id) return alert("Session expired. Please login again.");

    setSelectedNews(article);
    setAiLoading(true);
    setAiResponse("");
    setChatReply(""); 
    
    try {
      const response = await API.post('/chat/bhasha-it', {
        article: { title: article.title, description: article.description },
        userId: id 
      });
      setAiResponse(response.data.aiResponse);
    } catch (err) {
      setAiResponse("### Guru is offline\nPlease check your connectivity or API key.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#111111] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#ed1c24] w-10 h-10" />
      <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Syncing Intelligence...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-[#333] font-sans selection:bg-[#ed1c24] selection:text-white">
      {/* 1. TOP STATUS BAR */}
      <div className="bg-[#ed1c24] py-2 text-center text-[10px] text-white font-black tracking-[0.3em] uppercase">
        BhashaSense Intelligence • {user?.occupation || 'Reader'} Edition • v2.5
      </div>
      
      {/* 2. REFINED NAVBAR */}
      <nav className="border-b-4 border-black p-5 flex justify-between items-center bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex flex-col">
          <span className="font-serif text-4xl font-black italic tracking-tighter text-black leading-none">
            Bhasha<span className="text-[#ed1c24]">Sense</span>
          </span>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Feed Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden lg:flex flex-col text-right border-r border-slate-200 pr-6">
            <div className="flex items-center justify-end gap-2 text-xs font-black uppercase text-black">
               <Calendar size={12} className="text-[#ed1c24]"/>
               {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
               <MapPin size={10}/> {user?.location || 'Global'} Sector
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col text-right mr-2">
               <span className="text-[10px] font-black uppercase tracking-tighter">{user?.name}</span>
               <span className="text-[8px] text-[#ed1c24] font-bold uppercase">Authorized Personnel</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group"
            >
              <LogOut size={14} className="group-hover:rotate-12 transition-transform"/> 
              <span className="hidden md:inline">Terminate Session</span>
              <span className="md:hidden">Logout</span>
            </button>
          </div>
        </div>
      </nav>
            
      {/* MAIN NEWS GRID */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {articles.map((item, index) => (
            <div key={index} className={`${index === 0 ? 'md:col-span-8' : 'md:col-span-4'} bg-white border-2 border-black group flex flex-col hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] transition-all relative overflow-hidden`}>
              {item.urlToImage && (
                <div className="aspect-video overflow-hidden border-b-2 border-black">
                  <img src={item.urlToImage} alt="news" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[9px] font-black text-[#ed1c24] uppercase tracking-[0.2em] mb-2 inline-block">Flash Update</span>
                <h3 className={`font-serif ${index === 0 ? 'text-3xl' : 'text-xl'} font-black text-black mb-4 leading-tight tracking-tight`}>{item.title}</h3>
                
                <div className="mt-auto pt-6 flex gap-2">
                  <button onClick={() => handleBhashaIt(item)} className="flex-grow flex items-center justify-center gap-3 bg-black hover:bg-[#ed1c24] text-white font-black py-4 text-[10px] tracking-[0.2em] uppercase transition-all active:scale-95 shadow-lg shadow-black/10">
                    <Sparkles size={14} /> Bhasha-IT (AI)
                  </button>
                  <a href={item.url} target="_blank" rel="noreferrer" className="border-2 border-black p-3 hover:bg-black hover:text-white transition-all flex items-center justify-center"><ExternalLink size={18} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. BHASHASENSE GURU MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="w-full max-w-5xl max-h-[92vh] bg-[#fcf9f4] border-[6px] border-black shadow-[30px_30px_0px_0px_rgba(237,28,36,0.2)] flex flex-col animate-in fade-in zoom-in duration-300">
             
             <div className="p-5 border-b-4 border-black flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-[#ed1c24]" size={22}/>
                    <span className="font-serif italic font-black text-2xl uppercase tracking-tighter">BhashaSense <span className="text-[#ed1c24]">Guru</span></span>
                </div>
                <button onClick={() => setSelectedNews(null)} className="hover:text-[#ed1c24] hover:rotate-90 transition-all p-1"><X size={32} strokeWidth={3}/></button>
             </div>
             
             <div className="overflow-y-auto p-6 md:p-12">
                {aiLoading && !aiResponse ? (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 className="animate-spin text-[#ed1c24] mb-6" size={50} />
                        <p className="font-serif italic text-xl text-slate-500 text-center animate-pulse">The Guru is synthesizing your intelligence report...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h2 style={{ color: '#ed1c24' }} className="font-serif text-4xl font-black mb-8 border-b-8 border-[#ed1c24] pb-2 inline-block tracking-tighter">
                              Special Report
                            </h2>
                            <div className="text-[#1a1a1a] text-xl leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-[#ed1c24] first-letter:font-serif prose prose-slate max-w-none">
                                <ReactMarkdown>{aiResponse}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="bg-white border-4 border-black p-8 self-start sticky top-0 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                            <h4 className="font-black text-[#ed1c24] text-[11px] tracking-[0.3em] mb-6 uppercase border-b-2 border-black pb-3 text-center">Inquiry Terminal</h4>
                            {chatReply && <div className="bg-[#fff1f1] p-4 border-l-8 border-[#ed1c24] mb-6 text-sm font-bold italic text-slate-900 leading-relaxed shadow-sm">{chatReply}</div>}
                            <textarea value={userQuestion} onChange={(e) => setUserQuestion(e.target.value)} placeholder="Submit follow-up query..." className="w-full bg-[#f8f8f8] border-2 border-black p-4 text-xs mb-4 outline-none focus:border-[#ed1c24] h-32 resize-none font-bold placeholder:text-slate-300" />
                            <button 
                              disabled={aiLoading}
                              onClick={async () => {
                                setAiLoading(true);
                                try {
                                  const res = await API.post('/chat/ask-it', { userId: user?._id || user?.userId, question: userQuestion, articleContext: { title: selectedNews.title, summary: aiResponse } });
                                  setChatReply(res.data.reply);
                                } catch (err) {
                                  setChatReply("Intelligence Unit unavailable. Check server status.");
                                }
                                setAiLoading(false);
                              }} 
                              className="w-full bg-black text-white font-black py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-[#ed1c24] transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                              {aiLoading ? <Loader2 className="animate-spin" size={14}/> : 'Submit Query'}
                            </button>
                        </div>
                    </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;