import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import API from '../api/axios';
import { useUser } from '../context/UserContext';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      //  backend route: /api/users/login
      const res = await API.post('/users/login', { email, password });
      
      // Store Token & User Data
      localStorage.setItem('guru_token', res.data.token);
      
      // Update Context
      setUser({ ...res.data.user, isSetupComplete: true });
      
      // Push to Dashboard
      navigate('/dashboard');
    } catch (err) {
      //  Backend uses err.response.data.error
      const errorMessage = err.response?.data?.error || "Access Denied";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border-t-8 border-[#ed1c24] p-10 shadow-[20px_20px_0px_0px_rgba(237,28,36,0.2)]">
        
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="text-[#ed1c24]" size={28} />
          <span className="font-serif italic font-black text-2xl tracking-tighter">BhashaSense</span>
        </div>

        <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">Identify <span className="text-[#ed1c24]">Self.</span></h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Access the Intelligence Unit</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-focus-within:text-[#ed1c24] transition-colors">Digital Identity (Email)</label>
            <input 
              type="email" 
              required
              className="w-full border-b-2 border-black/10 focus:border-[#ed1c24] py-3 text-sm font-bold outline-none transition-all bg-transparent"
              placeholder="atrayee@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest group-focus-within:text-[#ed1c24] transition-colors">Security Key (Password)</label>
            <input 
              type="password" 
              required
              className="w-full border-b-2 border-black/10 focus:border-[#ed1c24] py-3 text-sm font-bold outline-none transition-all bg-transparent"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-black py-4 mt-4 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-[#ed1c24] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Initialize Session <ArrowRight size={16}/></>}
          </button>
        </form>

        {/* Added: Link to Setup if they don't have an account */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            New to BhashaSense? 
            <Link to="/setup" className="text-[#ed1c24] ml-2 hover:underline">Begin Onboarding</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;