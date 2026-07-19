const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/IdCardModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update close button
content = content.replace(
  /className="p-2 bg-slate-300\/50 dark:bg-slate-700\/50 rounded-full hover:bg-slate-400\/50 dark:bg-slate-600\/50 transition-colors text-white"/g,
  'className="p-2 bg-black/60 border border-white/20 hover:bg-black/80 rounded-full transition-colors text-white shadow-lg"'
);

// Update dimension
content = content.replace(
  /className="w-\[320px\] h-\[400px\] relative rounded-3xl overflow-hidden bg-white\/50 dark:bg-black\/50 backdrop-blur-md/g,
  'className="w-[280px] h-[458px] relative rounded-3xl overflow-hidden bg-white/50 dark:bg-black/50 backdrop-blur-md'
);

fs.writeFileSync(file, content);
