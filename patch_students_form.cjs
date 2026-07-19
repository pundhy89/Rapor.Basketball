const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Students.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<button onClick=\{onClose\}><X className="w-5 h-5 text-white drop-shadow-md" \/><\/button>/g,
  '<button onClick={onClose} type="button" className="p-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full transition-colors text-white relative z-50"><X className="w-5 h-5 text-white drop-shadow-md" /></button>'
);

fs.writeFileSync(file, content);
