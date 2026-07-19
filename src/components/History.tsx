import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Clock, Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { id } from 'date-fns/locale';

export function History() {
  const students = useStore((state) => state.students);
  const assessments = useStore((state) => state.assessments);
  const attendances = useStore((state) => state.attendances);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'assessment' | 'attendance'>('all');

  const combinedLog = useMemo(() => {
    const logs: any[] = [];
    
    assessments.forEach(a => {
      logs.push({
        ...a,
        type: 'assessment',
        timestamp: new Date(a.date).getTime()
      });
    });

    attendances.forEach(a => {
      logs.push({
        ...a,
        type: 'attendance',
        timestamp: new Date(a.date).getTime()
      });
    });

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }, [assessments, attendances]);

  const filteredLogs = useMemo(() => {
    return combinedLog.filter(log => {
      const student = students.find(s => s.id === log.studentId);
      const studentName = student?.name?.toLowerCase() || '';
      
      const matchName = studentName.includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || log.type === filterType;
      
      return matchName && matchType;
    });
  }, [combinedLog, students, searchTerm, filterType]);
  const handleExport = () => {
    const exportData = filteredLogs.map(log => {
      const student = students.find(s => s.id === log.studentId);
      const baseRow = {
        Tanggal: format(new Date(log.date), 'dd/MM/yyyy'),
        Siswa: student?.name || 'Unknown',
        Kelas: student?.classLevel || '-',
        Tipe: log.type === 'attendance' ? 'Absensi' : 'Penilaian',
        Catatan: log.notes || ''
      };
      
      if (log.type === 'attendance') {
        return {
          ...baseRow,
          Status_Atau_Nilai: log.status,
          Alasan: log.reason || ''
        };
      } else {
        return {
          ...baseRow,
          Status_Atau_Nilai: `Technical: ${log.scores?.technical || 0}, Tactical: ${log.scores?.tactical || 0}, Physical: ${log.scores?.physical || 0}, Mental: ${log.scores?.mental || 0}, Character: ${log.scores?.character || 0}`,
          Target: log.target || ''
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Log & History");
    XLSX.writeFile(workbook, "history_akademi.xlsx");
  };


  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-1.5 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          <h2 className="text-xl font-black tracking-wide text-white drop-shadow-md whitespace-nowrap">Log & History</h2>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 bg-blue-600/80 text-white rounded-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20 font-bold text-xs flex items-center gap-1.5 hover:bg-blue-500 transition-colors flex-shrink-0 whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" /> Export (.xls)
        </button>
      </div>

      <div className="bg-transparent dark:bg-transparent backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 dark:bg-slate-800/50 border border-white/10 dark:border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'attendance', 'assessment'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  filterType === type
                    ? 'bg-blue-500 border-blue-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'Semua' : type === 'attendance' ? 'Absensi' : 'Nilai'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-white/50 bg-white/5 rounded-2xl border border-white/10">
              Belum ada data history.
            </div>
          ) : (
            filteredLogs.map((log, i) => {
              const student = students.find(s => s.id === log.studentId);
              
              return (
                <div key={`${log.id}-${i}`} className="p-4 bg-white/5 dark:bg-slate-800/50 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white text-lg">{student?.name || 'Unknown Student'}</h4>
                      <p className="text-white/70 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(log.date), 'dd MMMM yyyy', { locale: id })}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      log.type === 'attendance' 
                        ? log.status === 'Hadir' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {log.type === 'attendance' ? `Absen: ${log.status}` : 'Penilaian'}
                    </div>
                  </div>
                  
                  {log.type === 'assessment' && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {Object.entries(log.scores).map(([key, value]) => (
                        <div key={key} className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-[10px] text-white/50 uppercase tracking-wider">{key.substring(0, 4)}</div>
                          <div className="font-bold text-white">{value as number}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {log.notes && (
                    <p className="mt-3 text-sm text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="font-semibold text-white/90">Catatan:</span> {log.notes}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
