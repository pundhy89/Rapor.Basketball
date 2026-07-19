import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import * as idb from 'idb-keyval';
import { Student, Coach, DailyAssessment, Attendance, PeriodEvaluation, Settings, ScheduleItem } from './types';

// Custom IDB storage for Zustand
const idbStorage: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await idb.get(name)) || null;
  },
  setItem: async (name, value): Promise<void> => {
    await idb.set(name, value);
  },
  removeItem: async (name): Promise<void> => {
    await idb.del(name);
  },
};

interface AppState {
  students: Student[];
  coaches: Coach[];
  assessments: DailyAssessment[];
  attendances: Attendance[];
  evaluations: PeriodEvaluation[];
  settings: Settings;
  schedules: ScheduleItem[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  addCoach: (coach: Coach) => void;
  updateCoach: (coach: Coach) => void;
  addAssessment: (assessment: DailyAssessment) => void;
  addAttendance: (attendance: Attendance) => void;
  addEvaluation: (evaluation: PeriodEvaluation) => void;
  updateSettings: (settings: Settings) => void;
  addSchedule: (schedule: ScheduleItem) => void;
  updateSchedule: (schedule: ScheduleItem) => void;
  deleteSchedule: (id: string) => void;
  injectSeedData: (data: { students: Student[], coaches: Coach[], assessments: DailyAssessment[], attendances: Attendance[], evaluations: PeriodEvaluation[], schedules?: ScheduleItem[] }) => void;
  resetData: () => void;
  setAllData: (data: any) => void;
}

const defaultSettings: Settings = {
  weights: {
    technical: 30,
    tactical: 20,
    physical: 20,
    mental: 15,
    character: 15,
  },
  period: 'Semester 1 2026',
  academy: {
    name: 'Dragons Basketball Academy',
    subtitle: '',
    logoUrl: '',
    headerBgUrl: '',
    appBgUrl: '',
    appBgVideoUrl: '',
    headerRatio: '4320x1056',
    address: '',
    phone: '',
    headName: '',
  },
  periods: [
    { id: '1', semester: '1', month: 'Januari - Juni', year: '2026' }
  ],
  activePeriodId: '1',
  bgmList: [],
  clickSoundEnabled: false,
  theme: 'light',
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      students: [],
      coaches: [],
      assessments: [],
      attendances: [],
      evaluations: [],
      settings: defaultSettings,
      schedules: [],
      addStudent: (student) =>
        set((state) => ({ students: [...state.students, student] })),
      updateStudent: (student) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === student.id ? student : s)),
        })),
      addCoach: (coach) =>
        set((state) => ({ coaches: [...state.coaches, coach] })),
      updateCoach: (coach) =>
        set((state) => ({
          coaches: state.coaches.map((c) => (c.id === coach.id ? coach : c)),
        })),
      addAssessment: (assessment) =>
        set((state) => ({ assessments: [...state.assessments, assessment] })),
      addAttendance: (attendance) =>
        set((state) => ({ attendances: [...state.attendances, attendance] })),
      addEvaluation: (evaluation) =>
        set((state) => ({ evaluations: [...state.evaluations, evaluation] })),
      updateSettings: (settings) => set({ settings }),
      addSchedule: (schedule) =>
          set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (schedule) =>
        set((state) => ({
          schedules: state.schedules.map((s) => (s.id === schedule.id ? schedule : s)),
        })),
      deleteSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),
      injectSeedData: (data) =>
        set(() => ({
          students: data.students,
          coaches: data.coaches,
          assessments: data.assessments,
          attendances: data.attendances,
          evaluations: data.evaluations,
          schedules: data.schedules || [],
        })),
      resetData: () =>
        set(() => ({
          students: [],
          coaches: [],
          assessments: [],
          attendances: [],
          evaluations: [],
          schedules: [],
        })),
      setAllData: (data) =>
        set((state) => ({
          students: data.students || [],
          coaches: data.coaches || [],
          assessments: data.assessments || [],
          attendances: data.attendances || [],
          evaluations: data.evaluations || [],
          schedules: data.schedules || [],
          settings: {
            ...(data.settings || defaultSettings),
            bgmList: state.settings?.bgmList || []
          },
        })),
    }),
    {
      name: 'academy-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);