import React, { useRef, useState } from 'react';
import { X, Download, Phone, MapPin, Mail, CreditCard } from 'lucide-react';
import { toJpeg } from 'html-to-image';

interface IdCardProps {
  person: {
    name: string;
    id: string;
    photoUrl?: string;
    role: string;
    subRole?: string;
    jerseyNumber?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  onClose: () => void;
}

export function IdCardModal({ person, onClose }: IdCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toJpeg(cardRef.current, { 
        quality: 1, 
        pixelRatio: 3,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement('a');
      link.download = `ID_CARD_${person.name.replace(/\s+/g, '_')}.jpeg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image', err);
      alert('Gagal mengunduh kartu. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-sm flex justify-end mb-4">
        <button onClick={onClose} className="p-2 bg-black/60 border border-white/20 hover:bg-black/80 rounded-full transition-colors text-white shadow-lg">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div 
        ref={cardRef} 
        className="w-[280px] h-[458px] relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-sm border border-white/20 shadow-xl flex flex-col items-center pt-8 pb-6"
      >
        {/* Cyberpunk Background Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-[#0B0C10]/80 to-slate-900/80 pointer-events-none" />
        
        {/* Outer glowing edge inner container */}
        <div className="absolute inset-1.5 rounded-2xl border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none" />
        
        {/* Side sci-fi accents */}
        <div className="absolute left-0 top-[30%] w-1.5 h-16 bg-white shadow-[0_0_10px_#ffffff] rounded-r-md" />
        <div className="absolute right-0 top-[30%] w-1.5 h-16 bg-white shadow-[0_0_10px_#ffffff] rounded-l-md" />

        {/* Top Photo section */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Glowing ring */}
          <div className="relative w-[136px] h-[136px] rounded-full p-[3px] bg-gradient-to-br from-blue-300 via-purple-300 to-orange-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <div className="w-full h-full rounded-full border-[3px] border-purple-900 overflow-hidden bg-slate-800 flex items-center justify-center">
              {person.photoUrl ? (
                <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-4xl font-black text-white/70">{person.name.charAt(0)}</span>
              )}
            </div>
            
            {/* Horizontal flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[2px] bg-white blur-[2px] opacity-70 pointer-events-none" />
          </div>
        </div>

        {/* Name Plate */}
        <div className="relative z-10 w-[85%] mt-6">
          <div className="bg-transparent dark:bg-transparent backdrop-blur-md rounded-2xl border-y-[2px] border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] py-3 px-4 text-center relative overflow-hidden">
            {/* Glass shine effect */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-slate-200/50 dark:bg-slate-800/50" />
            
            <h2 className="text-white font-black text-2xl tracking-wide relative z-10">{person.name}</h2>
            <p className="text-white/90 text-sm font-semibold mt-0.5 tracking-wider relative z-10">{person.role}</p>
          </div>
        </div>

        {/* Details List */}
        <div className="relative z-10 w-[85%] mt-6 flex flex-col gap-3.5 text-white/90 text-xs font-semibold tracking-wide">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-white drop-shadow-sm" />
              <span>ID: {person.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white drop-shadow-sm" />
              <span>{person.phone || '+62 000 0000'}</span>
            </div>
          </div>
          
          <div className="h-[1.5px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-80" />
          
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-white drop-shadow-sm" />
            <span className="truncate">{person.email || `${person.name.toLowerCase().replace(/\s+/g, '.')}@email.com`}</span>
          </div>

          <div className="h-[1.5px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-80" />

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white drop-shadow-sm" />
            <span className="truncate">{person.address || 'Basketball Academy, ID'}</span>
          </div>
          
          <div className="h-[1.5px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-80" />
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-slate-800 dark:bg-slate-200 text-white text-white px-8 py-3 rounded-full font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] flex items-center gap-2 hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'PROCESSING...' : 'DOWNLOAD ID CARD'}
        </button>
      </div>
    </div>
  );
}
