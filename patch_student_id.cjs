const fs = require('fs');

let content = fs.readFileSync('src/components/Students.tsx', 'utf8');
content = content.replace(
  /const defaultId = `DA-\$\{currentYear\}-\$\{String\(nextNumber\)\.padStart\(3, '0'\)\}`;/,
  "const defaultId = `DBA-${String(nextNumber).padStart(3, '0')}`;"
);
content = content.replace(
  /placeholder="Contoh: DA-2026-001"/g,
  'placeholder="Contoh: DBA-001"'
);
fs.writeFileSync('src/components/Students.tsx', content);

let seed = fs.readFileSync('src/utils/seedData.ts', 'utf8');
seed = seed.replace(
  /studentId: `DA-2026-\$\{String\(i\+1\)\.padStart\(3, '0'\)\}`/g,
  "studentId: `DBA-${String(i+1).padStart(3, '0')}`"
);
fs.writeFileSync('src/utils/seedData.ts', seed);

