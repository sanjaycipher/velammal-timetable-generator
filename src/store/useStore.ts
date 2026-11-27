import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SchoolConfig {
  name: string;
  academicYear: string;
  workingDays: number;
  periodsPerDay: number;
}

export interface PeriodSlot {
  id: string;
  periodNumber: number;
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
  unavailablePeriods: string[]; // Format: "${dayIndex}-${periodId}" e.g. "0-p1"
}

export type PreferredSlot = 'any' | 'morning' | 'last';

export interface Subject {
  id: string;
  name: string;
  periodsPerWeekRequired: number;
  requiresDoublePeriod: boolean;
  preferredSlot?: PreferredSlot;
}

export interface SchoolClass {
  id: string;
  className: string;
  section: string;
  groups: string[];
}

export interface TimetableCell {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  isDoublePeriod?: boolean;
  isBreak?: boolean;
  breakLabel?: string;
}

/** 2D schedule per class: [dayIndex][periodSlotIndex] */
export type ClassTimetableGrid = (TimetableCell | null)[][];

/** Map of classId -> 2D schedule array */
export type TimetableResult = Record<string, ClassTimetableGrid>;

export interface TimetableStoreState {
  school: SchoolConfig;
  periods: PeriodSlot[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: SchoolClass[];
  timetableResult: TimetableResult | null;

  // Actions
  setSchool: (school: Partial<SchoolConfig>) => void;
  setPeriods: (periods: PeriodSlot[]) => void;
  addPeriod: (period: PeriodSlot) => void;
  updatePeriod: (id: string, updates: Partial<PeriodSlot>) => void;
  removePeriod: (id: string) => void;

  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;

  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  removeSubject: (id: string) => void;

  addClass: (schoolClass: SchoolClass) => void;
  updateClass: (id: string, updates: Partial<SchoolClass>) => void;
  removeClass: (id: string) => void;

  setTimetableResult: (result: TimetableResult | null) => void;
  resetStore: () => void;
}

const DEFAULT_SCHOOL: SchoolConfig = {
  name: 'New School',
  academicYear: '2026-27',
  workingDays: 6,
  periodsPerDay: 7,
};

const DEFAULT_PERIODS: PeriodSlot[] = [
  { id: 'p1', periodNumber: 1, label: 'Period 1', startTime: '08:30', endTime: '09:15', isBreak: false },
  { id: 'p2', periodNumber: 2, label: 'Period 2', startTime: '09:15', endTime: '10:00', isBreak: false },
  { id: 'b1', periodNumber: 0, label: 'Short Break', startTime: '10:00', endTime: '10:15', isBreak: true },
  { id: 'p3', periodNumber: 3, label: 'Period 3', startTime: '10:15', endTime: '11:00', isBreak: false },
  { id: 'p4', periodNumber: 4, label: 'Period 4', startTime: '11:00', endTime: '11:45', isBreak: false },
  { id: 'b2', periodNumber: 0, label: 'Lunch Break', startTime: '11:45', endTime: '12:25', isBreak: true },
  { id: 'p5', periodNumber: 5, label: 'Period 5', startTime: '12:25', endTime: '13:10', isBreak: false },
  { id: 'p6', periodNumber: 6, label: 'Period 6', startTime: '13:10', endTime: '13:55', isBreak: false },
  { id: 'p7', periodNumber: 7, label: 'Period 7', startTime: '13:55', endTime: '14:40', isBreak: false },
];

export const useStore = create<TimetableStoreState>()(
  persist(
    (set) => ({
      school: DEFAULT_SCHOOL,
      periods: DEFAULT_PERIODS,
      teachers: [],
      subjects: [],
      classes: [],
      timetableResult: null,

      setSchool: (updates) =>
        set((state) => ({ school: { ...state.school, ...updates } })),

      setPeriods: (periods) => set({ periods }),
      addPeriod: (period) =>
        set((state) => ({ periods: [...state.periods, period] })),
      updatePeriod: (id, updates) =>
        set((state) => ({
          periods: state.periods.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      removePeriod: (id) =>
        set((state) => ({
          periods: state.periods.filter((p) => p.id !== id),
        })),

      addTeacher: (teacher) =>
        set((state) => ({ teachers: [...state.teachers, teacher] })),
      updateTeacher: (id, updates) =>
        set((state) => ({
          teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      addSubject: (subject) =>
        set((state) => ({ subjects: [...state.subjects, subject] })),
      updateSubject: (id, updates) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      removeSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      addClass: (schoolClass) =>
        set((state) => ({ classes: [...state.classes, schoolClass] })),
      updateClass: (id, updates) =>
        set((state) => ({
          classes: state.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      removeClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),

      setTimetableResult: (result) => set({ timetableResult: result }),

      resetStore: () =>
        set({
          school: DEFAULT_SCHOOL,
          periods: DEFAULT_PERIODS,
          teachers: [],
          subjects: [],
          classes: [],
          timetableResult: null,
        }),
    }),
    {
      name: 'timetable-generator-storage',
    }
  )
);
