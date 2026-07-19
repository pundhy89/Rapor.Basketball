import { Link } from 'react-router-dom';
import { useState, useMemo, useRef } from 'react';
import { useStore } from '../store';
import { ClassLevel, Student } from '../types';
import { cn } from './Layout';
import { ArrowLeft, Trophy, ChevronLeft, Download, Share2, Search } from 'lucide-react';
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
      
      const elementsWithBlur = reportRef.current.querySelectorAll('.backdrop-blur-md, .backdrop-blur-sm, .bg-transparent, .bg-white\\/5, .dark\\:bg-slate-800\\/50, .border-white\\/20');
      const originalStyles = new Map();
      
      elementsWithBlur.forEach((el, idx) => {
        originalStyles.set(idx, el.className);
        let newClass = el.className
          .replace(/backdrop-blur-(md|sm)/g, '')
          .replace(/bg-transparent/g, 'bg-[#0B0C10]')
          .replace(/bg-white\/5/g, 'bg-[#1f2937]')
          .replace(/dark\:bg-slate-800\/50/g, 'bg-[#1f2937]')
          .replace(/border-white\/20/g, 'border-slate-700');
        el.className = newClass;
      });
      
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await toJpeg(reportRef.current, { 
        quality: 1,
        backgroundColor: '#0B0C10',
        style: {
          color: '#ffffff'
        }
      });
      
      elementsWithBlur.forEach((el, idx) => {
        el.className = originalStyles.get(idx);
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
            <button onClick={() => setSelectedStudent(null)} className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full hover:bg-gray-200 dark:bg-slate-300/50 dark:bg-slate-700/50">
              <ChevronLeft className="w-5 h-5 text-white/90" />
            </button>
            <h2 className="text-xl font-black text-lime-400 drop-shadow-[0_0_10px_#a3e635] [text-shadow:0_0_10px_#a3e635]">Rapor Siswa</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShare} className="p-2 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-full hover:bg-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white/90 active:scale-95 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={handleDownload} disabled={isDownloading} className="px-4 py-2 bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white rounded-full hover:bg-blue-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] font-bold text-sm flex items-center gap-2 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100">
              <Download className="w-4 h-4" />
              {isDownloading ? 'Menyiapkan...' : 'Download'}
            </button>
          </div>
        </div>

        {/* Report Content to be captured */}
        <div ref={reportRef} className="space-y-6 p-4 -m-4 bg-transparent rounded-2xl">
          <div className="bg-blue-800 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <Trophy className="w-24 h-24 absolute -top-4 -right-4 text-white dark:text-blue-400 opacity-50" />
            <div className="w-16 h-16 bg-transparent dark:bg-transparent backdrop-blur-md/20 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-blue-800 dark:text-white backdrop-blur-sm">
              {selectedStudent.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
            <p className="text-blue-200 text-sm">{selectedStudent.studentId} • {selectedStudent.classLevel}</p>
            <div className="inline-block mt-3 px-3 py-1 bg-transparent dark:bg-transparent backdrop-blur-md/20 rounded-full text-xs font-medium border border-white/20 dark:border-white/20/30 backdrop-blur-sm">
              Periode: {activePeriod?.semester} {activePeriod?.year}
            </div>
          </div>

          <div className="bg-transparent dark:bg-transparent backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/20 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
            <h4 className="font-bold border-b pb-2 text-white tracking-wide">Nilai 5 Pilar</h4>
            
            <ScoreRow label="Technical Skill" score={reportData.tVal} weight={settings.weights.technical} colorClass="bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
            <ScoreRow label="Tactical Understanding" score={reportData.tacVal} weight={settings.weights.tactical} colorClass="bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <ScoreRow label="Physical Development" score={reportData.pVal} weight={settings.weights.physical} colorClass="bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
            <ScoreRow label="Mental Development" score={reportData.mVal} weight={settings.weights.mental} colorClass="bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />
            <ScoreRow label="Character & Teamwork" score={reportData.cVal} weight={settings.weights.character} colorClass="bg-rose-400 shadow-[0_0_8px_#fb7185]" />
            
            <div className="border-t pt-2 flex justify-between font-bold text-white">
              <span>Rata-rata 5 Pilar (90%)</span>
              <span>{reportData.pilarScore.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-transparent dark:bg-transparent backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/20 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
            <h4 className="font-bold border-b pb-2 text-white tracking-wide">Kehadiran</h4>
            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              <div className="bg-green-400/20 border border-green-400 rounded-lg p-2 shadow-[0_0_8px_rgba(74,222,128,0.3)]"><div className="text-sm font-black text-green-400">{reportData.counts.hadir}</div><div className="text-[10px] text-green-400/80 font-bold uppercase tracking-wide">Hadir</div></div>
              <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-2 shadow-[0_0_8px_rgba(250,204,21,0.3)]"><div className="text-sm font-black text-yellow-400">{reportData.counts.izin}</div><div className="text-[10px] text-yellow-400/80 font-bold uppercase tracking-wide">Izin</div></div>
              <div className="bg-blue-400/20 border border-blue-400 rounded-lg p-2 shadow-[0_0_8px_rgba(96,165,250,0.3)]"><div className="text-sm font-black text-blue-400">{reportData.counts.sakit}</div><div className="text-[10px] text-blue-400/80 font-bold uppercase tracking-wide">Sakit</div></div>
              <div className="bg-pink-400/20 border border-pink-400 rounded-lg p-2 shadow-[0_0_8px_rgba(244,114,182,0.3)]"><div className="text-sm font-black text-pink-400">{reportData.counts.alpha}</div><div className="text-[10px] text-pink-400/80 font-bold uppercase tracking-wide">Alpha</div></div>
            </div>
            <div className="flex justify-between font-bold text-white">
              <span>Nilai Absensi (10%)</span>
              <span>{reportData.attScore.toFixed(2)}</span>
            </div>
          </div>

          <div className={cn("bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] flex items-center justify-between border-[2px]", reportData.finalScore >= 80 ? "border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]" : reportData.finalScore >= 60 ? "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]")}>
            <div>
              <p className="text-white/70 text-sm mb-1">NILAI AKHIR</p>
              <div className="text-4xl font-black">{Math.round(reportData.finalScore)}</div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm mb-1">PREDIKAT</p>
              <div className={cn("text-xl font-bold uppercase tracking-wider", 
                reportData.finalScore >= 80 ? "text-green-400" :
                reportData.finalScore >= 60 ? "text-yellow-400" : "text-blue-400"
              )}>
                {reportData.predikat}
              </div>
            </div>
          </div>

          <div className="bg-transparent dark:bg-transparent backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/20 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
            <h4 className="font-bold border-b pb-2 text-white tracking-wide text-center">Catatan Pelatih</h4>
            <div className="bg-transparent p-4 rounded-xl border border-gray-100 min-h-[100px] text-center flex items-center justify-center">
              <p className="text-sm text-white/90 italic">
                {studentEvaluation?.notes?.recommendation 
                  ? `"${studentEvaluation.notes.recommendation}"` 
                  : `"${selectedStudent.name} telah mengikuti program latihan di periode ini. Terus tingkatkan kemampuan teknis dan tetap semangat dalam berlatih!"`}
              </p>
            </div>
            
            <div className="mt-8 flex justify-center items-end px-4">
              <div className="text-center relative">
                <div className="w-24 h-24 absolute -top-8 -left-4 opacity-10 pointer-events-none">
                  {/* Fake stamp SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white dark:text-white fill-current">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,2"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="50" y="42" textAnchor="middle" fontSize="10" fontWeight="bold">BASKETBALL</text>
                    <text x="50" y="58" textAnchor="middle" fontSize="12" fontWeight="black">ACADEMY</text>
                    <text x="50" y="68" textAnchor="middle" fontSize="8">OFFICIAL</text>
                  </svg>
                </div>
                <div className="w-24 h-16 border-b-2 border-gray-400 mx-auto mb-2 relative z-10 flex items-end justify-center">
                   {/* Fake signature line */}
                   <span className="font-['Brush_Script_MT',cursive] text-xl text-orange-400 drop-shadow-[0_0_8px_#fb923c] whitespace-nowrap leading-none mb-1">{settings?.academy?.headName || "Coach"}</span>
                </div>
                <p className="text-sm font-bold text-white tracking-wide">Kepala Pelatih</p>
                <p className="text-xs text-white/70">{settings?.academy?.name || 'Basketball Academy'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
          <h2 className="text-2xl font-black text-lime-400 drop-shadow-[0_0_10px_#a3e635] [text-shadow:0_0_10px_#a3e635]">Rapor Siswa</h2>
        </div>
        <p className="text-sm text-white/70">Pilih siswa untuk melihat rapor</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        <input
          type="text"
          placeholder="Cari nama atau ID siswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-white/20 dark:border-white/20 bg-transparent dark:bg-transparent backdrop-blur-md rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white tracking-wide"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Semua', ...CLASSES].map(c => (
          <button
            key={c}
            onClick={() => setSelectedClass(c as any)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border", selectedClass === c ? "bg-white/30 dark:bg-white/5 border-blue-200 dark:border-blue-800 text-white dark:text-blue-400" : "bg-transparent dark:bg-transparent backdrop-blur-md border-white/20 dark:border-white/20 text-white/70")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rankedStudents.length === 0 ? (
          <p className="text-center text-white/70 text-sm py-10">Belum ada siswa di kelas ini.</p>
        ) : (
          rankedStudents.map((student, idx) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="w-full bg-transparent dark:bg-transparent backdrop-blur-md p-4 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] border border-gray-100 flex items-center justify-between hover:border-blue-300 dark:border-blue-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                  idx === 0 ? "bg-yellow-100 text-white" :
                  idx === 1 ? "bg-gray-200 dark:bg-slate-300/50 dark:bg-slate-700/50 text-white/90" :
                  idx === 2 ? "bg-amber-100 text-white" :
                  "bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 text-white/70"
                )}>
                  #{idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white tracking-wide">{student.name}</h3>
                  <p className="text-xs text-white/70">{student.studentId} • Akhir: {student.stats.finalScore.toFixed(1)}</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-white/90 rotate-180" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function ScoreRow({ label, score, weight, colorClass }: { label: string, score: number, weight: number, colorClass?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex flex-col">
        <span className="font-medium text-white">{label}</span>
        <span className="text-[10px] text-white/70">Bobot {weight}%</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
          <div className={cn("h-full", colorClass || "bg-slate-700 dark:bg-slate-300")} style={{ width: `${score}%` }} />
        </div>
        <span className="font-bold w-8 text-right">{score.toFixed(1)}</span>
      </div>
    </div>
  );
}
