import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store';
import { ClassLevel, DailyAssessment, AttendanceStatus, Attendance as AttendanceType } from '../types';
import { ArrowLeft, Star, CheckCircle, Search, X } from 'lucide-react';
import { cn } from './Layout';
import { format } from 'date-fns';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];
const STATUSES: { value: AttendanceStatus, color: string, bg: string }[] = [
  { value: 'Hadir', color: 'text-white dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800' },
  { value: 'Izin', color: 'text-white dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800' },
  { value: 'Sakit', color: 'text-white dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800' },
  { value: 'Alpha', color: 'text-white dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800' }
];

export function Assessment() {
  const students = useStore((state) => state.students);
  const coaches = useStore((state) => state.coaches);
  const addAssessment = useStore((state) => state.addAssessment);
  const addAttendance = useStore((state) => state.addAttendance);
  
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'Semua'>('Semua');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [coachId, setCoachId] = useState(coaches[0]?.id || '');

  useEffect(() => {
    if (!coachId && coaches.length > 0) {
      setCoachId(coaches[0].id);
    }
  }, [coaches, coachId]);

  const [scores, setScores] = useState({
    technical: 0,
    tactical: 0,
    physical: 0,
    mental: 0,
    character: 0,
  });
  const [attendance, setAttendance] = useState<AttendanceStatus>('Hadir');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const classStudents = useMemo(() => {
    let filtered = selectedClass === 'Semua' ? students : students.filter(s => s.classLevel === selectedClass);
    if (searchQuery) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [students, selectedClass, searchQuery]);

  const handleSave = () => {
    if (!selectedStudentId) return;
    
    // Use the selected date or today's date if empty
    const assessmentDate = date ? new Date(date).toISOString() : new Date().toISOString();
    
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const assessment: DailyAssessment = {
      id: crypto.randomUUID(),
      date: assessmentDate,
      coachId: coachId || 'coach-1',
      studentId: selectedStudentId,
      classLevel: student.classLevel,
      scores,
    };
    addAssessment(assessment);

    const attRecord: AttendanceType = {
      id: crypto.randomUUID(),
      date: assessmentDate,
      classLevel: student.classLevel,
      studentId: selectedStudentId,
      status: attendance,
    };
    addAttendance(attRecord);
    
    // Reset
    setScores({ technical: 0, tactical: 0, physical: 0, mental: 0, character: 0 });
    setAttendance('Hadir');
    setSelectedStudentId('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-6 pb-6 relative">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-fuchsia-400 drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]">Penilaian & Absensi</h2>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-xl text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-white tracking-wide"
          />
          <select
            value={coachId}
            onChange={(e) => setCoachId(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-xl text-sm focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-white tracking-wide"
          >
            {coaches.length === 0 && <option value="">Pilih Pelatih</option>}
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative mb-4">
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
          <label className="block text-sm font-medium text-white/90 mb-2">Pilih Kelas</label>
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
          <label className="block text-sm font-medium text-white/90 mb-2">Pilih Siswa</label>
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
                    selectedStudentId === student.id ? "border-blue-500 bg-white/30 dark:bg-white/5" : "border-white/20 dark:border-white/20 bg-transparent dark:bg-transparent backdrop-blur-md"
                  )}
                >
                  <span className={cn("font-medium text-sm truncate w-full", selectedStudentId === student.id ? "text-blue-800 dark:text-blue-400" : "text-cyan-50")}>{student.name}</span>
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

            <div className="space-y-6">
              <div className="bg-transparent p-5 rounded-2xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
                <h3 className="font-bold border-b pb-2">Status Kehadiran</h3>
                <div className="grid grid-cols-4 gap-2">
                  {STATUSES.map(stat => (
                    <button
                      key={stat.value}
                      onClick={() => setAttendance(stat.value)}
                      className={cn(
                        "py-3 px-1 text-xs font-semibold rounded-lg border transition-colors text-center",
                        attendance === stat.value ? stat.bg + ' ' + stat.color : "bg-transparent dark:bg-transparent backdrop-blur-md border-white/20 dark:border-white/20 text-white/70"
                      )}
                    >
                      {stat.value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-transparent p-5 rounded-2xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-5">
                <h3 className="font-bold border-b pb-2">Nilai 5 Pilar (1-5)</h3>
                
                {(Object.keys(scores) as Array<keyof typeof scores>).map(pillar => (
                  <div key={pillar}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold capitalize text-cyan-50">{pillar} Development</label>
                      <span className="text-xs font-bold text-white dark:text-white">{scores[pillar] > 0 ? scores[pillar] : '-'} / 5</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          onClick={() => setScores(s => ({ ...s, [pillar]: val }))}
                          className="flex-1 p-2 flex justify-center hover:bg-gray-200 dark:hover:bg-slate-300/50 dark:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Star className={cn("w-8 h-8 transition-colors", val <= scores[pillar] ? "fill-yellow-400 text-yellow-400" : "fill-white dark:fill-[#1A1C29] text-gray-300 dark:text-white")} />
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between px-1 mt-1 text-[10px] text-white/70">
                      <span>Perlu Bimbingan</span>
                      <span>Sangat Baik</span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  disabled={Object.values(scores).includes(0)}
                  className="w-full bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] disabled:bg-gray-300 dark:disabled:bg-transparent/60 text-white font-bold py-4 rounded-xl mt-4 active:bg-blue-700 transition-colors"
                >
                  Simpan Penilaian & Absen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/50 dark:bg-black/50 backdrop-blur-md text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-top-4 z-[110]">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Data berhasil disimpan</span>
        </div>
      )}
    </div>
  );
}
