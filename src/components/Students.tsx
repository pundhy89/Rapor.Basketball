import React from "react";
import { useState } from 'react';
import { useStore } from '../store';
import { Student, ClassLevel } from '../types';
import { Search, Plus, X } from 'lucide-react';
import { cn } from './Layout';
import { IdCardModal } from './IdCardModal';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];

export function Students() {
  const students = useStore((state) => state.students);
  const addStudent = useStore((state) => state.addStudent);
  
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<ClassLevel | 'All'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = students.filter(s => {
    const matchName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === 'All' || s.classLevel === filterClass;
    return matchName && matchClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Data Siswa</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daftar siswa Dragons Basketball Academy</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama atau ID siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1C29] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', ...CLASSES].map(c => (
          <button
            key={c}
            onClick={() => setFilterClass(c as any)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border", filterClass === c ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-[#1A1C29] border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400")}
          >
            {c === 'All' ? 'Semua' : c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">Belum ada data siswa.</p>
        ) : (
          filtered.map(student => (
            <div 
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className="bg-white dark:bg-[#1A1C29] p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-blue-300 dark:border-blue-700 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-800">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md">{student.studentId}</span>
                    {student.jerseyNumber && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-medium">#{student.jerseyNumber}</span>
                    )}
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md font-medium">{student.classLevel}</span>
                  </div>
                </div>
              </div>
              <div className={cn("w-2 h-2 rounded-full", student.isActive ? "bg-green-500" : "bg-gray-300")} />
            </div>
          ))
        )}
      </div>

      {isAdding && (
        <AddStudentModal onClose={() => setIsAdding(false)} onAdd={addStudent} />
      )}

      {selectedStudent && (
        <IdCardModal
          person={{
            name: selectedStudent.name,
            id: selectedStudent.studentId,
            photoUrl: selectedStudent.photoUrl,
            role: 'Student Athlete',
            subRole: selectedStudent.classLevel,
            jerseyNumber: selectedStudent.jerseyNumber
          }}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void, onAdd: (s: Student) => void }) {
  const students = useStore(state => state.students);
  const nextNumber = students.length + 1;
  const currentYear = new Date().getFullYear();
  const defaultId = `DA-${currentYear}-${String(nextNumber).padStart(3, '0')}`;

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(defaultId);
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('SD Lower');
  const [photoUrl, setPhotoUrl] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId) return;
    onAdd({
      id: crypto.randomUUID(),
      name,
      studentId,
      jerseyNumber,
      classLevel,
      joinDate: new Date().toISOString(),
      isActive: true,
      photoUrl,
      parentName,
      parentPhone,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-[#1A1C29] w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Tambah Siswa Baru</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500 dark:text-gray-400" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500" placeholder="Contoh: Andi Pratama" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Atlet / ID</label>
              <input required type="text" value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-gray-50 dark:bg-[#151720] text-sm" placeholder="Contoh: DA-2026-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. Punggung</label>
              <input type="text" value={jerseyNumber} onChange={e => setJerseyNumber(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: 23" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
            <select value={classLevel} onChange={e => setClassLevel(e.target.value as ClassLevel)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500">
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Orang Tua</label>
              <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: Budi Susanto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. HP Orang Tua</label>
              <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm" placeholder="Contoh: 0812..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foto Profil</label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <img src={photoUrl} alt="Preview" className="h-12 w-12 object-cover rounded-full bg-gray-100 dark:bg-white/5" />
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
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition-colors">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
