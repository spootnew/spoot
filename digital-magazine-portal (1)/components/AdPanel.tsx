
import React, { useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, Video, Megaphone, FileText, CheckCircle2, Phone, MessageCircle, Globe, Instagram } from 'lucide-react';
import { Ad, NewsArticle } from '../types';

interface AdPanelProps {
  ads: Ad[];
  news: NewsArticle[];
  onSave: (ads: Ad[]) => void;
}

const AdPanel: React.FC<AdPanelProps> = ({ ads, news, onSave }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Ad>>({
    mediaType: 'image',
    mediaUrl: '',
    targetNewsId: '',
    phone: '',
    whatsapp: '',
    website: '',
    instagram: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          mediaUrl: reader.result as string,
          mediaType: type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.mediaUrl || !formData.targetNewsId) {
      alert("Hata: Lütfen hem bir dosya yükleyin hem de reklamın hangi haberden önce çıkacağını seçin.");
      return;
    }

    const newAd: Ad = {
      id: "ad_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      mediaUrl: formData.mediaUrl!,
      mediaType: formData.mediaType as 'image' | 'video',
      targetNewsId: formData.targetNewsId!,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      website: formData.website,
      instagram: formData.instagram
    };

    onSave([...ads, newAd]);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu reklamı silmek istediğinize emin misiniz?")) {
      const updated = ads.filter(a => a.id !== id);
      onSave(updated);
    }
  };

  const resetForm = () => {
    setFormData({ mediaType: 'image', mediaUrl: '', targetNewsId: '', phone: '', whatsapp: '', website: '', instagram: '' });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="text-amber-500" size={32} />
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Reklam Paneli</h1>
            </div>
            <p className="text-slate-400 font-medium tracking-wide">Reklamverene ulaşılabilirlik özellikleriyle yeni alanlar oluşturun.</p>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="group flex items-center gap-3 bg-amber-600 text-white px-10 py-5 rounded-2xl hover:bg-amber-500 transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-amber-900/20 active:scale-95"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span>YENİ REKLAM TANIMLA</span>
            </button>
          )}
        </div>

        {isAdding ? (
          <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-10 lg:p-16 shadow-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center mb-12">
               <h2 className="text-2xl font-black uppercase italic text-white tracking-tight flex items-center gap-4">
                 <div className="p-3 bg-amber-500 rounded-2xl"><Plus size={24} className="text-black" /></div>
                 Reklam Kartı Oluşturucu
               </h2>
               <button onClick={resetForm} className="text-slate-500 hover:text-white bg-white/5 p-3 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7 space-y-12">
                {/* 1. Medya Seçimi */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-1">1. REKLAM MATERYALİ</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${formData.mediaType === 'image' ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-white/5 bg-black/40 hover:border-white/10'}`}>
                      <ImageIcon size={32} className={formData.mediaType === 'image' ? 'text-amber-400' : 'text-slate-600'} />
                      <span className="text-[10px] font-black mt-4 uppercase tracking-widest">Görsel</span>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image')} className="hidden" />
                    </label>
                    <label className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${formData.mediaType === 'video' ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10' : 'border-white/5 bg-black/40 hover:border-white/10'}`}>
                      <Video size={32} className={formData.mediaType === 'video' ? 'text-amber-400' : 'text-slate-600'} />
                      <span className="text-[10px] font-black mt-4 uppercase tracking-widest">Video</span>
                      <input type="file" accept="video/*" onChange={e => handleFileUpload(e, 'video')} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* 2. Hedef Seçimi */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-1">2. HEDEF HABER / SAYFA</label>
                  <div className="relative">
                    <select 
                      value={formData.targetNewsId}
                      onChange={e => setFormData(p => ({ ...p, targetNewsId: e.target.value }))}
                      className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold appearance-none uppercase tracking-widest text-[11px]"
                    >
                      <option value="">Hedef Haber Seçiniz...</option>
                      {news.map(n => (
                        <option key={n.id} value={n.id} className="bg-slate-900">{n.title.toUpperCase()}</option>
                      ))}
                    </select>
                    <FileText className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 3. İletişim Bilgileri */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-1">3. İLETİŞİM BUTONLARI (OPSİYONEL)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" />
                       <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all text-xs font-bold" 
                        placeholder="Telefon Numarası" 
                       />
                    </div>
                    <div className="relative">
                       <MessageCircle size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500" />
                       <input 
                        type="text" 
                        value={formData.whatsapp}
                        onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all text-xs font-bold" 
                        placeholder="WhatsApp (905...)" 
                       />
                    </div>
                    <div className="relative">
                       <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" />
                       <input 
                        type="url" 
                        value={formData.website}
                        onChange={e => setFormData(p => ({ ...p, website: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all text-xs font-bold" 
                        placeholder="Web Sitesi URL" 
                       />
                    </div>
                    <div className="relative">
                       <Instagram size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-500" />
                       <input 
                        type="text" 
                        value={formData.instagram}
                        onChange={e => setFormData(p => ({ ...p, instagram: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 pl-14 pr-6 py-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all text-xs font-bold" 
                        placeholder="Instagram Kullanıcı Adı" 
                       />
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 pt-10 border-t border-white/5">
                  <button onClick={resetForm} className="flex-1 py-6 text-slate-500 font-black hover:text-white uppercase tracking-widest text-[11px] transition-colors">Vazgeç</button>
                  <button 
                    onClick={handleSave} 
                    className="flex-[2] py-6 bg-white text-black rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
                  >
                    <CheckCircle2 size={18} />
                    <span>REKLAMI YAYINA AL</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="sticky top-28">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">ÖNİZLEME</label>
                  <div className="aspect-[9/16] bg-black rounded-[3rem] overflow-hidden border-4 border-white/5 relative shadow-3xl group">
                    {formData.mediaUrl ? (
                      <>
                        {formData.mediaType === 'image' ? (
                          <img src={formData.mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <video src={formData.mediaUrl} className="w-full h-full object-cover" controls muted />
                        )}
                        
                        {/* Önizlemedeki Etkileşim İkonları */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 px-6 z-20">
                           {formData.phone && <div className="p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white"><Phone size={20} /></div>}
                           {formData.whatsapp && <div className="p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-green-400"><MessageCircle size={20} /></div>}
                           {formData.website && <div className="p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-blue-400"><Globe size={20} /></div>}
                           {formData.instagram && <div className="p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-pink-400"><Instagram size={20} /></div>}
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 p-12 text-center">
                        <Megaphone size={80} strokeWidth={1} className="mb-6 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-relaxed">Görsel veya video yüklediğinizde önizleme burada belirecektir.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {ads.map(ad => {
              const targetNews = news.find(n => n.id === ad.targetNewsId);
              return (
                <div key={ad.id} className="bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-amber-500/50 transition-all duration-500 shadow-2xl">
                  <div className="aspect-[4/5] relative overflow-hidden bg-black">
                    {ad.mediaType === 'image' ? (
                      <img src={ad.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    ) : (
                      <video src={ad.mediaUrl} className="w-full h-full object-cover" muted />
                    )}
                    <div className="absolute top-6 left-6 px-4 py-2 bg-amber-600 text-white text-[9px] font-black uppercase rounded-xl shadow-xl z-10 tracking-widest">AKTİF REKLAM</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-8">
                    <h4 className="font-bold text-white truncate text-sm mb-2 serif italic">{targetNews?.title || 'Yayınlanmamış İçerik'}</h4>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6">Hedef ID: {ad.targetNewsId}</p>
                    
                    <div className="flex gap-2 mb-8">
                      {ad.phone && <div className="p-2.5 bg-white/5 rounded-lg text-amber-500"><Phone size={14} /></div>}
                      {ad.whatsapp && <div className="p-2.5 bg-white/5 rounded-lg text-green-500"><MessageCircle size={14} /></div>}
                      {ad.website && <div className="p-2.5 bg-white/5 rounded-lg text-blue-500"><Globe size={14} /></div>}
                      {ad.instagram && <div className="p-2.5 bg-white/5 rounded-lg text-pink-500"><Instagram size={14} /></div>}
                    </div>

                    <button 
                      onClick={() => handleDelete(ad.id)}
                      className="w-full py-4 bg-red-950/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Trash2 size={16} />
                      REKLAMI SİL
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPanel;
