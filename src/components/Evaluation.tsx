import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { ClassLevel, PeriodEvaluation } from '../types';
import { cn } from './Layout';
import { ArrowLeft, CheckCircle, Search, X } from 'lucide-react';
import { format } from 'date-fns';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];

export function Evaluation() {
  const { students, settings, addEvaluation } = useStore();
  
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'Semua'>('Semua');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [notes, setNotes] = useState({
    strengths: '',
    improvements: '',
    nextTarget: '',
    recommendation: ''
  });

  const classStudents = useMemo(() => {
    let filtered = selectedClass === 'Semua' ? students : students.filter(s => s.classLevel === selectedClass);
    if (searchQuery) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [students, selectedClass, searchQuery]);

  const handleSave = () => {
    if (!selectedStudentId) return;

    const evaluation: PeriodEvaluation = {
      id: crypto.randomUUID(),
      period: settings.periods.find(p => p.id === settings.activePeriodId)?.id || settings.period,
      studentId: selectedStudentId,
      notes,
    };
    
    addEvaluation(evaluation);
    
    setNotes({ strengths: '', improvements: '', nextTarget: '', recommendation: '' });
    setSelectedStudentId('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 pb-6 relative">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-orange-400 drop-shadow-[0_0_10px_#fb923c] [text-shadow:0_0_10px_#fb923c]">Evaluasi Periode</h2>
        </div>
        <p className="text-sm text-white/70">Periode: {settings.periods.find(p => p.id === settings.activePeriodId)?.semester} {settings.periods.find(p => p.id === settings.activePeriodId)?.year}</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-xl text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md"
          />
        </div>

        {/* Class Selector */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Semua', ...CLASSES].map(c => (
              <button
                key={c}
                onClick={() => { setSelectedClass(c as any); setSelectedStudentId(''); }}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border", selectedClass === c ? "bg-white/30 dark:bg-white/5 border-blue-200 dark:border-blue-800 text-white dark:text-blue-400" : "bg-transparent dark:bg-transparent backdrop-blur-md border-white/20 dark:border-white/20 text-white/70")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Student Selector */}
        <div>
          {classStudents.length === 0 ? (
             <div className="p-4 bg-transparent rounded-xl text-sm text-center text-white/70 border border-dashed border-white/20 dark:border-white/20 ">Belum ada siswa di kelas ini.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {classStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left flex flex-col",
                    selectedStudentId === student.id ? "border-purple-500 bg-white/30 dark:bg-white/5" : "border-white/20 dark:border-white/20 bg-transparent dark:bg-transparent backdrop-blur-md"
                  )}
                >
                  <span className={cn("font-medium text-sm truncate w-full", selectedStudentId === student.id ? "text-purple-800 dark:text-purple-400" : "text-cyan-50")}>{student.name}</span>
                  <span className="text-[10px] text-white/70">{student.studentId}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedStudentId && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-transparent dark:bg-transparent backdrop-blur-md w-full max-h-[85vh] overflow-y-auto rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-full pb-32">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">{selectedStudent.name}</h2>
                <p className="text-sm text-white/70">{selectedStudent.studentId} • {selectedStudent.classLevel}</p>
              </div>
              <button 
                onClick={() => setSelectedStudentId('')}
                className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-colors text-white relative z-50"
              >
                <X className="w-5 h-5 text-white drop-shadow-md" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold border-b pb-2">Catatan Evaluasi</h3>
              
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Kelebihan Atlet</label>
                <textarea 
                  value={notes.strengths}
                  onChange={e => setNotes({...notes, strengths: e.target.value})}
                  className="w-full bg-transparent border border-white/20 dark:border-white/20  rounded-lg p-3 outline-none focus:border-purple-500 text-sm h-24 resize-none"
                  placeholder="Deskripsikan kelebihan atlet..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Area yang Perlu Ditingkatkan</label>
                <textarea 
                  value={notes.improvements}
                  onChange={e => setNotes({...notes, improvements: e.target.value})}
                  className="w-full bg-transparent border border-white/20 dark:border-white/20  rounded-lg p-3 outline-none focus:border-purple-500 text-sm h-24 resize-none"
                  placeholder="Fokus perbaikan ke depannya..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Catatan Pelatih (Untuk Rapor)</label>
                <textarea 
                  value={notes.recommendation}
                  onChange={e => setNotes({...notes, recommendation: e.target.value})}
                  className="w-full bg-transparent border border-white/20 dark:border-white/20  rounded-lg p-3 outline-none focus:border-purple-500 text-sm h-24 resize-none"
                  placeholder="Masukkan catatan pelatih yang akan tampil di rapor..."
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl mt-4 active:bg-purple-700 transition-colors"
              >
                Simpan Evaluasi
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/50 dark:bg-black/50 backdrop-blur-md text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-top-4 z-[110]">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Evaluasi berhasil disimpan</span>
        </div>
      )}
    </div>
  );
}
