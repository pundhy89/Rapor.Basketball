import { ClassLevel, Student, Coach, DailyAssessment, Attendance, PeriodEvaluation } from '../types';

const NAMES = ["Andi Pratama", "Budi Santoso", "Citra Lestari", "Dewi Maharani", "Eko Prasetyo", "Fajar Nugroho", "Gita Gutawa", "Hadi Suwarno", "Intan Permatasari", "Joko Widodo", "Kevin Sanjaya", "Lestari Ayu", "Muhammad Ilham", "Nadia Vega", "Oscar Lawalata", "Putri Tanjung", "Qori Rizky", "Rafi Ahmad", "Siti Aminah", "Taufik Hidayat"];
const COACH_NAMES = ["Coach Yanto", "Coach Bima", "Coach Sarah", "Coach Daniel"];
const CLASSES: ClassLevel[] = ['SD Lower', 'SD Berkembang', 'SD Upper', 'SMP', 'SMA'];

export function generateSeedData(activePeriodId: string) {
  const students: Student[] = [];
  const coaches: Coach[] = [];
  const assessments: DailyAssessment[] = [];
  const attendances: Attendance[] = [];
  const evaluations: PeriodEvaluation[] = [];

  // 1. Create Coaches
  for (let i = 0; i < 4; i++) {
    coaches.push({
      id: `coach-${i}`,
      coachId: `C-00${i+1}`,
      name: COACH_NAMES[i],
      phone: `08123456789${i}`,
      certification: 'Lisensi Nasional',
      activeClasses: [CLASSES[i], CLASSES[i+1] || CLASSES[0]],
      isActive: true,
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${COACH_NAMES[i].replace(' ', '')}`
    });
  }

  // 2. Create Students and their logs
  for (let i = 0; i < 20; i++) {
    const studentId = `student-${i}`;
    const classLevel = CLASSES[i % CLASSES.length];
    
    students.push({
      id: studentId,
      studentId: `DBA-${String(i+1).padStart(3, '0')}`,
      jerseyNumber: String(Math.floor(Math.random() * 99) + 1),
      name: NAMES[i],
      classLevel: classLevel,
      joinDate: new Date().toISOString(),
      isActive: true,
    });

    // Generate 8 training sessions for each student
    for (let j = 0; j < 8; j++) {
      const date = new Date(Date.now() - (7 - j) * 3 * 24 * 60 * 60 * 1000).toISOString();
      
      // Attendance
      const randAtt = Math.random();
      const status = randAtt > 0.15 ? 'Hadir' : (randAtt > 0.05 ? 'Izin' : 'Sakit');
      attendances.push({
        id: crypto.randomUUID(),
        date,
        classLevel,
        studentId,
        status: status as any,
      });

      // Daily Assessment (Only if Present)
      if (status === 'Hadir') {
        assessments.push({
          id: crypto.randomUUID(),
          date,
          coachId: coaches[Math.floor(Math.random() * coaches.length)].id,
          studentId,
          classLevel,
          scores: {
            // Randomize scores 3 to 5 to simulate realistic data
            technical: Math.floor(Math.random() * 3) + 3,
            tactical: Math.floor(Math.random() * 3) + 3,
            physical: Math.floor(Math.random() * 3) + 3,
            mental: Math.floor(Math.random() * 3) + 3,
            character: Math.floor(Math.random() * 3) + 3,
          }
        });
      }
    }

    // Evaluation
    evaluations.push({
      id: crypto.randomUUID(),
      period: activePeriodId || '1',
      studentId,
      notes: {
        strengths: 'Memiliki fisik yang kuat dan pemahaman taktik yang baik di lapangan.',
        improvements: 'Perlu meningkatkan akurasi shooting dari luar area.',
        nextTarget: 'Fokus pada teknik dasar footwork dan ball handling.',
        recommendation: 'Latihan tambahan agility setelah sesi reguler.'
      }
    });
  }

  return { students, coaches, assessments, attendances, evaluations };
}
