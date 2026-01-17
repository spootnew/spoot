
import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, Bookmark, Share2, CornerRightDown, ArrowDownCircle, BookOpen } from 'lucide-react';
import { NewsArticle } from '../types';

interface ReaderModeProps {
  article: NewsArticle;
  onClose: () => void;
}

const ReaderMode: React.FC<ReaderModeProps> = ({ article, onClose }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.style.backgroundColor = '#fdfbf7'; // High-end paper color
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.body.style.backgroundColor = '#000';
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parallax transform calculation
  const mediaTranslateY = scrollY * 0.4;
  const contentFadeOpacity = Math.max(0, 1 - scrollY / 500);

  return (
    <div className="relative min-h-screen bg-[#fdfbf7] selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* Paper Grain Overlay */}
      <div className="paper-texture" />

      {/* Modern Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
        <button 
          onClick={onClose}
          className="group flex items-center gap-3 font-black uppercase tracking-tighter text-[10px] hover:scale-105 transition-all"
        >
          <div className="p-2 bg-white text-black rounded-lg">
             <ArrowLeft size={14} strokeWidth={4} />
          </div>
          <span className="hidden sm:inline">ARCHIVE</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
           <span className="font-black italic serif text-2xl tracking-tighter">SPOOT</span>
           <div className="h-[2px] w-8 bg-white/20 mt-1" />
        </div>
        <div className="flex items-center gap-4">
           <span className="hidden lg:block text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Issue No. 001 // 2025</span>
           <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>
      </nav>

      {/* PROGRESS BAR (Edge Style) */}
      <div className="fixed top-0 left-0 h-1 bg-indigo-600 z-[110] transition-all duration-300" style={{ width: `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%` }} />

      {/* HERO SECTION: PARALLAX SPREAD */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center">
        {/* Fixed Parallax Media */}
        <div 
          className="absolute inset-0 z-0 bg-black"
          style={{ transform: `translateY(${mediaTranslateY}px)` }}
        >
          {article.mediaType === 'image' ? (
            <img src={article.mediaUrl} className="w-full h-[120vh] object-cover opacity-80" alt="" />
          ) : (
            <video src={article.mediaUrl} autoPlay loop muted playsInline className="w-full h-[120vh] object-cover opacity-80" />
          )}
          {/* Subtle Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fdfbf7]" />
        </div>

        {/* Floating Page Indicator */}
        <div 
           className="absolute bottom-12 left-12 z-20 flex items-center gap-4 animate-bounce"
           style={{ opacity: contentFadeOpacity }}
        >
          <ArrowDownCircle size={40} strokeWidth={1} className="text-white/30" />
          <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">Giriş Sayfası // Aşağı Kaydır</span>
        </div>
      </div>

      {/* MAIN EDITORIAL BODY */}
      <article className="relative z-10 w-full flex flex-col items-center">
        
        {/* OFFSET HEADLINE BOX - Hero image üstüne binmeden, scroll ile gelen çarpıcı giriş */}
        <div className="w-full max-w-[1400px] px-6 lg:px-20 -mt-[15vh]">
          <div className="bg-[#fdfbf7] p-12 lg:p-24 shadow-[0_-50px_100px_rgba(0,0,0,0.1)] rounded-t-[3rem] lg:rounded-t-[5rem] relative">
            
            {/* Page Back Shadow Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent rounded-tl-[5rem]" />

            <div className="flex flex-col lg:flex-row gap-16 lg:items-end mb-20">
               <div className="flex-1">
                 <span className="inline-block px-4 py-1.5 border border-indigo-600 text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                   {article.category} // DOSYA KONUSU
                 </span>
                 <h1 className="text-6xl lg:text-[11rem] font-black serif text-slate-900 leading-[0.85] tracking-tighter italic">
                   {article.title}
                 </h1>
               </div>
               <div className="w-full lg:w-1/3 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EDİTÖRYAL EKİBİ</span>
                 </div>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed italic uppercase tracking-wider">
                   "{article.title}" üzerine derinlemesine bir estetik yolculuk ve dijital arşive yeni bir perspektif kazandıran özel inceleme.
                 </p>
                 <div className="flex items-center gap-4 text-slate-900 font-black text-[11px] tracking-widest uppercase">
                    <span>{article.author}</span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    <span className="opacity-40">{new Date(article.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</span>
                 </div>
               </div>
            </div>

            {/* CONTENT START */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
               {/* Left: Introduction Block */}
               <div className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-12">
                  <div className="p-8 border-l-4 border-indigo-600 bg-slate-50 italic text-xl text-slate-700 leading-relaxed font-medium serif">
                    SPOOT, her sayıda yeni perspektifler sunmayı hedefler. Bu içerik, tasarımın sessiz gücünü ve formun disiplinini odağına almaktadır.
                  </div>
                  <div className="hidden lg:block">
                     <span className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-8">PAYLAŞ</span>
                     <div className="flex flex-col gap-6">
                        <button className="flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-colors">
                           <Share2 size={18} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Koleksiyona Ekle</span>
                        </button>
                        <button className="flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-colors">
                           <Bookmark size={18} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Yer İmi</span>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Right: Main Content (Columned layout feel) */}
               <div className="lg:col-span-8">
                  <div className="prose prose-slate prose-lg lg:prose-2xl max-w-none prose-headings:serif prose-headings:italic prose-headings:font-black prose-img:rounded-3xl prose-img:shadow-2xl">
                     {/* Article Body with Custom Drop-Cap */}
                     <div className="drop-cap text-slate-800 leading-[1.8] font-medium text-xl lg:text-2xl" dangerouslySetInnerHTML={{ __html: article.content }} />
                  </div>

                  <div className="mt-20 pt-20 border-t border-slate-100 flex flex-col items-center">
                    <blockquote className="text-center space-y-8 my-20">
                      <span className="block text-4xl lg:text-6xl serif italic font-black text-slate-900 leading-[1.1] tracking-tight">"Zarafet, sadece görünür olanın değil, hissedilenin de tasarımıdır."</span>
                      <cite className="block text-xs uppercase tracking-[0.6em] font-black text-indigo-600 not-italic">— Studio SPOOT International</cite>
                    </blockquote>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* CLOSING SECTION */}
        <section className="w-full bg-slate-900 py-32 lg:py-48 px-8 flex flex-col items-center text-center relative overflow-hidden">
           {/* Abstract Background for footer */}
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[30vw] font-black serif italic text-white leading-none tracking-tighter">SPOOT</div>
           </div>

           <div className="relative z-10 flex flex-col items-center gap-12">
              <div className="p-8 bg-white text-black rounded-full shadow-3xl">
                <CornerRightDown size={48} strokeWidth={1} />
              </div>
              <div>
                <h3 className="text-4xl lg:text-7xl font-black serif italic text-white tracking-tighter mb-4">Okuduğunuz için teşekkürler.</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.5em]">SPOOT Press Digital Archive // International Edition</p>
              </div>
              <button 
                onClick={onClose}
                className="group relative overflow-hidden bg-white text-black px-16 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-4">
                  <span>YAYINI KAPAT</span>
                  <BookOpen size={18} className="group-hover:rotate-12 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
           </div>
        </section>
      </article>

      {/* Side Metadata (Vertical) */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-lr] text-[9px] font-black uppercase tracking-[0.8em] text-slate-300 pointer-events-none select-none mix-blend-difference">
        SPOOT DIGITAL PRESS // INTERNATIONAL // COLLECTORS EDITION 01
      </div>
    </div>
  );
};

export default ReaderMode;
