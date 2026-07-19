import React from "react";
import { ArrowLeft, CalendarDays, MapPin, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './Layout';
import { useStore } from '../store';
import { useState } from 'react';
import { ScheduleItem } from '../types';

export function Schedule() {
  const schedules = useStore((state) => state.schedules);
  const addSchedule = useStore((state) => state.addSchedule);
  const updateSchedule = useStore((state) => state.updateSchedule);
  const deleteSchedule = useStore((state) => state.deleteSchedule);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  const openAddModal = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: ScheduleItem) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between sticky top-0 bg-transparent z-10 py-2">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-full hover:bg-white/50 dark:bg-white/5 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <ArrowLeft className="w-5 h-5 text-white/90" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide leading-tight">Jadwal Latihan</h2>
            <p className="text-xs text-white/70 font-medium">Informasi jadwal rutin akademi</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="p-2 bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white rounded-full hover:bg-blue-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-10 text-white/70 bg-transparent dark:bg-transparent backdrop-blur-md rounded-xl border border-gray-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
          <CalendarDays className="w-12 h-12 text-white/90 mx-auto mb-3" />
          <p>Belum ada jadwal latihan. Klik tombol + untuk menambahkan jadwal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {schedules.map((schedule) => {
            const colors = {
              blue: 'bg-blue-50 border-blue-200 text-blue-900',
              emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
              amber: 'bg-amber-50 border-amber-200 text-amber-900',
              fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900',
              rose: 'bg-rose-50 border-rose-200 text-rose-900',
            }[schedule.color as 'blue'|'emerald'|'amber'|'fuchsia'|'rose'] || 'bg-transparent border-white/20 dark:border-white/20 text-white tracking-wide';

            return (
              <div key={schedule.id} className={cn("rounded-2xl border p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]", colors)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-transparent dark:bg-transparent backdrop-blur-md flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
                      <CalendarDays className="w-5 h-5 text-white/90" />
                    </div>
                    <h3 className="font-bold text-lg">{schedule.class}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(schedule)}
                      className="p-1.5 bg-transparent dark:bg-transparent backdrop-blur-md/50 rounded-lg hover:bg-white/50 dark:bg-white/5 text-white/90 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="p-1.5 bg-transparent dark:bg-transparent backdrop-blur-md/50 rounded-lg hover:bg-white/50 dark:bg-white/5 text-white dark:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 bg-transparent dark:bg-transparent backdrop-blur-md/60 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 mt-0.5 text-white/70" />
                    <div>
                      <p className="text-xs text-white/70 font-medium mb-0.5">Hari</p>
                      <p className="text-sm font-bold text-white tracking-wide">{schedule.days}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-0.5 text-white/70" />
                    <div>
                      <p className="text-xs text-white/70 font-medium mb-0.5">Waktu</p>
                      <p className="text-sm font-bold text-white tracking-wide">{schedule.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-white/70" />
                    <div>
                      <p className="text-xs text-white/70 font-medium mb-0.5">Lokasi</p>
                      <p className="text-sm font-bold text-white tracking-wide">{schedule.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <ScheduleModal 
          initialData={editingSchedule}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingSchedule) {
              updateSchedule({ ...editingSchedule, ...data });
            } else {
              addSchedule({ id: crypto.randomUUID(), ...data });
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ScheduleModal({ 
  initialData, 
  onClose, 
  onSave 
}: { 
  initialData: ScheduleItem | null, 
  onClose: () => void,
  onSave: (data: Omit<ScheduleItem, 'id'>) => void
}) {
  const [className, setClassName] = useState(initialData?.class || '');
  const [days, setDays] = useState(initialData?.days || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [color, setColor] = useState(initialData?.color || 'blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ class: className, days, time, location, color });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-transparent dark:bg-transparent backdrop-blur-md w-full max-w-md rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">{initialData ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-white/70" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Kelas / Kategori</label>
            <input required type="text" value={className} onChange={e => setClassName(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md" placeholder="Contoh: SD Lower" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Hari Latihan</label>
            <input required type="text" value={days} onChange={e => setDays(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md" placeholder="Contoh: Selasa & Kamis" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Waktu</label>
            <input required type="text" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md" placeholder="Contoh: 15:30 - 17:00 WIB" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Lokasi</label>
            <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md" placeholder="Contoh: Gor Basket Utama" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Warna Kartu</label>
            <select value={color} onChange={e => setColor(e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md">
              <option value="blue">Biru</option>
              <option value="emerald">Hijau</option>
              <option value="amber">Kuning</option>
              <option value="fuchsia">Ungu</option>
              <option value="rose">Merah Muda</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="w-full bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white font-bold py-3 rounded-xl active:bg-blue-700 transition-colors">
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
