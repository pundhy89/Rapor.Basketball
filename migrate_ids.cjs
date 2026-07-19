const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const migrationHook = `
  const students = useStore(state => state.students);
  const updateStudent = useStore(state => state.updateStudent);
  
  useEffect(() => {
    students.forEach(s => {
      if (s.studentId && s.studentId.startsWith('DA-2026-')) {
        updateStudent(s.id, { ...s, studentId: s.studentId.replace('DA-2026-', 'DBA-') });
      }
    });
  }, [students, updateStudent]);
`;

if (!content.includes('DA-2026-')) {
  content = content.replace('const updateSettings = useStore(state => state.updateSettings);', 'const updateSettings = useStore(state => state.updateSettings);\n' + migrationHook);
  fs.writeFileSync('src/components/Layout.tsx', content);
}
