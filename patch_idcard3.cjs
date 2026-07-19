const fs = require('fs');
let code = fs.readFileSync('src/components/IdCardModal.tsx', 'utf8');

// 1. Change card background container
code = code.replace(
  'className="w-[280px] h-[458px] relative rounded-3xl overflow-hidden bg-white/50 dark:bg-black/50 backdrop-blur-md border-2 border-white/30 shadow-[0_0_25px_rgba(168,85,247,0.6)] flex flex-col items-center pt-8 pb-6"',
  'className="w-[280px] h-[458px] relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-sm border border-white/20 shadow-xl flex flex-col items-center pt-8 pb-6"'
);

// 2. Change the cyberpunk gradient to a dark abstract background
code = code.replace(
  '<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 opacity-90" />',
  '<div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-[#0B0C10]/80 to-slate-900/80 pointer-events-none" />'
);

// 3. Update the lines to be gradient
code = code.replaceAll(
  '<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />',
  '<div className="h-[1.5px] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-80" />'
);

fs.writeFileSync('src/components/IdCardModal.tsx', code);
console.log('Done');
