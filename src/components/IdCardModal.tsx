import React, { useRef, useState } from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { cn } from './Layout';

interface IdCardProps {
  person: {
    name: string;
    id: string;
    photoUrl?: string;
    role: string;
    subRole?: string;
    jerseyNumber?: string;
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
      // We render the component with a high scale to ensure it looks good when printed
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
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm flex justify-end mb-2">
        <button onClick={onClose} className="p-2 bg-white dark:bg-[#1A1C29]/10 rounded-full hover:bg-white/20 transition-colors text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Container for the ID card (Ratio 54 : 85.6) */}
      <div className="bg-white dark:bg-[#1A1C29] rounded-xl shadow-2xl overflow-hidden relative" style={{ width: '270px', height: '428px' }}>
        <div ref={cardRef} className="w-full h-full bg-white dark:bg-[#1A1C29] relative flex flex-col items-center">
          {/* Header background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600 to-blue-700" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }} />
          
          {/* Academy Name */}
          <div className="relative mt-4 mb-2 text-center text-white z-10 w-full px-4 flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 mb-1 text-white/90" />
            <h2 className="font-black text-sm tracking-widest uppercase shadow-sm">Basketball<br/>Academy</h2>
          </div>

          {/* Photo */}
          <div className="relative mt-2 z-10">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 dark:bg-white/5 overflow-hidden shadow-md flex items-center justify-center relative">
              {person.photoUrl ? (
                <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-3xl font-bold text-gray-700 dark:text-gray-300">{person.name.charAt(0)}</span>
              )}
            </div>
            {person.jerseyNumber && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-lg border-2 border-white shadow-sm">
                {person.jerseyNumber}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mt-5 flex-1 w-full px-6 flex flex-col items-center text-center">
            <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight mb-1">{person.name}</h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              {person.role}
            </div>
            
            {person.subRole && (
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">{person.subRole}</p>
            )}

            <div className="mt-auto mb-6">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">ID Number</p>
              <p className="font-mono font-bold text-gray-800 text-sm tracking-wider">{person.id}</p>
            </div>
          </div>
          
          {/* Footer border */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="bg-white dark:bg-[#1A1C29] text-gray-900 dark:text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-gray-50 dark:bg-[#151720] active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Menyimpan...' : 'Download ID Card'}
        </button>
      </div>
    </div>
  );
}
