declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export type ClassLevel = 'SD Lower' | 'SD Berkembang' | 'SD Upper' | 'SMP' | 'SMA';

export interface Student {
  id: string;
  studentId: string; // Nomor atlet
  jerseyNumber?: string;
  name: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: 'L' | 'P';
  address?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  classLevel: ClassLevel;
  joinDate: string;
  isActive: boolean;
  photoUrl?: string;
}

export interface Coach {
  id: string;
  coachId: string;
  name: string;
  phone: string;
  certification?: string;
  activeClasses: ClassLevel[];
  isActive: boolean;
  photoUrl?: string;
}

export interface DailyAssessment {
  id: string;
  date: string;
  coachId: string;
  studentId: string;
  classLevel: ClassLevel;
  scores: {
    technical: number;
    tactical: number;
    physical: number;
    mental: number;
    character: number;
  };
  notes?: string;
  target?: string;
}

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';

export interface Attendance {
  id: string;
  date: string;
  classLevel: ClassLevel;
  studentId: string;
  status: AttendanceStatus;
  reason?: string;
  notes?: string;
}

export interface PeriodEvaluation {
  id: string;
  period: string; // e.g. "Januari - Maret 2026"
  studentId: string;
  notes: {
    strengths: string;
    improvements: string;
    nextTarget: string;
    recommendation: string;
  };
}

export interface EvaluationPeriod {
  id: string;
  semester: string;
  month: string;
  year: string;
}

export interface ScheduleItem {
  id: string;
  class: string;
  days: string;
  time: string;
  location: string;
  color: string;
}

export interface Settings {
  weights: {
    technical: number;
    tactical: number;
    physical: number;
    mental: number;
    character: number;
  };
  period: string;
  academy: {
    name: string;
    subtitle?: string;
    logoUrl: string;
    headerBgUrl?: string;
    appBgUrl?: string;
    appBgVideoUrl?: string;
    headerRatio?: '4320x729' | '4320x1056' | '4320x2832';
    address: string;
    phone: string;
    headName: string;
  };
  periods: EvaluationPeriod[];
  activePeriodId: string;
  bgmUrl?: string;
  bgmList?: { id: string; name: string; url: string }[];
  clickSoundEnabled?: boolean;
  theme: "light" | "dark";
}
