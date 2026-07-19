const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Students.tsx',
  'src/components/Evaluation.tsx',
  'src/components/Assessment.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  
  // The generic ones in modals
  content = content.replace(
    /className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-white"/g,
    'className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-colors text-white relative z-50"'
  );
  
  content = content.replace(
    /className="p-2 bg-transparent\/60 dark:bg-slate-300\/50 dark:bg-slate-700\/50 rounded-full hover:bg-gray-200 dark:hover:bg-slate-400\/50 dark:bg-slate-600\/50"/g,
    'className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-colors text-white relative z-50"'
  );

  content = content.replace(
    /<X className="w-[0-9]+ h-[0-9]+ text-white\/[0-9]+" \/>/g,
    '<X className="w-5 h-5 text-white drop-shadow-md" />'
  );

  // In Students.tsx there was:
  // <button onClick={onClose}><X className="w-6 h-6 text-white/70" /></button>
  content = content.replace(
    /<button onClick=\{onClose\}><X className="w-6 h-6 text-white\/70" \/><\/button>/g,
    '<button onClick={onClose} type="button" className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-colors text-white relative z-50"><X className="w-5 h-5 text-white drop-shadow-md" /></button>'
  );

  fs.writeFileSync(path.join(__dirname, file), content);
});
