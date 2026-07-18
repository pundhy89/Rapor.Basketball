import { useState, useMemo, useRef } from 'react';
import { useStore } from '../store';
import { ClassLevel, Student } from '../types';
import { cn } from './Layout';
import { Trophy, ChevronLeft, Download, Share2, Search } from 'lucide-react';
import { calculateStudentScore } from '../utils/calculations';
import { toJpeg } from 'html-to-image';

const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];

export function Report() {
  const { students, assessments, attendances, settings, evaluations } = useStore();
  
  const [selectedClass, setSelectedClass] = useState<ClassLevel | 'Semua'>('Semua');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const rankedStudents = useMemo(() => {
    return students
      .filter(s => selectedClass === 'Semua' || s.classLevel === selectedClass)
      .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(student => {
        const stats = calculateStudentScore(student.id, assessments, attendances, settings);
        return { ...student, stats };
      })
      .sort((a, b) => b.stats.finalScore - a.stats.finalScore);
  }, [students, selectedClass, assessments, attendances, settings]);

  // Calculate report
  const reportData = useMemo(() => {
    if (!selectedStudent) return null;
    return calculateStudentScore(selectedStudent.id, assessments, attendances, settings);
  }, [selectedStudent, assessments, attendances, settings]);

  const activePeriod = settings.periods.find(p => p.id === settings.activePeriodId);
  const activePeriodEvaluationId = activePeriod?.id || settings.period;
  const studentEvaluation = useMemo(() => {
    if (!selectedStudent) return null;
    // Find the evaluation for the current selected student in the active period
    // Since evaluations might have multiple entries over time for the same student/period, we sort by id (or we just take the last one)
    return [...evaluations].reverse().find(e => e.studentId === selectedStudent.id && e.period === activePeriodEvaluationId);
  }, [evaluations, selectedStudent, activePeriodEvaluationId]);

  const handleDownload = async () => {
    if (!reportRef.current || !selectedStudent) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toJpeg(reportRef.current, { 
        quality: 1,
        backgroundColor: '#f9fafb' // background color for the image
      });
      const link = document.createElement('a');
      link.download = `RAPOR_${selectedStudent.name.replace(/\s+/g, '_')}_${activePeriod?.year}.jpeg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating report image', err);
      alert('Gagal mengunduh rapor. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && selectedStudent) {
      try {
        await navigator.share({
          title: `Rapor ${selectedStudent.name}`,
          text: `Hasil Evaluasi Akademi Basket - ${selectedStudent.name} (${selectedStudent.classLevel}) - Nilai Akhir: ${Math.round(reportData?.finalScore || 0)}`,
        });
      } catch (err) {
        console.error('Share error:', err);
      }
    } else {
      alert('Fitur bagikan tidak didukung di browser ini.');
    }
  };

  if (selectedStudent && reportData) {
    return (
      <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedStudent(null)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:bg-white/10">
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-xl font-bold">Rapor Siswa</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 bg-white dark:bg-[#1A1C29] border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:bg-[#151720] shadow-sm text-gray-700 dark:text-gray-300 active:scale-95 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={handleDownload} disabled={isDownloading} className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm font-bold text-sm flex items-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100">
              <Download className="w-4 h-4" />
              {isDownloading ? 'Menyiapkan...' : 'Download'}
            </button>
          </div>
        </div>

        {/* Report Content to be captured */}
        <div ref={reportRef} className="space-y-6 p-4 -m-4 bg-gray-50 dark:bg-[#151720] rounded-2xl">
          <div className="bg-blue-800 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <Trophy className="w-24 h-24 absolute -top-4 -right-4 text-blue-700 dark:text-blue-400 opacity-50" />
            <div className="w-16 h-16 bg-white dark:bg-[#1A1C29]/20 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold backdrop-blur-sm">
              {selectedStudent.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
            <p className="text-blue-200 text-sm">{selectedStudent.studentId} • {selectedStudent.classLevel}</p>
            <div className="inline-block mt-3 px-3 py-1 bg-white dark:bg-[#1A1C29]/20 rounded-full text-xs font-medium border border-white/30 backdrop-blur-sm">
              Periode: {activePeriod?.semester} {activePeriod?.year}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1C29] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-4">
            <h4 className="font-bold border-b pb-2 text-gray-900 dark:text-white">Nilai 5 Pilar</h4>
            
            <ScoreRow label="Technical Skill" score={reportData.tVal} weight={settings.weights.technical} />
            <ScoreRow label="Tactical Understanding" score={reportData.tacVal} weight={settings.weights.tactical} />
            <ScoreRow label="Physical Development" score={reportData.pVal} weight={settings.weights.physical} />
            <ScoreRow label="Mental Development" score={reportData.mVal} weight={settings.weights.mental} />
            <ScoreRow label="Character & Teamwork" score={reportData.cVal} weight={settings.weights.character} />
            
            <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
              <span>Rata-rata 5 Pilar (90%)</span>
              <span>{reportData.pilarScore.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1C29] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-4">
            <h4 className="font-bold border-b pb-2 text-gray-900 dark:text-white">Kehadiran</h4>
            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              <div className="bg-green-50 rounded-lg p-2"><div className="text-sm font-bold text-green-700">{reportData.counts.hadir}</div><div className="text-[10px] text-gray-500 dark:text-gray-400">Hadir</div></div>
              <div className="bg-yellow-50 rounded-lg p-2"><div className="text-sm font-bold text-yellow-700">{reportData.counts.izin}</div><div className="text-[10px] text-gray-500 dark:text-gray-400">Izin</div></div>
              <div className="bg-blue-50 rounded-lg p-2"><div className="text-sm font-bold text-blue-700">{reportData.counts.sakit}</div><div className="text-[10px] text-gray-500 dark:text-gray-400">Sakit</div></div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2"><div className="text-sm font-bold text-blue-700 dark:text-blue-400">{reportData.counts.alpha}</div><div className="text-[10px] text-gray-500 dark:text-gray-400">Alpha</div></div>
            </div>
            <div className="flex justify-between font-bold text-gray-800">
              <span>Nilai Absensi (10%)</span>
              <span>{reportData.attScore.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">NILAI AKHIR</p>
              <div className="text-4xl font-black">{Math.round(reportData.finalScore)}</div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">PREDIKAT</p>
              <div className={cn("text-xl font-bold uppercase tracking-wider", 
                reportData.finalScore >= 80 ? "text-green-400" :
                reportData.finalScore >= 60 ? "text-yellow-400" : "text-blue-400"
              )}>
                {reportData.predikat}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1C29] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-4">
            <h4 className="font-bold border-b pb-2 text-gray-900 dark:text-white text-center">Catatan Pelatih</h4>
            <div className="bg-gray-50 dark:bg-[#151720] p-4 rounded-xl border border-gray-100 min-h-[100px] text-center flex items-center justify-center">
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {studentEvaluation?.notes?.recommendation 
                  ? `"${studentEvaluation.notes.recommendation}"` 
                  : `"${selectedStudent.name} telah mengikuti program latihan di periode ini. Terus tingkatkan kemampuan teknis dan tetap semangat dalam berlatih!"`}
              </p>
            </div>
            
            <div className="mt-8 flex justify-center items-end px-4">
              <div className="text-center relative">
                <div className="w-24 h-24 absolute -top-8 -left-4 opacity-10 pointer-events-none">
                  {/* Fake stamp SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 dark:text-blue-500 fill-current">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,2"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="50" y="42" textAnchor="middle" fontSize="10" fontWeight="bold">BASKETBALL</text>
                    <text x="50" y="58" textAnchor="middle" fontSize="12" fontWeight="black">ACADEMY</text>
                    <text x="50" y="68" textAnchor="middle" fontSize="8">OFFICIAL</text>
                  </svg>
                </div>
                <div className="w-24 h-16 border-b-2 border-gray-400 mx-auto mb-2 relative z-10 flex items-end justify-center">
                   {/* Fake signature line */}
                   <span className="font-['Brush_Script_MT',cursive] text-2xl text-blue-900 opacity-80">Coach</span>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Kepala Pelatih</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Basketball Academy</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Rapor Siswa</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Pilih siswa untuk melihat rapor</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama atau ID siswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1C29] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Semua', ...CLASSES].map(c => (
          <button
            key={c}
            onClick={() => setSelectedClass(c as any)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border", selectedClass === c ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-[#1A1C29] border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rankedStudents.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">Belum ada siswa di kelas ini.</p>
        ) : (
          rankedStudents.map((student, idx) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="w-full bg-white dark:bg-[#1A1C29] p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-300 dark:border-blue-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                  idx === 0 ? "bg-yellow-100 text-yellow-700" :
                  idx === 1 ? "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300" :
                  idx === 2 ? "bg-amber-100 text-amber-700" :
                  "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                )}>
                  #{idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{student.studentId} • Akhir: {student.stats.finalScore.toFixed(1)}</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 rotate-180" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ScoreRow({ label, score, weight }: { label: string, score: number, weight: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">Bobot {weight}%</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-blue-50 dark:bg-blue-900/200" style={{ width: `${score}%` }} />
        </div>
        <span className="font-bold w-8 text-right">{score.toFixed(1)}</span>
      </div>
    </div>
  );
}
