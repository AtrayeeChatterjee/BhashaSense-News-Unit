import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom'; 
import API from '../api/axios'; 
import { Sparkles, Globe, User, Briefcase, MapPin, Target, Heart, Loader2, Mail, Lock } from 'lucide-react'; // Added Mail, Lock

const Setup = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',    // New Field
    password: '', // New Field
    occupation: '',
    location: '',
    goals: '',
    preferredLanguage: 'Hindi',
    likedTopics: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStart = async () => {
    // Updated Validation
    if (!formData.name || !formData.email || !formData.password) {
        alert("Name, Email, and Password are required to secure your context!");
        return;
    }

    setLoading(true);
    try {
      const topicsArray = formData.likedTopics
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== "");

      // Sends data to your new /users/setup route (which hashes the password)
      const response = await API.post('/users/setup', {
        ...formData,
        likedTopics: topicsArray
      });

      // Backend returns { token, user }
      if (response.data.token) {
        localStorage.setItem('guru_token', response.data.token); // Store token immediately
        
        setUser({ 
          ...response.data.user, 
          isSetupComplete: true 
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Setup Error:", error);
      alert(error.response?.data?.error || "Onboarding failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden min-h-[600px]">
        
        {/* Left Side: Brand Identity */}
        <div className="w-full md:w-5/12 bg-[#1a1a1a] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-[#ed1c24] blur-[100px]"></div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <Sparkles className="text-[#ed1c24]" size={26} />
            <span className="text-white font-serif italic text-xl tracking-tighter">BhashaSense</span>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center my-auto">
            <h2 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              Defining <span className="text-[#ed1c24]">Your</span> <br/> Digital Context.
            </h2>
            <p className="text-slate-400 mt-8 text-sm md:text-base font-serif italic max-w-xs leading-relaxed">
              "The Guru synthesizes your world to provide intelligence that matters."
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-1 w-8 ${i === 1 ? 'bg-[#ed1c24]' : 'bg-white/20'}`}></div>
              ))}
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Intelligence Unit v2.5</span>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="w-full md:w-7/12 p-8 md:p-14 bg-white flex flex-col justify-center overflow-y-auto">
          <div className="mb-10">
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span className="text-[#ed1c24]">Setup Your Profile</span> 
              <span className="text-[#ed1c24] text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[#ed1c24] font-black">Guru</span>
            </h1>
            <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.2em] font-black">Secure your identity & define your context</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            
            {/* 1. Name */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <User size={12} /> Full Name
              </label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none" placeholder="Atrayee Chatterjee" />
            </div>

            {/* 2. Email (New) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Mail size={12} /> Digital Identity (Email)
              </label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none" placeholder="atrayee@example.com" />
            </div>

            {/* 3. Password (New) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Lock size={12} /> Security Key (Password)
              </label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none" placeholder="••••••••" />
            </div>

             {/* Occupation */} 
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Briefcase size={12} /> Occupation
              </label>
              <input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none" placeholder="B.Tech Student" />
            </div>

            {/* 5. Location */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Location
              </label>
              <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none" placeholder="Jaipur, Rajasthan" />
            </div>

            {/* 6. Language */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Globe size={12} /> Language
              </label>
              <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none cursor-pointer">
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="English">English</option>
                <option value="Hinglish">Hinglish (Hindi + English)</option>
                 <option value="Marathi">Marathi </option>       
                <option value="Telugu">Telugu </option>
                <option value="Tamil">Tamil </option>
                <option value="Gujarati">Gujarati </option>
                <option value="Kannada">Kannada </option>
                <option value="Malayalam">Malayalam </option>
              </select>
            </div>

            {/* 7. Goals */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Target size={12} /> Career Objectives
              </label>
              <input name="goals" value={formData.goals} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none" placeholder="e.g. Mastering Full-Stack Web Development" />
            </div>

            {/* 8. Topics */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Heart size={12} /> Favorite Topics (Comma Separated)
              </label>
              <textarea name="likedTopics" value={formData.likedTopics} onChange={handleChange} className="w-full bg-[#fcfcfc] border-b-2 border-black/10 focus:border-[#ed1c24] p-2.5 text-xs font-bold transition-all outline-none h-16 resize-none" placeholder="AI, MERN Stack, Blockchain..." />
            </div>
          </div>

          <button onClick={handleStart} disabled={loading} className="w-full mt-8 bg-black text-white font-black py-4 text-[11px] tracking-[0.4em] uppercase hover:bg-[#ed1c24] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Initialize Guru"}
          </button>

          <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Already Identified? <Link to="/login" className="text-[#ed1c24] hover:underline">Identify Self Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setup;