const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Report.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update Coach Signature
const oldCoach = /<span className="font-\['Brush_Script_MT',cursive\] text-2xl text-blue-900 opacity-80">\{settings\?\.academy\?\.headName \|\| "Coach"\}<\/span>/g;
const newCoach = `<span className="font-['Brush_Script_MT',cursive] text-xl text-orange-400 drop-shadow-[0_0_8px_#fb923c] whitespace-nowrap leading-none mb-1">{settings?.academy?.headName || "Coach"}</span>`;
content = content.replace(oldCoach, newCoach);

// 2. Update ScoreRow to accept colors
const oldScoreRowDef = /function ScoreRow\(\{ label, score, weight \}: \{ label: string, score: number, weight: number \}\) \{/g;
const newScoreRowDef = `function ScoreRow({ label, score, weight, colorClass }: { label: string, score: number, weight: number, colorClass?: string }) {`;
content = content.replace(oldScoreRowDef, newScoreRowDef);

const oldScoreRowBar = /<div className="h-full bg-slate-700 dark:bg-slate-300 text-white text-white shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.4\),0_8px_32px_0_rgba\(31,38,135,0\.07\)\] dark:shadow-\[inset_0_1px_1px_rgba\(255,255,255,0\.1\),0_8px_32px_0_rgba\(0,0,0,0\.2\)\] dark:bg-blue-400" style=\{\{ width: \`\$\{score\}%\` \}\} \/>/g;
const newScoreRowBar = `<div className={cn("h-full", colorClass || "bg-slate-700 dark:bg-slate-300")} style={{ width: \`\${score}%\` }} />`;
content = content.replace(oldScoreRowBar, newScoreRowBar);

// Now update ScoreRow usages
const tVal = /<ScoreRow label="Technical Skill" score=\{reportData\.tVal\} weight=\{settings\.weights\.technical\} \/>/g;
content = content.replace(tVal, `<ScoreRow label="Technical Skill" score={reportData.tVal} weight={settings.weights.technical} colorClass="bg-blue-400 shadow-[0_0_8px_#60a5fa]" />`);

const tacVal = /<ScoreRow label="Tactical Understanding" score=\{reportData\.tacVal\} weight=\{settings\.weights\.tactical\} \/>/g;
content = content.replace(tacVal, `<ScoreRow label="Tactical Understanding" score={reportData.tacVal} weight={settings.weights.tactical} colorClass="bg-emerald-400 shadow-[0_0_8px_#34d399]" />`);

const pVal = /<ScoreRow label="Physical Development" score=\{reportData\.pVal\} weight=\{settings\.weights\.physical\} \/>/g;
content = content.replace(pVal, `<ScoreRow label="Physical Development" score={reportData.pVal} weight={settings.weights.physical} colorClass="bg-amber-400 shadow-[0_0_8px_#fbbf24]" />`);

const mVal = /<ScoreRow label="Mental Development" score=\{reportData\.mVal\} weight=\{settings\.weights\.mental\} \/>/g;
content = content.replace(mVal, `<ScoreRow label="Mental Development" score={reportData.mVal} weight={settings.weights.mental} colorClass="bg-fuchsia-400 shadow-[0_0_8px_#e879f9]" />`);

const cVal = /<ScoreRow label="Character & Teamwork" score=\{reportData\.cVal\} weight=\{settings\.weights\.character\} \/>/g;
content = content.replace(cVal, `<ScoreRow label="Character & Teamwork" score={reportData.cVal} weight={settings.weights.character} colorClass="bg-rose-400 shadow-[0_0_8px_#fb7185]" />`);

fs.writeFileSync(file, content);
