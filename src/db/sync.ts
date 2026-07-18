import { db } from './index.ts';
import { users, students, coaches, assessments, attendances, evaluations, schedules, settings } from './schema.ts';
import { eq } from 'drizzle-orm';
import { getOrCreateUser } from './users.ts';

export async function syncToDb(uid: string, email: string, data: any) {
  const user = await getOrCreateUser(uid, email);
  const userId = user.id;

  // We can use a transaction, but let's do simple sequential
  await db.transaction(async (tx) => {
    // Settings
    if (data.settings) {
      await tx.insert(settings)
        .values({ userId, data: data.settings })
        .onConflictDoUpdate({ target: settings.userId, set: { data: data.settings } });
    }

    // Replace arrays: for simplicity, delete all for the user and insert new
    // Students
    if (data.students) {
      await tx.delete(students).where(eq(students.userId, userId));
      if (data.students.length > 0) {
        await tx.insert(students).values(data.students.map((s: any) => ({
          id: s.id,
          userId,
          studentId: s.studentId,
          jerseyNumber: s.jerseyNumber,
          name: s.name,
          birthPlace: s.birthPlace,
          birthDate: s.birthDate,
          gender: s.gender,
          address: s.address,
          phone: s.phone,
          parentName: s.parentName,
          parentPhone: s.parentPhone,
          classLevel: s.classLevel,
          joinDate: s.joinDate,
          isActive: s.isActive,
          photoUrl: s.photoUrl,
        })));
      }
    }

    // Coaches
    if (data.coaches) {
      await tx.delete(coaches).where(eq(coaches.userId, userId));
      if (data.coaches.length > 0) {
        await tx.insert(coaches).values(data.coaches.map((c: any) => ({
          id: c.id,
          userId,
          coachId: c.coachId,
          name: c.name,
          phone: c.phone,
          certification: c.certification,
          activeClasses: c.activeClasses,
          isActive: c.isActive,
          photoUrl: c.photoUrl,
        })));
      }
    }

    // Assessments
    if (data.assessments) {
      await tx.delete(assessments).where(eq(assessments.userId, userId));
      if (data.assessments.length > 0) {
        await tx.insert(assessments).values(data.assessments.map((a: any) => ({
          id: a.id,
          userId,
          date: a.date,
          coachId: a.coachId,
          studentId: a.studentId,
          classLevel: a.classLevel,
          scores: a.scores,
          notes: a.notes,
          target: a.target,
        })));
      }
    }

    // Attendances
    if (data.attendances) {
      await tx.delete(attendances).where(eq(attendances.userId, userId));
      if (data.attendances.length > 0) {
        await tx.insert(attendances).values(data.attendances.map((a: any) => ({
          id: a.id,
          userId,
          date: a.date,
          classLevel: a.classLevel,
          studentId: a.studentId,
          status: a.status,
          reason: a.reason,
          notes: a.notes,
        })));
      }
    }

    // Evaluations
    if (data.evaluations) {
      await tx.delete(evaluations).where(eq(evaluations.userId, userId));
      if (data.evaluations.length > 0) {
        await tx.insert(evaluations).values(data.evaluations.map((e: any) => ({
          id: e.id,
          userId,
          period: e.period,
          studentId: e.studentId,
          notes: e.notes,
        })));
      }
    }

    // Schedules
    if (data.schedules) {
      await tx.delete(schedules).where(eq(schedules.userId, userId));
      if (data.schedules.length > 0) {
        await tx.insert(schedules).values(data.schedules.map((s: any) => ({
          id: s.id,
          userId,
          class: s.class,
          days: s.days,
          time: s.time,
          location: s.location,
          color: s.color,
        })));
      }
    }
  });
}

export async function fetchFromDb(uid: string, email: string) {
  const user = await getOrCreateUser(uid, email);
  const userId = user.id;

  const [
    userSettings,
    userStudents,
    userCoaches,
    userAssessments,
    userAttendances,
    userEvaluations,
    userSchedules
  ] = await Promise.all([
    db.select().from(settings).where(eq(settings.userId, userId)),
    db.select().from(students).where(eq(students.userId, userId)),
    db.select().from(coaches).where(eq(coaches.userId, userId)),
    db.select().from(assessments).where(eq(assessments.userId, userId)),
    db.select().from(attendances).where(eq(attendances.userId, userId)),
    db.select().from(evaluations).where(eq(evaluations.userId, userId)),
    db.select().from(schedules).where(eq(schedules.userId, userId)),
  ]);

  return {
    settings: userSettings.length > 0 ? userSettings[0].data : null,
    students: userStudents,
    coaches: userCoaches,
    assessments: userAssessments,
    attendances: userAttendances,
    evaluations: userEvaluations,
    schedules: userSchedules,
  };
}
