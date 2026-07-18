import { DailyAssessment, Attendance, Settings } from '../types';

export function calculateStudentScore(studentId: string, assessments: DailyAssessment[], attendances: Attendance[], settings: Settings) {
  const studentAssessments = assessments.filter(a => a.studentId === studentId);
  const studentAttendances = attendances.filter(a => a.studentId === studentId);

  let tAvg = 0, tacAvg = 0, pAvg = 0, mAvg = 0, cAvg = 0;
  if (studentAssessments.length > 0) {
    tAvg = studentAssessments.reduce((sum, a) => sum + a.scores.technical, 0) / studentAssessments.length;
    tacAvg = studentAssessments.reduce((sum, a) => sum + a.scores.tactical, 0) / studentAssessments.length;
    pAvg = studentAssessments.reduce((sum, a) => sum + a.scores.physical, 0) / studentAssessments.length;
    mAvg = studentAssessments.reduce((sum, a) => sum + a.scores.mental, 0) / studentAssessments.length;
    cAvg = studentAssessments.reduce((sum, a) => sum + a.scores.character, 0) / studentAssessments.length;
  }

  // Convert to 0-100 scale (average * 20)
  const tVal = tAvg * 20;
  const tacVal = tacAvg * 20;
  const pVal = pAvg * 20;
  const mVal = mAvg * 20;
  const cVal = cAvg * 20;

  // Apply weights
  const w = settings.weights;
  const pilarScore = 
    (tVal * (w.technical / 100)) +
    (tacVal * (w.tactical / 100)) +
    (pVal * (w.physical / 100)) +
    (mVal * (w.mental / 100)) +
    (cVal * (w.character / 100));

  // Calculate Attendance
  let attScore = 0;
  let counts = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
  if (studentAttendances.length > 0) {
    let totalPoints = 0;
    studentAttendances.forEach(a => {
      if (a.status === 'Hadir') { totalPoints += 100; counts.hadir++; }
      else if (a.status === 'Izin') { totalPoints += 80; counts.izin++; }
      else if (a.status === 'Sakit') { totalPoints += 80; counts.sakit++; }
      else if (a.status === 'Alpha') { totalPoints += 0; counts.alpha++; }
    });
    attScore = totalPoints / studentAttendances.length;
  }

  // Final Score
  const finalScore = (pilarScore * 0.9) + (attScore * 0.1);
  
  let predikat = 'Needs Special Attention';
  if (finalScore >= 90) predikat = 'Excellent';
  else if (finalScore >= 80) predikat = 'Good';
  else if (finalScore >= 70) predikat = 'Developing';
  else if (finalScore >= 60) predikat = 'Need Improvement';

  return {
    tVal, tacVal, pVal, mVal, cVal,
    pilarScore, attScore, finalScore, predikat, counts,
    totalMeetings: studentAssessments.length
  };
}
