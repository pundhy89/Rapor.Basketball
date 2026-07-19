const fs = require('fs');
let c = fs.readFileSync('src/components/Students.tsx', 'utf8');
c = c.replace(/<div>\s*<div className="flex items-center gap-3 mb-1">\s*<Link to="\/"[\s\S]*?<\/Link>\s*<h2[\s\S]*?<\/h2>\s*<\/div>\s*<p/g, 
  `<div>
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h2 className="text-2xl font-black text-green-400 drop-shadow-[0_0_10px_#4ade80] [text-shadow:0_0_10px_#4ade80]">Data Siswa</h2>
        </div>
        <p`);

// Second occurrence in Students.tsx was near Tambah Siswa Baru
// let's check it.
fs.writeFileSync('src/components/Students.tsx', c);
