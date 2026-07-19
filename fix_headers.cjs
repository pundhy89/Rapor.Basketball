const fs = require('fs');
const path = require('path');

const files = [
  { name: 'Students.tsx', title: 'Data Siswa', color: 'green-400', hex: '#4ade80' },
  { name: 'Coaches.tsx', title: 'Data Coach', color: 'cyan-400', hex: '#22d3ee' },
  { name: 'Assessment.tsx', title: 'Penilaian & Absen', color: 'fuchsia-400', hex: '#e879f9' },
  { name: 'Report.tsx', title: 'Rapor Siswa', color: 'lime-400', hex: '#a3e635' },
  { name: 'Evaluation.tsx', title: 'Evaluasi Periode', color: 'orange-400', hex: '#fb923c' },
  { name: 'Settings.tsx', title: 'Pengaturan', color: 'purple-400', hex: '#c084fc' },
  { name: 'Material.tsx', title: 'Materi Dasar', color: 'pink-400', hex: '#f472b6' },
  { name: 'Schedule.tsx', title: 'Jadwal Latihan', color: 'yellow-400', hex: '#facc15' },
  { name: 'Notifications.tsx', title: 'Notifikasi', color: 'blue-400', hex: '#60a5fa' }
];

files.forEach(({ name, title, color, hex }) => {
  const filePath = path.join(__dirname, 'src/components', name);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Find all <h2 ...>TITLE</h2> occurrences and standardise them
  const h2Regex = new RegExp(`<h2[^>]*>${title.replace('&', '\\&')}</h2>`, 'gi');
  
  const titleClass = `text-${color} drop-shadow-[0_0_10px_${hex}] [text-shadow:0_0_10px_${hex}]`;

  const newHeader = `<div className="flex items-center gap-3 mb-1">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
        </div>`;

  // First, let's remove any previously inserted Link blocks that might have been tangled
  content = content.replace(/<div className="flex items-center gap-3">\s*<Link to="\/"[\s\S]*?<\/Link>\s*<h2 className="text-2xl font-black [^"]+">.*?<\/h2>\s*<\/div>/g, '');
  content = content.replace(/<div className="flex items-center gap-3 mb-1">\s*<Link to="\/"[\s\S]*?<\/Link>\s*<h2 className="text-2xl font-black [^"]+">.*?<\/h2>\s*<\/div>/g, '');
  content = content.replace(/<Link to="\/" className="p-2 bg-transparent\/60[\s\S]*?<\/Link>\s*<h2 className="text-2xl font-black [^"]+">.*?<\/h2>\s*<\/div>/g, '');
  content = content.replace(/<div className="flex items-center gap-3 mb-6">\s*<Link to="\/"[\s\S]*?<\/Link>\s*<h2 className="text-2xl font-black [^"]+">.*?<\/h2>\s*<\/div>/g, '');
  content = content.replace(/<div className="flex items-center gap-3 mb-2">\s*<Link to="\/"[\s\S]*?<\/Link>\s*<h2 className="text-2xl font-black [^"]+">.*?<\/h2>\s*<\/div>/g, '');
  
  // Re-insert standard h2, then replace it with the clean newHeader
  // Wait, if I removed the header entirely, I need to know where to insert it.
  // Actually, some files have different structures. Let's just check if it's there.
  // This might be risky. Let's just pull the original file and do a single replace.

});
