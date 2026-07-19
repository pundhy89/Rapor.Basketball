const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Report.tsx');
let content = fs.readFileSync(file, 'utf8');

// Attendance Modification
const attendanceRegex = /<div className="grid grid-cols-4 gap-2 text-center mb-3">[\s\S]*?<\/div>\s*<\/div>\s*<div className="flex justify-between font-bold text-white">/g;

const newAttendance = `<div className="grid grid-cols-4 gap-2 text-center mb-3">
              <div className="bg-green-400/20 border border-green-400 rounded-lg p-2 shadow-[0_0_8px_rgba(74,222,128,0.3)]"><div className="text-sm font-black text-green-400">{reportData.counts.hadir}</div><div className="text-[10px] text-green-400/80 font-bold uppercase tracking-wide">Hadir</div></div>
              <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-2 shadow-[0_0_8px_rgba(250,204,21,0.3)]"><div className="text-sm font-black text-yellow-400">{reportData.counts.izin}</div><div className="text-[10px] text-yellow-400/80 font-bold uppercase tracking-wide">Izin</div></div>
              <div className="bg-blue-400/20 border border-blue-400 rounded-lg p-2 shadow-[0_0_8px_rgba(96,165,250,0.3)]"><div className="text-sm font-black text-blue-400">{reportData.counts.sakit}</div><div className="text-[10px] text-blue-400/80 font-bold uppercase tracking-wide">Sakit</div></div>
              <div className="bg-pink-400/20 border border-pink-400 rounded-lg p-2 shadow-[0_0_8px_rgba(244,114,182,0.3)]"><div className="text-sm font-black text-pink-400">{reportData.counts.alpha}</div><div className="text-[10px] text-pink-400/80 font-bold uppercase tracking-wide">Alpha</div></div>
            </div>
            <div className="flex justify-between font-bold text-white">`;

content = content.replace(attendanceRegex, newAttendance);

// Final Score Border
const finalScoreRegex = /<div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.4\),0_8px_32px_0_rgba\(31,38,135,0\.07\)\] dark:shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.1\),0_8px_32px_0_rgba\(0,0,0,0\.2\)\] flex items-center justify-between">/g;

content = content.replace(finalScoreRegex, `<div className={cn("bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] flex items-center justify-between border-[2px]", reportData.finalScore >= 80 ? "border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]" : reportData.finalScore >= 60 ? "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]")}>`);

// Coach signature
content = content.replace(/<span className="font-\['Brush_Script_MT',cursive\] text-2xl text-blue-900 opacity-80">Coach<\/span>/g, `<span className="font-['Brush_Script_MT',cursive] text-2xl text-blue-900 opacity-80">{settings?.academy?.headName || "Coach"}</span>`);

// Update Academy Name under signature
content = content.replace(/<p className="text-xs text-white\/70">Basketball Academy<\/p>/g, `<p className="text-xs text-white/70">{settings?.academy?.name || 'Basketball Academy'}</p>`);


fs.writeFileSync(file, content);
