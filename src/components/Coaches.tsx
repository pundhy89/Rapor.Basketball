import React from "react";
import { useState } from 'react';
import { useStore } from '../store';
import { Coach, ClassLevel } from '../types';
import { Plus, X, Search } from 'lucide-react';
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
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Data Coach</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="flex gap-2 bg-white dark:bg-[#1A1C29] p-2 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-1" />
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
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">Belum ada data coach.</p>
        ) : (
          filtered.map(coach => (
            <div 
              key={coach.id} 
              onClick={() => setSelectedCoach(coach)}
              className="bg-white dark:bg-[#1A1C29] p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 cursor-pointer hover:border-blue-300 dark:border-blue-700 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-800">
                {coach.photoUrl ? (
                  <img src={coach.photoUrl} alt={coach.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg">
                    {coach.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{coach.name}</h3>
                  <div className={cn("w-2 h-2 rounded-full mt-1.5", coach.isActive ? "bg-green-500" : "bg-gray-300")} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{coach.coachId} • {coach.phone}</p>
                {coach.certification && (
                  <p className="text-[10px] text-purple-600 bg-purple-50 inline-block px-2 py-0.5 rounded-md mt-1 font-medium">
                    {coach.certification}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {coach.activeClasses.map(c => (
                    <span key={c} className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 px-1.5 py-0.5 rounded-md font-medium">
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
            subRole: selectedCoach.certification || 'Certified Coach'
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
      <div className="bg-white dark:bg-[#1A1C29] w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Tambah Coach Baru</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500 dark:text-gray-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm" placeholder="Nama Coach" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Coach</label>
            <input required type="text" value={coachId} onChange={e => setCoachId(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm bg-gray-50 dark:bg-[#151720]" placeholder="Contoh: C-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor HP</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm" placeholder="08..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sertifikasi</label>
            <input type="text" value={certification} onChange={e => setCertification(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: Lisensi C" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Profil</label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="h-12 w-12 object-cover rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800" />
              ) : (
                <div className="h-12 w-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800">Foto</div>
              )}
              <div className="flex-1 space-y-2">
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setPhotoUrl(event.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} className="text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:bg-blue-900/20 file:text-blue-700 dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40 w-full" />
                <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 outline-none focus:border-blue-500 text-xs" placeholder="Atau paste URL gambar..." />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kelas yang Dilatih</label>
            <div className="flex flex-wrap gap-2">
              {CLASSES.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleClass(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                    activeClasses.includes(c) ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-[#1A1C29] border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition-colors">
              Simpan Data Coach
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
