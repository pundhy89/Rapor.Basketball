const fs = require('fs');
const path = require('path');

const applyHeader = (file, title, titleClass) => {
  const filePath = path.join(__dirname, 'src/components', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix ArrowLeft & Link if needed
  if (!content.includes("import { Link")) {
    content = "import { Link } from 'react-router-dom';\n" + content;
  }
  if (!content.includes('ArrowLeft')) {
    content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, (match, p1) => {
      if (!p1.includes('ArrowLeft')) {
        return `import { ArrowLeft, ${p1.trim()} } from 'lucide-react';`;
      }
      return match;
    });
  }

  const backButtonHtml = `<Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>`;

  const newHeader = `<div className="flex items-center gap-3 mb-1">
          ${backButtonHtml}
          <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
        </div>`;

  if (file === 'Students.tsx') {
    content = content.replace(/<div>\s*<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Data Siswa<\/h2>/, 
      `<div>\n        ${newHeader}`);
  }

  if (file === 'Coaches.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-6">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Data Coach<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Data Coach<\/h2>/, newHeader);
  }

  if (file === 'Assessment.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-1">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Penilaian & Absen<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Penilaian & Absensi<\/h2>/, newHeader);
  }

  if (file === 'Evaluation.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-1">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Evaluasi Periode<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Evaluasi Periode<\/h2>/, newHeader);
  }

  if (file === 'Report.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-1">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Rapor Siswa<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Rapor Siswa<\/h2>/, newHeader);
  }

  if (file === 'Material.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-1">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Materi Dasar<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Materi Dasar<\/h2>/, newHeader);
  }

  if (file === 'Schedule.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-6">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Jadwal Latihan<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Jadwal Latihan<\/h2>/, newHeader);
  }

  if (file === 'Notifications.tsx') {
    content = content.replace(/<div className="flex items-center gap-3 mb-6">[\s\S]*?<h2 className="text-2xl font-black[^>]+>Notifikasi<\/h2>\s*<\/div>/, newHeader);
    content = content.replace(/<h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Notifikasi<\/h2>/, newHeader);
  }

  if (file === 'Settings.tsx') {
    const settingsHeader = `<div className="flex items-center gap-3 mb-6">
          ${backButtonHtml}
          <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
        </div>`;
    content = content.replace(/<div className="flex items-center gap-3 mb-6">[\s\S]*?<\/div>/, settingsHeader);
  }

  fs.writeFileSync(filePath, content);
};

// Apply to pages again to clean up and re-run
applyHeader('Students.tsx', 'Data Siswa', 'text-green-400 drop-shadow-[0_0_10px_#4ade80] [text-shadow:0_0_10px_#4ade80]');
applyHeader('Coaches.tsx', 'Data Coach', 'text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] [text-shadow:0_0_10px_#22d3ee]');
applyHeader('Assessment.tsx', 'Penilaian & Absen', 'text-fuchsia-400 drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]');
applyHeader('Report.tsx', 'Rapor Siswa', 'text-lime-400 drop-shadow-[0_0_10px_#a3e635] [text-shadow:0_0_10px_#a3e635]');
applyHeader('Evaluation.tsx', 'Evaluasi Periode', 'text-orange-400 drop-shadow-[0_0_10px_#fb923c] [text-shadow:0_0_10px_#fb923c]');
applyHeader('Settings.tsx', 'Pengaturan', 'text-purple-400 drop-shadow-[0_0_10px_#c084fc] [text-shadow:0_0_10px_#c084fc]');
applyHeader('Material.tsx', 'Materi Dasar', 'text-pink-400 drop-shadow-[0_0_10px_#f472b6] [text-shadow:0_0_10px_#f472b6]');
applyHeader('Schedule.tsx', 'Jadwal Latihan', 'text-yellow-400 drop-shadow-[0_0_10px_#facc15] [text-shadow:0_0_10px_#facc15]');
applyHeader('Notifications.tsx', 'Notifikasi', 'text-blue-400 drop-shadow-[0_0_10px_#60a5fa] [text-shadow:0_0_10px_#60a5fa]');

