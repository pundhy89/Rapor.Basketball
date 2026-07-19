const fs = require('fs');
const path = require('path');

const applyHeader = (file, title, titleClass, colorClass, addLinkImport = true) => {
  const filePath = path.join(__dirname, 'src/components', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Add Link, ArrowLeft import if missing
  if (addLinkImport) {
    if (!content.includes("import { Link")) {
      content = content.replace(/import \{.*?\} from 'react-router-dom';/, match => match.replace('{', '{ Link, '));
      if (!content.includes("Link,")) {
        content = "import { Link } from 'react-router-dom';\n" + content;
      }
    }
  }

  // Ensure ArrowLeft is imported
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

  // Handle specific files
  if (file === 'Students.tsx') {
    content = content.replace(/<div className="flex justify-between items-center mb-6">/, 
      `<div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          ${backButtonHtml}
          <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
        </div>`);
    // Remove old title if any (it had an old <h2> maybe)
    content = content.replace(/<div className="flex items-center gap-3">\s*<Link[\s\S]*?<\/Link>\s*<h2 className="text-2xl font-black [^"]+">[^<]+<\/h2>\s*<\/div>\s*<h2 className="text-2xl font-bold text-white tracking-wide">Data Siswa<\/h2>/,
      `<div className="flex items-center gap-3">
          ${backButtonHtml}
          <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
        </div>`);
    // Just replace the standard h2 if it's there alone
    content = content.replace(/<h2 className="text-2xl font-bold text-white tracking-wide">Data Siswa<\/h2>/, 
      `<div className="flex items-center gap-3 mb-2">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  if (file === 'Coaches.tsx') {
    content = content.replace(/<h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Data Coach<\/h2>/, 
      `<div className="flex items-center gap-3 mb-6">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  if (file === 'Assessment.tsx') {
    // Has: <h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Penilaian & Absensi</h2>
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Penilaian & Absensi<\/h2>/, 
      `<div className="flex items-center gap-3 mb-1">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  if (file === 'Evaluation.tsx') {
    // Has: <h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Evaluasi Periode</h2>
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Evaluasi Periode<\/h2>/, 
      `<div className="flex items-center gap-3 mb-1">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  if (file === 'Report.tsx') {
    // Has: <h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Rapor Siswa</h2>
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Rapor Siswa<\/h2>/, 
      `<div className="flex items-center gap-3 mb-1">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
    // Inside the selected student view
    content = content.replace(/<h2 className="text-xl font-bold">Rapor Siswa<\/h2>/, 
      `<h2 className="text-xl font-black ${titleClass}">${title}</h2>`);
  }

  if (file === 'Settings.tsx') {
    // Has:
    // <div className="flex items-center gap-3 mb-6">
    //    <button onClick={() => navigate('/')} ...> <ArrowLeft ... /> </button>
    //    <h2 className="text-xl font-bold">Pengaturan</h2>
    // </div>
    content = content.replace(/<button\s+onClick=\{\(\) => navigate\('\/'\)\}[\s\S]*?<\/button>/, backButtonHtml);
    content = content.replace(/<h2 className="text-xl font-bold">Pengaturan<\/h2>/, 
      `<h2 className="text-2xl font-black ${titleClass}">${title}</h2>`);
  }
  
  if (file === 'Material.tsx') {
    content = content.replace(/<h2 className="text-2xl font-bold mb-1 text-white tracking-wide">Materi Dasar<\/h2>/, 
      `<div className="flex items-center gap-3 mb-1">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  if (file === 'Schedule.tsx') {
    content = content.replace(/<h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Jadwal Latihan<\/h2>/, 
      `<div className="flex items-center gap-3 mb-6">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  if (file === 'Notifications.tsx') {
    content = content.replace(/<h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Notifikasi<\/h2>/, 
      `<div className="flex items-center gap-3 mb-6">
        ${backButtonHtml}
        <h2 className="text-2xl font-black ${titleClass}">${title}</h2>
      </div>`);
  }

  fs.writeFileSync(filePath, content);
};

// Apply to pages
applyHeader('Students.tsx', 'Data Siswa', 'text-green-400 drop-shadow-[0_0_10px_#4ade80] [text-shadow:0_0_10px_#4ade80]', 'green');
applyHeader('Coaches.tsx', 'Data Coach', 'text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] [text-shadow:0_0_10px_#22d3ee]', 'cyan');
applyHeader('Assessment.tsx', 'Penilaian & Absen', 'text-fuchsia-400 drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]', 'fuchsia');
applyHeader('Report.tsx', 'Rapor Siswa', 'text-lime-400 drop-shadow-[0_0_10px_#a3e635] [text-shadow:0_0_10px_#a3e635]', 'lime');
applyHeader('Evaluation.tsx', 'Evaluasi Periode', 'text-orange-400 drop-shadow-[0_0_10px_#fb923c] [text-shadow:0_0_10px_#fb923c]', 'orange');
applyHeader('Settings.tsx', 'Pengaturan', 'text-purple-400 drop-shadow-[0_0_10px_#c084fc] [text-shadow:0_0_10px_#c084fc]', 'purple', false);
applyHeader('Material.tsx', 'Materi Dasar', 'text-pink-400 drop-shadow-[0_0_10px_#f472b6] [text-shadow:0_0_10px_#f472b6]', 'pink');
applyHeader('Schedule.tsx', 'Jadwal Latihan', 'text-yellow-400 drop-shadow-[0_0_10px_#facc15] [text-shadow:0_0_10px_#facc15]', 'yellow');
applyHeader('Notifications.tsx', 'Notifikasi', 'text-blue-400 drop-shadow-[0_0_10px_#60a5fa] [text-shadow:0_0_10px_#60a5fa]', 'blue');

