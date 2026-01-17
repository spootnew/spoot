
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Eye, Grid, X, Layout, FastForward, BookOpen, Phone, MessageCircle, Globe, Instagram } from 'lucide-react';
import { NewsArticle, Ad } from '../types';

interface MagazineViewProps {
  news: NewsArticle[];
  ads: Ad[];
  onRead: (article: NewsArticle) => void;
}

const MagazineView: React.FC<MagazineViewProps> = ({ news, ads, onRead }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContents, setShowContents] = useState(false);
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [pendingAction, setPendingAction] = useState<{ type: 'read' | 'nav', target: any } | null>(null);

  const sortedNews = useMemo(() => {
    if (!news.length) return [];
    const coverIdx = news.findIndex(n => n.isCover);
    const items = [...news];
    if (coverIdx !== -1) {
      const [cover] = items.splice(coverIdx, 1);
      return [cover, ...items];
    }
    return items;
  }, [news]);

  const coverTeasers = sortedNews.slice(1, 4);

  const checkAdAndProceed = (targetArticle: NewsArticle, actionType: 'read' | 'nav') => {
    const adFound = ads.find(a => String(a.targetNewsId) === String(targetArticle.id));
    if (adFound) {
      setActiveAd(adFound);
      setPendingAction({ type: actionType, target: targetArticle });
    } else {
      if (actionType === 'read') {
        onRead(targetArticle);
      } else {
        const idx = sortedNews.findIndex(n => n.id === targetArticle.id);
        if (idx !== -1) setCurrentIndex(idx);
      }
    }
  };

  const skipAd = () => {
    if (pendingAction) {
      if (pendingAction.type === 'read') {
        onRead(pendingAction.target);
      } else {
        const idx = sortedNews.findIndex(n => n.id === pendingAction.target.id);
        if (idx !== -1) setCurrentIndex(idx);
      }
      setActiveAd(null);
      setPendingAction(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < sortedNews.length - 1) {
      const nextArticle = sortedNews[currentIndex + 1];
      checkAdAndProceed(nextArticle, 'nav');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevArticle = sortedNews[currentIndex - 1];
      checkAdAndProceed(prevArticle, 'nav');
    }
  };

  const goToArticle = (index: number) => {
    checkAdAndProceed(sortedNews[index], 'nav');
    setShowContents(false);
  };

  // İletişim Aksiyonları
  const handleContact = (type: string, value: string) => {
    switch (type) {
      case 'phone':
        window.location.href = `tel:${value}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'website':
        const url = value.startsWith('http') ? value : `https://${value}`;
        window.open(url, '_blank');
        break;
      case 'instagram':
        const igUrl = value.includes('instagram.com') ? value : `https://instagram.com/${value.replace('@', '')}`;
        window.open(igUrl, '_blank');
        break;
    }
  };

  if (sortedNews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-500">
        <Layout className="mb-4 opacity-20" size={64} />
        <p className="text-2xl font-black italic serif text-white">SPOOT Yayın Arşivi Boş</p>
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] flex flex-col items-center justify-center bg-transparent px-4 lg:px-12 relative overflow-hidden">
      
      {/* REKLAM KATMANI */}
      {activeAd && (
        <div className="fixed inset-0 z-[2000] bg-black animate-in fade-in duration-500 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {activeAd.mediaType === 'image' ? (
              <img src={activeAd.mediaUrl} className="w-full h-full object-contain" alt="Ad" />
            ) : (
              <video 
                src={activeAd.mediaUrl} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-contain" 
                onEnded={skipAd}
                onError={() => skipAd()}
              />
            )}

            {/* Reklam İletişim İkonları - YANIP SÖNEN */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-8 z-[2020] animate-in slide-in-from-bottom-10 duration-1000">
               {activeAd.phone && (
                 <button 
                  onClick={() => handleContact('phone', activeAd.phone!)}
                  className="group flex flex-col items-center gap-3 transition-all"
                 >
                    <div className="p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all animate-icon-pulse">
                       <Phone size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">ARA</span>
                 </button>
               )}
               {activeAd.whatsapp && (
                 <button 
                  onClick={() => handleContact('whatsapp', activeAd.whatsapp!)}
                  className="group flex flex-col items-center gap-3 transition-all"
                 >
                    <div className="p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full text-green-400 hover:bg-green-500 hover:text-white transition-all animate-icon-pulse" style={{ animationDelay: '0.2s' }}>
                       <MessageCircle size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">WHATSAPP</span>
                 </button>
               )}
               {activeAd.website && (
                 <button 
                  onClick={() => handleContact('website', activeAd.website!)}
                  className="group flex flex-col items-center gap-3 transition-all"
                 >
                    <div className="p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full text-blue-400 hover:bg-blue-500 hover:text-white transition-all animate-icon-pulse" style={{ animationDelay: '0.4s' }}>
                       <Globe size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">WEB</span>
                 </button>
               )}
               {activeAd.instagram && (
                 <button 
                  onClick={() => handleContact('instagram', activeAd.instagram!)}
                  className="group flex flex-col items-center gap-3 transition-all"
                 >
                    <div className="p-6 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full text-pink-400 hover:bg-pink-500 hover:text-white transition-all animate-icon-pulse" style={{ animationDelay: '0.6s' }}>
                       <Instagram size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">INSTAGRAM</span>
                 </button>
               )}
            </div>

            <div className="absolute top-12 left-12 z-[2010] flex flex-col gap-2">
              <span className="bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full">Sponsorlu Reklam</span>
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-shrink" style={{ animationDuration: '8s' }} />
              </div>
            </div>
            <div className="absolute bottom-12 right-12 z-[2010]">
              <button onClick={skipAd} className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-amber-500 transition-all shadow-2xl active:scale-95">
                <span>Reklamı Atla</span>
                <FastForward size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* İÇİNDEKİLER MODAL */}
      {showContents && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl p-10 lg:p-20 overflow-y-auto animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white text-black rounded-2xl"><BookOpen size={24} /></div>
                 <h3 className="text-4xl font-black serif italic text-white tracking-tighter uppercase">İçindekiler</h3>
              </div>
              <button 
                onClick={() => setShowContents(false)}
                className="group flex items-center gap-3 bg-white/5 hover:bg-white text-slate-400 hover:text-black px-8 py-4 rounded-full transition-all font-black uppercase tracking-widest text-xs"
              >
                <span>KAPAT</span>
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
               {sortedNews.map((article, index) => (
                 <div 
                   key={article.id} 
                   onClick={() => goToArticle(index)}
                   className="group cursor-pointer space-y-4"
                 >
                    <div className="aspect-[4/5] bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 relative shadow-2xl group-hover:border-indigo-500 transition-all duration-500">
                      {article.mediaType === 'image' ? (
                        <img src={article.mediaUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
                      ) : (
                        <video src={article.mediaUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" muted />
                      )}
                      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl text-[10px] font-black text-white/70 border border-white/10 uppercase tracking-widest">
                        P.{index + 1}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-8 left-8 right-8">
                         <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 block">{article.category}</span>
                         <h4 className="text-lg font-bold text-white leading-tight serif italic group-hover:text-indigo-400 transition-colors line-clamp-2">{article.title}</h4>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl relative magazine-container flex justify-center items-center">
        {/* Navigasyon Okları */}
        <div className="fixed left-6 lg:left-24 top-1/2 -translate-y-1/2 z-[70]">
          <button onClick={handlePrev} disabled={currentIndex === 0} className={`p-6 text-white/10 transition-all ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:text-white hover:scale-125'}`}><ChevronLeft size={72} strokeWidth={1} /></button>
        </div>
        <div className="fixed right-6 lg:right-24 top-1/2 -translate-y-1/2 z-[70]">
          <button onClick={handleNext} disabled={currentIndex === sortedNews.length - 1} className={`p-6 text-white/10 transition-all ${currentIndex === sortedNews.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:text-white hover:scale-125'}`}><ChevronRight size={72} strokeWidth={1} /></button>
        </div>

        {/* DERGİ GÖVDESİ */}
        <div className="relative h-[75vh] lg:h-[88vh] w-full max-w-xl lg:max-w-2xl transition-all duration-1000 ease-in-out">
          {/* Sayfa Altı Gölge Efekti */}
          <div className="absolute inset-0 bg-black/40 rounded-r-2xl blur-[100px] transform translate-x-12 translate-y-12 scale-90" />
          
          <div className="relative w-full h-full">
            {sortedNews.map((article, idx) => {
              const isFlipped = idx < currentIndex;
              const isFirstPage = idx === 0;
              const zIndex = isFlipped ? idx : (sortedNews.length - idx);

              return (
                <div key={article.id} className={`page-wrapper ${isFlipped ? 'flipped' : ''}`} style={{ zIndex }}>
                  {/* Sayfa Ön Yüzü */}
                  <div className="page-front bg-[#0a0a0a] overflow-hidden group border-r border-white/5">
                    <div className="absolute inset-0 bg-black">
                      {article.mediaType === 'image' ? (
                        <img src={article.mediaUrl} className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" alt="" />
                      ) : (
                        <video src={article.mediaUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-10 lg:p-14 z-30">
                      <div className="flex justify-between items-start">
                         <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/60 bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10">{article.category}</span>
                         <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">EDITION 01 // P.{idx + 1}</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <h2 className={`font-black serif text-white leading-[1.1] tracking-tight drop-shadow-2xl transition-all ${isFirstPage ? 'text-2xl lg:text-3xl border-l border-white/20 pl-6 uppercase' : 'text-lg lg:text-xl italic'}`}>
                          {article.title}
                        </h2>
                        {isFirstPage && (
                           <p className="text-white/30 font-black uppercase tracking-[0.5em] text-[8px] mt-8 ml-7">SPOOT DIGITAL ARCHIVE // 2025</p>
                        )}
                      </div>

                      {/* Kapak Teaserları */}
                      {isFirstPage && coverTeasers.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 mb-8 max-w-[240px]">
                          {coverTeasers.map((teaser) => (
                            <div 
                              key={teaser.id} 
                              onClick={(e) => { e.stopPropagation(); checkAdAndProceed(teaser, 'read'); }} 
                              className="group/teaser flex items-center gap-4 p-2.5 bg-black/40 backdrop-blur-3xl rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
                            >
                              <div className="w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-white/10">
                                <img src={teaser.mediaUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover/teaser:grayscale-0 transition-all" alt="" />
                              </div>
                              <h4 className="text-[8px] font-bold text-white/80 leading-tight serif line-clamp-2 uppercase tracking-wide">{teaser.title}</h4>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col items-center gap-6 mt-auto">
                        <div className="flex gap-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); checkAdAndProceed(article, 'read'); }} 
                            className="animate-pulse-neon group flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95"
                          >
                            <Eye size={12} />
                            <span>GÖRÜNTÜLE</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowContents(true); }} 
                            className="flex items-center gap-3 bg-black/60 border border-white/10 text-white/60 px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-white hover:text-black transition-all backdrop-blur-2xl"
                          >
                            <Grid size={12} />
                            <span>İÇİNDEKİLER</span>
                          </button>
                        </div>
                        <div className="opacity-10 pointer-events-none select-none">
                          <p className="text-white font-black text-6xl serif italic leading-none">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sayfa Arka Yüzü */}
                  <div className="page-back flex flex-col items-center justify-center p-12 bg-[#050505] border-r border-white/5 shadow-inner">
                     <div className="text-white/[0.02] font-black serif text-[14rem] italic select-none">{idx + 1}</div>
                     <p className="text-white/[0.05] uppercase tracking-[1.5em] text-[8px] mt-6 font-black">SPOOT // COLLECTORS EDITION</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sayfa İlerleme Çubuğu */}
      <div className="mt-16 flex items-center gap-3 relative z-[80]">
        {sortedNews.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className={`h-0.5 rounded-full transition-all duration-1000 ${idx === currentIndex ? 'w-12 bg-white' : 'w-2 bg-white/10 hover:bg-white/30'}`} 
          />
        ))}
      </div>

      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
        .animate-shrink { animation: shrink linear forwards; }
      `}</style>
    </div>
  );
};

export default MagazineView;
