const fs = require('fs');
const path = require('path');

const replaceHeader = (file, oldPattern, newHeaderHTML) => {
  const filePath = path.join(__dirname, 'src/components', file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldPattern, newHeaderHTML);
  fs.writeFileSync(filePath, content);
};

// 1. Coaches.tsx
// old: <div className="flex items-center justify-between">\s*<h2 className="text-xl font-bold">Data Coach</h2>
const coachHeader = `<div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] [text-shadow:0_0_10px_#22d3ee]">Data Coach</h2>
        </div>`;
replaceHeader('Coaches.tsx', /<div className="flex items-center justify-between">\s*<h2 className="text-xl font-bold">Data Coach<\/h2>/, coachHeader);

// 2. Assessment.tsx
// old: <div>\s*<h2 className="text-2xl font-bold mb-3 text-white tracking-wide">Penilaian & Absensi<\/h2>
const assessmentHeader = `<div>
        <div className="flex items-center gap-3 mb-3">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-fuchsia-400 drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]">Penilaian & Absensi</h2>
        </div>`;
replaceHeader('Assessment.tsx', /<div>\s*<h2 className="text-2xl font-bold mb-3 text-white tracking-wide">Penilaian & Absensi<\/h2>/, assessmentHeader);

// 3. Evaluation.tsx
// old: <div>\s*<h2 className="text-xl font-bold mb-1">Evaluasi Periode<\/h2>
const evaluationHeader = `<div>
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-orange-400 drop-shadow-[0_0_10px_#fb923c] [text-shadow:0_0_10px_#fb923c]">Evaluasi Periode</h2>
        </div>`;
replaceHeader('Evaluation.tsx', /<div>\s*<h2 className="text-xl font-bold mb-1">Evaluasi Periode<\/h2>/, evaluationHeader);

