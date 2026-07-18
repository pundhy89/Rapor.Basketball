import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { ClassLevel, PeriodEvaluation } from '../types';
import { cn } from './Layout';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];

export function Evaluation() {
  const { students, settings, addEvaluation } = useStore();
  
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('SD Lower');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [notes, setNotes] = useState({
    strengths: '',
    improvements: '',
    nextTarget: '',
    recommendation: ''
  });

  const classStudents = useMemo(() => students.filter(s => s.classLevel === selectedClass), [students, selectedClass]);

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

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Evaluasi Periode</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Periode: {settings.periods.find(p => p.id === settings.activePeriodId)?.semester} {settings.periods.find(p => p.id === settings.activePeriodId)?.year}</p>
      </div>

      <div className="space-y-4">
        {/* Class Selector */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => { setSelectedClass(c); setSelectedStudentId(''); }}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border", selectedClass === c ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-[#1A1C29] border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Student Selector */}
        <div>
          {classStudents.length === 0 ? (
             <div className="p-4 bg-gray-50 dark:bg-[#151720] rounded-xl text-sm text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">Belum ada siswa di kelas ini.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {classStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left flex flex-col",
                    selectedStudentId === student.id ? "border-purple-500 bg-purple-50" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1C29]"
                  )}
                >
                  <span className={cn("font-medium text-sm truncate w-full", selectedStudentId === student.id ? "text-purple-800 dark:text-purple-400" : "text-gray-800 dark:text-gray-200")}>{student.name}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{student.studentId}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedStudentId && (
          <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold border-b pb-2">Catatan Evaluasi</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelebihan Atlet</label>
              <textarea 
                value={notes.strengths}
                onChange={e => setNotes({...notes, strengths: e.target.value})}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500 text-sm h-24 resize-none"
                placeholder="Deskripsikan kelebihan atlet..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area yang Perlu Ditingkatkan</label>
              <textarea 
                value={notes.improvements}
                onChange={e => setNotes({...notes, improvements: e.target.value})}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500 text-sm h-24 resize-none"
                placeholder="Fokus perbaikan ke depannya..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan Pelatih (Untuk Rapor)</label>
              <textarea 
                value={notes.recommendation}
                onChange={e => setNotes({...notes, recommendation: e.target.value})}
                className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500 text-sm h-24 resize-none"
                placeholder="Masukkan catatan pelatih yang akan tampil di rapor..."
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl active:bg-purple-700 transition-colors"
            >
              Simpan Evaluasi
            </button>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Evaluasi berhasil disimpan</span>
        </div>
      )}
    </div>
  );
}
