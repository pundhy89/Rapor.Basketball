const fs = require('fs');
let code = fs.readFileSync('src/components/History.tsx', 'utf8');

// add Download icon to imports
code = code.replace(/import { ([^}]+) } from 'lucide-react';/, "import { $1, Download } from 'lucide-react';");

// add xlsx import
if (!code.includes("import * as XLSX")) {
    code = code.replace(/import { format } from 'date-fns';/, "import { format } from 'date-fns';\nimport * as XLSX from 'xlsx';");
}

// Add export function
const exportLogic = `
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
          Status_Atau_Nilai: \`Technical: \${log.scores?.technical || 0}, Tactical: \${log.scores?.tactical || 0}, Physical: \${log.scores?.physical || 0}, Mental: \${log.scores?.mental || 0}, Character: \${log.scores?.character || 0}\`,
          Target: log.target || ''
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Log & History");
    XLSX.writeFile(workbook, "history_akademi.xlsx");
  };
`;

code = code.replace(
  /const filteredLogs = useMemo[\s\S]*?\]\);/,
  "$&" + exportLogic
);

// Add Export button
code = code.replace(
  /<div className="flex flex-col sm:flex-row gap-4 mb-6">/,
  `<div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600/80 text-white rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20 font-bold text-sm flex items-center gap-2 hover:bg-blue-500 transition-colors"
          >
            <Download className="w-4 h-4" /> Export (.xls)
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">`
);

fs.writeFileSync('src/components/History.tsx', code);
console.log('History Export patched');
