
import React, { useState, useEffect, useMemo } from 'react';
import { Newspaper, Settings, BookOpen, Megaphone, Lock, ChevronRight, X, LogOut } from 'lucide-react';
import { NewsArticle, Ad, ViewMode } from './types';
import AdminPanel from './components/AdminPanel';
import MagazineView from './components/MagazineView';
import ReaderMode from './components/ReaderMode';
import AdPanel from './components/AdPanel';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('magazine');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [footerClicks, setFooterClicks] = useState<number>(0);

  // Gömme Modu (Embed Mode) Kontrolü
  const isEmbedded = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('embed') === 'true';
  }, []);

  useEffect(() => {
    const savedNews = localStorage.getItem('lumina_mag_v2');
    const savedAds = localStorage.getItem('lumina_ads_v2');
    const adminStatus = localStorage.getItem('spoot_admin_active');
    
    if (savedNews) setNews(JSON.parse(savedNews));
    if (savedAds) setAds(JSON.parse(savedAds));
    if (adminStatus === 'true') setIsAdmin(true);

    if (!savedNews) {
      const mockNews: NewsArticle[] = [
        {
          id: '1',
          title: 'THE SILENCE OF FORM',
          author: 'Julian V. Rossi',
          content: 'In the heart of the modern metropolis...',
          createdAt: new Date().toISOString(),
          category: 'MINIMAL',
          mediaType: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2000',
          isCover: true
        }
      ];
      setNews(mockNews);
      localStorage.setItem('lumina_mag_v2', JSON.stringify(mockNews));
    }
  }, []);

  // Sayfa başlığını güncelle
  useEffect(() => {
    document.title = isEmbedded ? "SPOOT Digital" : "SPOOT | Interactive Magazine";
  }, [isEmbedded]);

  const bgMediaShards = useMemo(() => {
    if (news.length === 0) return [];
    return [...news].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [news]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'spoot2025') {
      setIsAdmin(true);
      localStorage.setItem('spoot_admin_active', 'true');
      setShowLoginModal(false);
      setPassword('');
    } else {
      alert("Hatalı şifre.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('spoot_admin_active');
    setViewMode('magazine');
  };

  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount >= 3) {
      setShowLoginModal(true);
      setFooterClicks(0);
    }
    setTimeout(() => setFooterClicks(0), 3000);
  };

  const saveNews = (updatedNews: NewsArticle[]) => {
    setNews(updatedNews);
    localStorage.setItem('lumina_mag_v2', JSON.stringify(updatedNews));
  };

  const saveAds = (updatedAds: Ad[]) => {
    setAds([...updatedAds]);
    localStorage.setItem('lumina_ads_v2', JSON.stringify(updatedAds));
  };

  const handleRead = (article: NewsArticle) => {
    setSelectedArticle(article);
    setViewMode('reader');
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white bg-black relative ${isEmbedded ? 'overflow-hidden' : ''}`}>
      
      {/* ARKA PLAN ATMOSFERİ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="spotlight spotlight-indigo"></div>
        <div className="spotlight spotlight-amber"></div>
        {!isEmbedded && (
          <div className="absolute inset-0">
            {bgMediaShards.map((item, idx) => (
               <div key={item.id} className="floating-media-shard" style={{ top: `${idx * 20}%`, left: `${idx * 15}%`, width: '20vw', height: '15vw', animationDelay: `${idx * 2}s` }}>
                  {item.mediaType === 'image' ? <img src={item.mediaUrl} className="w-full h-full object-cover" /> : <video src={item.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />}
               </div>
            ))}
          </div>
        )}
      </div>

      {/* ADMIN TOOLBAR - Sadece yöneticiye ve embed olmayan modda görünür */}
      {!isEmbedded && isAdmin && viewMode !== 'reader' && (
        <div className="sticky top-0 z-[110] bg-indigo-600 px-8 py-2 flex justify-between items-center shadow-lg">
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Yönetim Paneli</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('magazine')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'magazine' ? 'bg-white text-indigo-600' : 'text-white/60 hover:text-white'}`}>Dergi</button>
                <button onClick={() => setViewMode('admin')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'admin' ? 'bg-white text-indigo-600' : 'text-white/60 hover:text-white'}`}>Haberler</button>
                <button onClick={() => setViewMode('ad_manager')} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'ad_manager' ? 'bg-white text-indigo-600' : 'text-white/60 hover:text-white'}`}>Reklamlar</button>
              </div>
           </div>
           <button onClick={handleLogout} className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest">Çıkış</span>
              <LogOut size={14} />
           </button>
        </div>
      )}

      {/* ANA NAVIGASYON - Embed modunda gizlenir */}
      {!isEmbedded && viewMode !== 'reader' && (
        <nav className={`sticky ${isAdmin ? 'top-[44px]' : 'top-0'} z-[60] bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 px-8 py-5 flex justify-center items-center`}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('magazine')}>
            <div className="bg-white text-black p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Newspaper size={20} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase serif text-white">SPOOT</span>
          </div>
        </nav>
      )}

      <main className={`flex-grow relative z-10 ${isEmbedded ? 'h-screen w-screen overflow-hidden' : ''}`}>
        {viewMode === 'magazine' && (
          <MagazineView news={news} ads={ads} onRead={handleRead} />
        )}
        
        {viewMode === 'admin' && isAdmin && (
          <AdminPanel news={news} onSave={saveNews} />
        )}

        {viewMode === 'ad_manager' && isAdmin && (
          <AdPanel ads={ads} news={news} onSave={saveAds} />
        )}

        {viewMode === 'reader' && selectedArticle && (
          <ReaderMode 
            article={selectedArticle} 
            onClose={() => setViewMode('magazine')} 
          />
        )}
      </main>

      {/* FOOTER - Embed modunda gizlenir */}
      {!isEmbedded && viewMode !== 'reader' && (
        <footer className="bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-12 px-8 text-center relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
             <span className="serif italic text-3xl text-white opacity-20 tracking-tighter select-none">SPOOT Editorial</span>
             <p onClick={handleFooterClick} className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em] cursor-pointer hover:text-slate-400 transition-colors">&copy; {new Date().getFullYear()} SPOOT Digital Press Archive.</p>
          </div>
        </footer>
      )}

      {/* ADMIN GİRİŞ MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-10">
                <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20">
                  <Lock size={24} className="text-white" />
                </div>
                <button onClick={() => setShowLoginModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <h3 className="text-3xl font-black serif italic text-white mb-2">Editor Login</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Erişim kodunu kullanarak yönetim paneline girin.</p>
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <input autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Erişim Kodu" className="w-full bg-black/50 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono text-center tracking-[0.5em] text-lg" />
                <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5">
                  <span>GİRİŞ YAP</span>
                  <ChevronRight size={18} />
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
