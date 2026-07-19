const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Students.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacement = `const getClassColor = (level) => {
  switch(level) {
    case 'SD Lower': return 'border-blue-400 text-blue-400 bg-blue-400/10 shadow-[0_0_8px_rgba(96,165,250,0.4)]';
    case 'SD Berkembang': return 'border-emerald-400 text-emerald-400 bg-emerald-400/10 shadow-[0_0_8px_rgba(52,211,153,0.4)]';
    case 'SD Upper': return 'border-amber-400 text-amber-400 bg-amber-400/10 shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    case 'SMP': return 'border-fuchsia-400 text-fuchsia-400 bg-fuchsia-400/10 shadow-[0_0_8px_rgba(232,121,249,0.4)]';
    case 'SMA': return 'border-rose-400 text-rose-400 bg-rose-400/10 shadow-[0_0_8px_rgba(251,113,133,0.4)]';
    default: return 'border-white/50 text-white/90 bg-white/10';
  }
};`;

content = content.replace(/const getClassColor = \(level\) => \{[\s\S]*?\};/, replacement);

fs.writeFileSync(file, content);
