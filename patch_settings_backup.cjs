const fs = require('fs');
let code = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// Add import icons
code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, FileJson, UploadCloud} from 'lucide-react';");

const backupFunctions = `
  const handleExportJSON = () => {
    const state = useStore.getState();
    const data = {
      students: state.students,
      coaches: state.coaches,
      assessments: state.assessments,
      attendances: state.attendances,
      evaluations: state.evaluations,
      settings: state.settings,
      schedules: state.schedules,
      notifications: state.notifications
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`akademi_backup_\${new Date().toISOString().split('T')[0]}.json\`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('Apakah Anda yakin ingin menimpa semua data saat ini dengan data dari file backup?')) {
          setAllData(data);
          if (data.settings) setLocalSettings(data.settings);
          alert('Data berhasil dipulihkan!');
        }
      } catch (err) {
        alert('Format file backup tidak valid!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
`;

code = code.replace(/const handleBackupToDrive =/, backupFunctions + '\n  const handleBackupToDrive =');

const localBackupUI = `
          <div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <h4 className="font-bold text-white mb-1">Local Backup (.JSON)</h4>
            <p className="text-xs text-white mb-3">Download semua pengaturan dan data ke file JSON untuk dipindahkan ke domain lain (misal: Github Pages).</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleExportJSON} className="w-full bg-slate-800 dark:bg-slate-200 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors hover:bg-slate-700">
                <FileJson className="w-4 h-4" /> Export Backup
              </button>
              <label className="w-full bg-blue-600/50 hover:bg-blue-600/70 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm border border-blue-400/30 transition-colors cursor-pointer">
                <UploadCloud className="w-4 h-4" /> Import Backup
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>
`;

code = code.replace(
  /<div className="p-4 bg-white\/10 dark:bg-white\/5 backdrop-blur-md rounded-xl border border-white\/20 dark:border-white\/20 shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.4\),0_8px_32px_0_rgba\(31,38,135,0\.07\)\] dark:shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.1\),0_8px_32px_0_rgba\(0,0,0,0\.2\)\]">\s*<h4 className="font-bold text-white mb-1">Export Data<\/h4>/,
  localBackupUI + '\n          <div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">\n            <h4 className="font-bold text-white mb-1">Export Data CSV</h4>'
);

fs.writeFileSync('src/components/Settings.tsx', code);
console.log('patched Settings backup');
