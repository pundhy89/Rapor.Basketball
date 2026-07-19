const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Students.tsx');
let content = fs.readFileSync(file, 'utf8');

// Add getClassColorHelper inside component or globally? Let's just put it outside the component
const helper = `
const getClassColor = (level) => {
  switch(level) {
    case 'SD Lower': return 'border-pink-400 text-pink-400 bg-pink-400/10 shadow-[0_0_8px_rgba(244,114,182,0.4)]';
    case 'SD Berkembang': return 'border-yellow-400 text-yellow-400 bg-yellow-400/10 shadow-[0_0_8px_rgba(250,204,21,0.4)]';
    case 'SD Upper': return 'border-green-400 text-green-400 bg-green-400/10 shadow-[0_0_8px_rgba(74,222,128,0.4)]';
    case 'SMP': return 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_8px_rgba(34,211,238,0.4)]';
    case 'SMA': return 'border-purple-400 text-purple-400 bg-purple-400/10 shadow-[0_0_8px_rgba(192,132,252,0.4)]';
    default: return 'border-white/50 text-white/90 bg-white/10';
  }
};
`;

if (!content.includes('getClassColor')) {
  content = content.replace(/export function Students\(\) \{/, helper + '\nexport function Students() {');
}

const targetStr = /<span className="text-xs bg-indigo-50 text-white px-2 py-0\.5 rounded-md font-medium">#\{student\.jerseyNumber\}<\/span>/g;
content = content.replace(targetStr, '<span className={`text-xs px-2 py-0.5 rounded-md font-bold border ${getClassColor(student.classLevel)}`}>#{student.jerseyNumber}</span>');

fs.writeFileSync(file, content);
