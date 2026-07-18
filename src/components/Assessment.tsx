import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { ClassLevel, DailyAssessment, AttendanceStatus, Attendance as AttendanceType } from '../types';
import { Star, CheckCircle, Search } from 'lucide-react';
import { cn } from './Layout';
import { format } from 'date-fns';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];
const STATUSES: { value: AttendanceStatus, color: string, bg: string }[] = [
  { value: 'Hadir', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800' },
  { value: 'Izin', color: 'text-yellow-700 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800' },
  { value: 'Sakit', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800' },
  { value: 'Alpha', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800' }
];

export function Assessment() {
  const students = useStore((state) => state.students);
  const addAssessment = useStore((state) => state.addAssessment);
  const addAttendance = useStore((state) => state.addAttendance);
  
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'Semua'>('Semua');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
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
    const today = new Date().toISOString();
    
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const assessment: DailyAssessment = {
      id: crypto.randomUUID(),
      date: today,
      coachId: 'coach-1', // Mock coach
      studentId: selectedStudentId,
      classLevel: student.classLevel,
      scores,
    };
    addAssessment(assessment);

    const attRecord: AttendanceType = {
      id: crypto.randomUUID(),
      date: today,
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

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Penilaian & Absensi</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(), 'dd MMMM yyyy')}</p>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1A1C29] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Class Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Kelas</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Semua', ...CLASSES].map(c => (
              <button
                key={c}
                onClick={() => { setSelectedClass(c as any); setSelectedStudentId(''); }}
                className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border", selectedClass === c ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-[#1A1C29] border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Student Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih Siswa</label>
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
                    selectedStudentId === student.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1C29]"
                  )}
                >
                  <span className={cn("font-medium text-sm truncate w-full", selectedStudentId === student.id ? "text-blue-800 dark:text-blue-400" : "text-gray-800 dark:text-gray-200")}>{student.name}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{student.studentId}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedStudentId && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            
            <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <h3 className="font-bold border-b pb-2">Status Kehadiran</h3>
              <div className="grid grid-cols-4 gap-2">
                {STATUSES.map(stat => (
                  <button
                    key={stat.value}
                    onClick={() => setAttendance(stat.value)}
                    className={cn(
                      "py-3 px-1 text-xs font-semibold rounded-lg border transition-colors text-center",
                      attendance === stat.value ? stat.bg + ' ' + stat.color : "bg-gray-50 dark:bg-[#151720] border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {stat.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
              <h3 className="font-bold border-b pb-2">Nilai 5 Pilar (1-5)</h3>
              
              {(Object.keys(scores) as Array<keyof typeof scores>).map(pillar => (
                <div key={pillar}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold capitalize text-gray-800 dark:text-gray-200">{pillar} Development</label>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 dark:text-blue-500">{scores[pillar] > 0 ? scores[pillar] : '-'} / 5</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        key={val}
                        onClick={() => setScores(s => ({ ...s, [pillar]: val }))}
                        className="flex-1 p-2 flex justify-center hover:bg-gray-50 dark:bg-[#151720] rounded-lg transition-colors"
                      >
                        <Star className={cn("w-8 h-8 transition-colors", val <= scores[pillar] ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 dark:fill-gray-800 text-gray-200 dark:text-gray-700")} />
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between px-1 mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <span>Perlu Bimbingan</span>
                    <span>Sangat Baik</span>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSave}
                disabled={Object.values(scores).includes(0)}
                className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl mt-4 active:bg-blue-700 transition-colors"
              >
                Simpan Penilaian & Absen
              </button>
            </div>
          </div>
        )}

      </div>
      
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Data berhasil disimpan</span>
        </div>
      )}
    </div>
  );
}
