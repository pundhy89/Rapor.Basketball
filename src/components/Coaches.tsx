import { Link } from 'react-router-dom';
import React from "react";
import { useState } from 'react';
import { useStore } from '../store';
import { Coach, ClassLevel } from '../types';
import { ArrowLeft, Plus, X, Search } from 'lucide-react';
import { cn } from './Layout';
import { IdCardModal } from './IdCardModal';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];

export function Coaches() {
  const coaches = useStore((state) => state.coaches);
  const addCoach = useStore((state) => state.addCoach);
  
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  const filtered = coaches.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] [text-shadow:0_0_10px_#22d3ee]">Data Coach</h2>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="flex gap-2 bg-transparent dark:bg-transparent backdrop-blur-md p-2 rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
        <Search className="w-5 h-5 text-white/70 ml-1" />
        <input
          type="text"
          placeholder="Cari nama coach..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-white/70 text-sm py-10">Belum ada data coach.</p>
        ) : (
          filtered.map(coach => (
            <div 
              key={coach.id} 
              onClick={() => setSelectedCoach(coach)}
              className="bg-transparent dark:bg-transparent backdrop-blur-md p-4 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] border border-gray-100 flex items-start gap-4 cursor-pointer hover:border-blue-300 dark:border-blue-700 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full flex-shrink-0 overflow-hidden border border-white/20 dark:border-white/20">
                {coach.photoUrl ? (
                  <img src={coach.photoUrl} alt={coach.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/70 font-bold text-lg">
                    {coach.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white tracking-wide leading-tight">{coach.name}</h3>
                  <div className={cn("w-2 h-2 rounded-full mt-1.5", coach.isActive ? "bg-green-500" : "bg-gray-300")} />
                </div>
                <p className="text-xs text-white/70 mt-0.5">{coach.coachId} • {coach.phone}</p>
                {coach.certification && (
                  <p className="text-[10px] text-purple-600 bg-purple-50 inline-block px-2 py-0.5 rounded-md mt-1 font-medium">
                    {coach.certification}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {coach.activeClasses.map(c => (
                    <span key={c} className="text-[10px] bg-white/30 dark:bg-white/5 text-white dark:text-blue-400 border border-blue-100 px-1.5 py-0.5 rounded-md font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAdding && (
        <AddCoachModal onClose={() => setIsAdding(false)} onAdd={addCoach} />
      )}
      
      {selectedCoach && (
        <IdCardModal
          person={{
            name: selectedCoach.name,
            id: selectedCoach.coachId,
            photoUrl: selectedCoach.photoUrl,
            role: 'Academy Coach',
            subRole: selectedCoach.certification || 'Certified Coach',
            phone: selectedCoach.phone
          }}
          onClose={() => setSelectedCoach(null)}
        />
      )}
    </div>
  );
}

function AddCoachModal({ onClose, onAdd }: { onClose: () => void, onAdd: (c: Coach) => void }) {
  const coaches = useStore(state => state.coaches);
  const nextNumber = coaches.length + 1;
  const defaultId = `C-${String(nextNumber).padStart(3, '0')}`;

  const [name, setName] = useState('');
  const [coachId, setCoachId] = useState(defaultId);
  const [phone, setPhone] = useState('');
  const [certification, setCertification] = useState('');
  const [activeClasses, setActiveClasses] = useState<ClassLevel[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');

  const toggleClass = (c: ClassLevel) => {
    setActiveClasses(prev => 
      prev.includes(c) ? prev.filter(cls => cls !== c) : [...prev, c]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !coachId) return;
    onAdd({
      id: crypto.randomUUID(),
      name,
      coachId,
      phone,
      certification,
      activeClasses,
      photoUrl,
      isActive: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-transparent dark:bg-transparent backdrop-blur-md w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Tambah Coach Baru</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-white/70" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Nama Lengkap</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm" placeholder="Nama Coach" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">ID Coach</label>
            <input required type="text" value={coachId} onChange={e => setCoachId(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm bg-transparent" placeholder="Contoh: C-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Nomor HP</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm" placeholder="08..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Sertifikasi</label>
            <input type="text" value={certification} onChange={e => setCertification(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm" placeholder="Contoh: Lisensi C" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Foto Profil</label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="h-12 w-12 object-cover rounded-full bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/20" />
              ) : (
                <div className="h-12 w-12 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-xs text-white/70 border border-white/20 dark:border-white/20">Foto</div>
              )}
              <div className="flex-1 space-y-2">
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setPhotoUrl(event.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="text-xs text-white/70 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/30 dark:bg-white/5 file:text-white dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40 w-full" />
                <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-xs" placeholder="Atau paste URL gambar..." />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Kelas yang Dilatih</label>
            <div className="flex flex-wrap gap-2">
              {CLASSES.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleClass(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                    activeClasses.includes(c) ? "bg-white/30 dark:bg-white/5 border-blue-200 dark:border-blue-800 text-white dark:text-blue-400" : "bg-transparent dark:bg-transparent backdrop-blur-md border-white/20 dark:border-white/20  text-white/70"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white font-bold py-3 rounded-xl active:bg-blue-700 transition-colors">
              Simpan Data Coach
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
