const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/IdCardModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update card container styles
content = content.replace(
  /border-2 border-cyan-500\/60 shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.4\),0_8px_32px_0_rgba\(31,38,135,0\.07\)\] dark:shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.1\),0_8px_32px_0_rgba\(0,0,0,0\.2\)\]/,
  'border-2 border-white/30 shadow-[0_0_25px_rgba(168,85,247,0.6)]'
);

// 2. Update background gradient
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-\[#0B0F24\] via-\[#05050A\] to-\[#0B0F24\]" \/>/,
  '<div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 opacity-90" />'
);

// 3. Update inner container glowing edge
content = content.replace(
  /border-cyan-400\/20 shadow-\[inset_0_0_20px_rgba\(6,182,212,0\.1\)\]/,
  'border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]'
);

// 4. Side sci-fi accents
content = content.replace(
  /bg-cyan-400 shadow-\[0_0_10px_#22d3ee\]/g,
  'bg-white shadow-[0_0_10px_#ffffff]'
);

// 5. Glowing ring photo border
content = content.replace(
  /bg-gradient-to-br from-cyan-300 via-blue-600 to-cyan-300/g,
  'bg-gradient-to-br from-blue-300 via-purple-300 to-orange-300'
);
content = content.replace(
  /border-\[#0B0F24\] bg-slate-800/,
  'border-purple-900 bg-slate-800'
);
content = content.replace(
  /bg-cyan-300 blur-\[2px\]/,
  'bg-white blur-[2px]'
);

// 6. Name Plate
content = content.replace(
  /border-y-\[2px\] border-cyan-400/,
  'border-y-[2px] border-white/50'
);

// 7. Dividers
content = content.replace(
  /bg-gradient-to-r from-transparent via-cyan-500\/80 to-transparent/g,
  'bg-gradient-to-r from-transparent via-white/50 to-transparent'
);

fs.writeFileSync(filePath, content);
