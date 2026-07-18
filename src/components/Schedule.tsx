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
      <div className="flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-[#151720] z-10 py-2">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-white dark:bg-[#1A1C29] border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-100 dark:bg-white/5 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Jadwal Latihan</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Informasi jadwal rutin akademi</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1A1C29] rounded-xl border border-gray-100 shadow-sm">
          <CalendarDays className="w-12 h-12 text-gray-700 dark:text-gray-300 mx-auto mb-3" />
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
            }[schedule.color as 'blue'|'emerald'|'amber'|'fuchsia'|'rose'] || 'bg-gray-50 dark:bg-[#151720] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white';

            return (
              <div key={schedule.id} className={cn("rounded-2xl border p-5 shadow-sm", colors)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1C29] flex items-center justify-center shadow-sm">
                      <CalendarDays className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h3 className="font-bold text-lg">{schedule.class}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(schedule)}
                      className="p-1.5 bg-white dark:bg-[#1A1C29]/50 rounded-lg hover:bg-white text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="p-1.5 bg-white dark:bg-[#1A1C29]/50 rounded-lg hover:bg-white text-blue-600 dark:text-blue-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 bg-white dark:bg-[#1A1C29]/60 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Hari</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{schedule.days}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Waktu</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{schedule.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Lokasi</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{schedule.location}</p>
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
      <div className="bg-white dark:bg-[#1A1C29] w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">{initialData ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500 dark:text-gray-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas / Kategori</label>
            <input required type="text" value={className} onChange={e => setClassName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500" placeholder="Contoh: SD Lower" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hari Latihan</label>
            <input required type="text" value={days} onChange={e => setDays(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500" placeholder="Contoh: Selasa & Kamis" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Waktu</label>
            <input required type="text" value={time} onChange={e => setTime(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500" placeholder="Contoh: 15:30 - 17:00 WIB" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi</label>
            <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500" placeholder="Contoh: Gor Basket Utama" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warna Kartu</label>
            <select value={color} onChange={e => setColor(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500">
              <option value="blue">Biru</option>
              <option value="emerald">Hijau</option>
              <option value="amber">Kuning</option>
              <option value="fuchsia">Ungu</option>
              <option value="rose">Merah Muda</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition-colors">
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
