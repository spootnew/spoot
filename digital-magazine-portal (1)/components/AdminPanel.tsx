
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Video, User, Layout, FileText, Star, Wand2, CheckCircle2, Code, Copy, Check, Globe, Share2, Info, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { NewsArticle } from '../types';

interface AdminPanelProps {
  news: NewsArticle[];
  onSave: (news: NewsArticle[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ news, onSave }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  
  // URL Tespiti: Mevcut sayfanın temiz halini al
  const defaultUrl = useMemo(() => {
    const current = window.location.href.split('?')[0].split('#')[0];
    return current.endsWith('/') ? current.slice(0, -1) : current;
  }, []);

  const [siteUrl, setSiteUrl] = useState(defaultUrl);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewsArticle>>({
    title: '',
    author: '',
    content: '',
    category: 'CULTURE',
    mediaType: 'image',
    mediaUrl: '',
    isCover: false
  });

  // Dinamik Gömme Kodu Oluşturucu
  const embedCode = useMemo(() => {
    // URL'nin sonundaki "/" karakterini kontrol et ve ?embed=true ekle
    const cleanBaseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    const finalSrc = `${cleanBaseUrl}?embed=true`;
    return `<div style="width:100%;max-width:1200px;height:800px;margin:0 auto;overflow:hidden;border-radius:24px;box-shadow:0 30px 60px rgba(0,0,0,0.3);"><iframe src="${finalSrc}" width="100%" height="100%" frameborder="0" allow="camera; microphone; geolocation" allowfullscreen></iframe></div>`;
  }, [siteUrl]);

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, mediaUrl: reader.result as string, mediaType: type }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.content || formData.content === '<p><br></p>') {
      alert("Lütfen haber başlığı ve içeriğini doldurun.");
      return;
    }
    let updatedNews: NewsArticle[];
    const finalNewsList = formData.isCover ? news.map(item => ({ ...item, isCover: false })) : [...news];
    if (editingId) {
      updatedNews = finalNewsList.map(item => item.id === editingId ? { ...item, ...formData as NewsArticle } : item);
    } else {
      const newArticle: NewsArticle = { id: "art_" + Date.now(), createdAt: new Date().toISOString(), ...(formData as Omit<NewsArticle, 'id' | 'createdAt'>) };
      updatedNews = [newArticle, ...finalNewsList];
    }
    onSave(updatedNews);
    resetForm();
    alert("Başarıyla kaydedildi!");
  };

  const handleEdit = (article: NewsArticle) => {
    setFormData(article);
    setEditingId(article.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: '', author: '', content: '', category: 'CULTURE', mediaType: 'image', mediaUrl: '', isCover: false });
    setEditingId(null);
    setIsAdding(false);
  };

  const refreshPreview = () => setPreviewKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-transparent text-slate-200 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-1 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">EDITORIAL PANEL</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">SPOOT Desk</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowEmbedCode(true)} className="flex items-center gap-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 px-8 py-5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-xl"><Code size={18} /><span>GÖMME SİHİRBAZI</span></button>
            {!isAdding && <button onClick={() => setIsAdding(true)} className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl hover:bg-slate-200 transition-all shadow-2xl font-black uppercase tracking-widest text-[10px]"><Plus size={20} /><span>YENİ HABER</span></button>}
          </div>
        </div>

        {/* ENTEGRASYON SİHİRBAZI */}
        {showEmbedCode && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-6xl bg-slate-900 border border-white/10 rounded-[3rem] p-8 lg:p-12 shadow-3xl max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-5">
                   <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30"><Globe size={32} /></div>
                   <div>
                     <h3 className="text-3xl font-black serif italic text-white tracking-tight">Entegrasyon Merkezi</h3>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">404 HATASINI ÖNLEMEK İÇİN DOĞRU URL GİRDİĞİNİZDEN EMİN OLUN</p>
                   </div>
                </div>
                <button onClick={() => setShowEmbedCode(false)} className="text-slate-500 hover:text-white bg-white/5 p-4 rounded-full transition-colors"><X size={28} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                        <div className="w-5 h-5 bg-indigo-600 text-white flex items-center justify-center rounded-full text-[8px]">1</div>
                        DERGİNİN YAYINLANDIĞI URL (PUBLIC)
                      </label>
                      <input 
                        type="url" 
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="https://derginiz.netlify.app"
                        className="w-full bg-black/50 border border-white/10 px-6 py-5 rounded-2xl text-white font-bold text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                      />
                      <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                         <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                         <p className="text-[10px] text-amber-200/70 leading-relaxed italic">
                           <b>ÖNEMLİ:</b> Derginiz bir hostinge (Netlify, Vercel vb.) yüklenmeden gömme kodu çalışmaz. Localhost adresleri dış sitelerde 404 hatası verir.
                         </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                        <div className="w-5 h-5 bg-indigo-600 text-white flex items-center justify-center rounded-full text-[8px]">2</div>
                        KOPYALANACAK KOD
                      </label>
                      <pre className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-[10px] text-indigo-300 break-all leading-relaxed h-32 overflow-y-auto">
                        {embedCode}
                      </pre>
                      <button 
                        onClick={copyEmbedCode}
                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-4 ${copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-indigo-600 hover:text-white shadow-2xl active:scale-95'}`}
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        <span>{copied ? 'KOPYALANDI!' : 'KODU KOPYALA'}</span>
                      </button>
                    </div>
                 </div>

                 <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <Eye size={16} />
                         CANLI ÖNİZLEME (IFRAME TEST)
                      </label>
                      <button onClick={refreshPreview} className="text-[9px] font-black text-indigo-400 flex items-center gap-2 hover:text-white transition-colors">
                        <RefreshCw size={12} /> YENİLE
                      </button>
                    </div>
                    <div className="aspect-video lg:aspect-square bg-black rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-inner">
                       <iframe 
                        key={previewKey + siteUrl} 
                        src={`${siteUrl}${siteUrl.includes('?') ? '&' : '?'}embed=true`} 
                        className="w-full h-full border-none"
                        title="Embed Preview"
                       />
                       <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black text-white pointer-events-none flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          GÖMÜLÜ MOD AKTİF
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center italic mt-2">Yukarıdaki ekranda derginizi görüyorsanız, gömme kodu hatasız çalışacaktır.</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {isAdding ? (
          <div className="flex flex-col gap-10">
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="xl:col-span-8 space-y-8">
                   <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-10">
                      <div className="space-y-10">
                        <label className="flex items-center gap-4 cursor-pointer w-full bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[1.5rem] transition-colors hover:bg-indigo-600/20">
                          <input type="checkbox" checked={formData.isCover} onChange={e => setFormData(p => ({ ...p, isCover: e.target.checked }))} className="w-7 h-7 rounded-lg border-white/10 text-indigo-600 focus:ring-indigo-500 bg-black/40" />
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">DERGİ KAPAĞI OLARAK BELİRLE</span>
                             <span className="text-[9px] text-slate-500 uppercase tracking-tighter">En ön sayfada bu haber görünecektir.</span>
                          </div>
                        </label>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Haber Başlığı</label>
                          <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full bg-black/40 px-8 py-6 rounded-2xl border border-white/5 focus:ring-2 focus:ring-indigo-500 outline-none text-2xl font-black text-white" placeholder="Yazmaya başlayın..." />
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Metin İçeriği</label>
                          <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                            <ReactQuill theme="snow" value={formData.content} onChange={content => setFormData(p => ({ ...p, content }))} placeholder="Detayları buraya girin..." />
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="xl:col-span-4 space-y-8">
                   <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 shadow-2xl sticky top-28">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 ml-1">Görsel / Video Yükle</label>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <label className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${formData.mediaType === 'image' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 bg-black/40 text-slate-600 hover:border-white/20'}`}>
                          <ImageIcon size={28} />
                          <span className="text-[10px] font-black mt-3 uppercase tracking-widest">FOTOĞRAF</span>
                          <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image')} className="hidden" />
                        </label>
                        <label className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${formData.mediaType === 'video' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-white/5 bg-black/40 text-slate-600 hover:border-white/20'}`}>
                          <Video size={28} />
                          <span className="text-[10px] font-black mt-3 uppercase tracking-widest">VİDEO</span>
                          <input type="file" accept="video/*" onChange={e => handleFileUpload(e, 'video')} className="hidden" />
                        </label>
                      </div>
                      <div className="aspect-[3/4] rounded-2xl bg-black border border-white/5 overflow-hidden relative shadow-inner">
                        {formData.mediaUrl ? (formData.mediaType === 'image' ? <img src={formData.mediaUrl} className="w-full h-full object-cover" /> : <video src={formData.mediaUrl} className="w-full h-full object-cover" controls />) : <div className="absolute inset-0 flex items-center justify-center text-slate-800 uppercase text-[10px] font-black">ÖNİZLEME</div>}
                      </div>
                   </div>
                </div>
             </div>
             <div className="sticky bottom-6 z-50 max-w-4xl mx-auto w-full px-6 flex gap-4">
                <button onClick={resetForm} className="px-10 py-5 bg-slate-900 text-slate-500 font-black uppercase tracking-widest text-[11px] rounded-2xl border border-white/5 hover:text-white transition-colors">VAZGEÇ</button>
                <button onClick={handleSave} className="flex-1 bg-white text-black px-12 py-5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95">KAYDET VE YAYINLA</button>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {news.map(article => (
              <div key={article.id} className={`group bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border transition-all duration-500 relative ${article.isCover ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-white/5'}`}>
                {article.isCover && <div className="absolute top-6 right-6 z-10 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl animate-bounce"><Star size={18} fill="white" /></div>}
                <div className="aspect-[4/3] relative overflow-hidden rounded-t-[2rem]">
                  {article.mediaType === 'image' ? <img src={article.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /> : <video src={article.mediaUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="p-8">
                  <h3 className="font-bold text-white mb-8 line-clamp-2 min-h-[3.5rem] text-lg serif italic leading-tight">{article.title}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(article)} className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 text-white rounded-xl hover:bg-indigo-600 transition-all font-black uppercase tracking-widest text-[10px]"><Edit2 size={14} />DÜZENLE</button>
                    <button onClick={() => { if(confirm('Silmek istediğinize emin misiniz?')) onSave(news.filter(n => n.id !== article.id)) }} className="flex items-center justify-center p-4 bg-red-950/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
