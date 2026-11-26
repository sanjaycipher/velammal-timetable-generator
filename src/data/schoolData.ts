export interface IndexItem {
  id: number;
  sno: string;
  particulars: string;
  subItems?: string[];
}

export interface Guideline {
  id: number;
  rule: string;
  remarks: string;
}

export interface PeriodSlot {
  id: string;
  label: string;
  time: string;
  isTeachingPeriod: boolean;
  periodNumber?: number;
}

export interface SubjectPeriodAllocation {
  id: number;
  subject: string;
  ixHours: string;
  xHours: string;
}

export interface TeacherAllotment {
  id: number;
  name: string;
  subject: string;
  classes: string[];
  totalPeriods: number;
  secondaryPeriods: number;
  classTeacherOf?: string;
  allotmentNote: string;
  perClassPeriods: Record<string, number>;
}

export interface ClassTimetableRowIX {
  day: string;
  zero: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  coaching: string;
}

export interface ClassTimetableRowX {
  day: string;
  zero: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  coaching: string;
}

export interface ClassTimetableSheetIX {
  className: string;
  classTeacher: string;
  rows: ClassTimetableRowIX[];
}

export interface ClassTimetableSheetX {
  className: string;
  classTeacher: string;
  rows: ClassTimetableRowX[];
}

export interface TeacherScheduleRow {
  day: string;
  zero: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  freePeriods: string;
}

export interface TeacherTimetableSheet {
  id: number;
  name: string;
  subjectInfo: string;
  rows: TeacherScheduleRow[];
}

export interface LabScheduleRow {
  day: string;
  zero: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
}

export interface LabTimetableSheet {
  id: number;
  labName: string;
  teacherName: string;
  rows: LabScheduleRow[];
}

export interface DrtScheduleRow {
  sno: number;
  day: string;
  xa: string;
  xb: string;
  xc: string;
  ixa: string;
  ixb: string;
  ixc: string;
}

export interface CoachingClassRow {
  sno: number;
  day: string;
  gradeX: string;
  gradeIX: string;
}

export interface TeacherFreeTimeRow {
  id: number;
  sno: string;
  name: string;
  subject: string;
  classesHandling: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

export const DAYS: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const classes: string[] = ['IX A', 'IX B', 'IX C', 'X A', 'X B', 'X C'];

export const indexItems: IndexItem[] = [
  { id: 1, sno: '1', particulars: 'TIME TABLE GUIDELINES' },
  { id: 2, sno: '2', particulars: 'PERIOD ALLOTMENT/TIMESLOT' },
  { id: 3, sno: '3', particulars: 'TEACHERS ALLOTMENT' },
  {
    id: 4,
    sno: '4',
    particulars: 'CLASS TIMETABLE',
    subItems: ['9A', '9B', '9C', '10A', '10B', '10C'],
  },
  { id: 5, sno: '5', particulars: 'TEACHERS TIMETABLE' },
  { id: 6, sno: '6', particulars: 'LAB TIMETABLE' },
  { id: 7, sno: '7', particulars: 'SINGLE SHEET TIME TABLE' },
  { id: 8, sno: '7', particulars: 'DRT SCHEDULE' },
  { id: 9, sno: '8', particulars: 'COACHING CLASS' },
  { id: 10, sno: '9', particulars: 'FREE TIMETABLE' },
];

export const guidelines: Guideline[] = [
  { id: 1, rule: 'All teachers are to be appropriately allotted classes.', remarks: 'FOLLOWED' },
  {
    id: 2,
    rule: 'Teachers handling classes from the Primary to Senior Secondary level are to be allotted a minimum of 28 periods.',
    remarks: 'FOLLOWED',
  },
  { id: 3, rule: 'All teachers handling Primary classes are to be allotted four sections.', remarks: 'NA' },
  {
    id: 4,
    rule: 'Secondary Level – Section Allotment: English, Tamil, Hindi – 4 sections; Mathematics – 3 sections; Physics, Chemistry, Biology, History, Geography – 5 sections; Other subjects – 3 sections.',
    remarks: 'FOLLOWED',
  },
  { id: 5, rule: 'One Physical Education Teacher (PET) is to be allotted for every 500 students.', remarks: 'FOLLOWED' },
  { id: 6, rule: 'Senior In-charges are to be allotted one section.', remarks: 'FOLLOWED' },
  {
    id: 7,
    rule: 'Vice-Principals and Headmasters are also allotted one section, subject to change from one to two sections, if required.',
    remarks: 'FOLLOWED',
  },
  { id: 8, rule: 'Assistant Headmasters are to be allotted two sections.', remarks: 'NA' },
  { id: 9, rule: 'Controller of Examinations (COEs) are to handle three sections.', remarks: 'NA' },
  {
    id: 10,
    rule: 'In cases where the division of sections based on workload results in a fraction (e.g., 0.25), suitable adjustments may be made.',
    remarks: 'FOLLOWED',
  },
  { id: 11, rule: 'Small schools to go with Part time ECA teachers.', remarks: 'NA' },
  { id: 12, rule: 'Substitute teachers are appointed based on the overall workload of the teachers.', remarks: 'NA' },
  { id: 13, rule: 'Tentative section allotment needs to be done and workout the exact workload.', remarks: 'FOLLOWED' },
  { id: 14, rule: 'Follow last year period allotment to freeze the number of periods.', remarks: 'FOLLOWED' },
  { id: 15, rule: 'There is no special teacher for Library Classes, Club, Hand writing and Uniformed Services.', remarks: 'NA' },
  {
    id: 16,
    rule: 'Schools with Foundation must deduct section count based on the number of IIT sections and fix the teachers for Math, Physics and Chemistry.',
    remarks: 'NA',
  },
  { id: 17, rule: 'Check Biology.', remarks: 'NA' },
];

export const periods: PeriodSlot[] = [
  { id: 'P0', label: 'PERIOD 0 ( DRT )', time: '8.30 AM - 9.00 AM', isTeachingPeriod: false },
  { id: 'P1', label: 'PERIOD 1', time: '9.00 AM - 10.00 AM', isTeachingPeriod: true, periodNumber: 1 },
  { id: 'P2', label: 'PERIOD 2', time: '10.00 AM - 11.00 AM', isTeachingPeriod: true, periodNumber: 2 },
  { id: 'BREAK_1', label: 'BREAK', time: '11.00 AM - 11.15 AM', isTeachingPeriod: false },
  { id: 'P3', label: 'PERIOD 3', time: '11.15 AM - 12.15 PM', isTeachingPeriod: true, periodNumber: 3 },
  { id: 'P4', label: 'PERIOD 4', time: '12.15 PM - 1.15 PM', isTeachingPeriod: true, periodNumber: 4 },
  { id: 'LUNCH', label: 'LUNCH', time: '1.15 PM - 1.45 PM', isTeachingPeriod: false },
  { id: 'P5', label: 'PERIOD 5', time: '1.45 PM - 2.45 PM', isTeachingPeriod: true, periodNumber: 5 },
  { id: 'P6', label: 'PERIOD 6', time: '2.45 PM - 3.45 PM', isTeachingPeriod: true, periodNumber: 6 },
  { id: 'BREAK_2', label: 'BREAK COME DIARY SIGNING', time: '3.45 PM - 4.00 PM', isTeachingPeriod: false },
  { id: 'P7', label: 'PERIOD 7', time: '4.00 PM - 4.45 PM', isTeachingPeriod: true, periodNumber: 7 },
  { id: 'COACHING', label: 'COACHING CLASS', time: '4.45 PM - 5.45 PM', isTeachingPeriod: false },
];

export const subjectPeriodAllocation: SubjectPeriodAllocation[] = [
  { id: 1, subject: 'ENGLISH', ixHours: '4', xHours: '5' },
  { id: 2, subject: 'II LANGUAGE', ixHours: '4', xHours: '5' },
  { id: 3, subject: 'MATHS', ixHours: '6', xHours: '6' },
  { id: 4, subject: 'MATHS LAB', ixHours: '1', xHours: '1' },
  { id: 5, subject: 'PHYSICS', ixHours: '3', xHours: '4' },
  { id: 6, subject: 'CHEMISTRY', ixHours: '3', xHours: '4' },
  { id: 7, subject: 'BIOLOGY', ixHours: '3', xHours: '3' },
  { id: 8, subject: 'PHYSICS LAB', ixHours: '1', xHours: '1' },
  { id: 9, subject: 'CHEMISTRY LAB', ixHours: '-', xHours: '1' },
  { id: 10, subject: 'BIOLOGY LAB', ixHours: '-', xHours: '1' },
  { id: 11, subject: 'HISTORY', ixHours: '3', xHours: '4' },
  { id: 12, subject: 'GEOGRAPHY', ixHours: '3', xHours: '4' },
  { id: 13, subject: 'AI', ixHours: '1', xHours: '2' },
  { id: 14, subject: 'AI LAB', ixHours: '1', xHours: '-' },
  { id: 15, subject: 'PET', ixHours: '1', xHours: '1' },
  { id: 16, subject: 'R3 ( III LANGUAGE)', ixHours: '1', xHours: '-' },
  { id: 17, subject: 'KOUSHAL VIKASH', ixHours: '1', xHours: '-' },
  { id: 18, subject: 'TOTAL', ixHours: '34', xHours: '42' },
];

export const teachers: TeacherAllotment[] = [
  {
    id: 1,
    name: 'MS SUBASHINI - PRINCIPAL',
    subject: 'ENGLISH',
    classes: ['X A'],
    totalPeriods: 5,
    secondaryPeriods: 5,
    allotmentNote: 'X A - 5',
    perClassPeriods: { 'X A': 5 },
  },
  {
    id: 2,
    name: 'MS. JEEVITHA - AHM',
    subject: 'ENGLISH',
    classes: ['X C'],
    totalPeriods: 5,
    secondaryPeriods: 5,
    allotmentNote: 'X C - 5',
    perClassPeriods: { 'X C': 5 },
  },
  {
    id: 3,
    name: 'MS.YUVASHREE',
    subject: 'ENGLISH',
    classes: ['IX A', 'IX B', 'IX C', 'X B'],
    totalPeriods: 17,
    secondaryPeriods: 17,
    classTeacherOf: 'X B',
    allotmentNote: 'IX A, B, C - 4+4+4; X B - 5',
    perClassPeriods: { 'IX A': 4, 'IX B': 4, 'IX C': 4, 'X B': 5 },
  },
  {
    id: 4,
    name: 'MR.VELMURUGAN',
    subject: 'TAMIL',
    classes: ['IX A', 'X B', 'X C'],
    totalPeriods: 14,
    secondaryPeriods: 14,
    allotmentNote: 'IX A - 4; X B, C - 5+5',
    perClassPeriods: { 'IX A': 4, 'X B': 5, 'X C': 5 },
  },
  {
    id: 5,
    name: 'MS UMA SHANKARI',
    subject: 'TAMIL',
    classes: ['IX A', 'IX B', 'IX C', 'X A'],
    totalPeriods: 14,
    secondaryPeriods: 14,
    allotmentNote: 'IX B, C - 4+4; R3 (IX A) - 1; X A - 5',
    perClassPeriods: { 'IX A': 1, 'IX B': 4, 'IX C': 4, 'X A': 5 },
  },
  {
    id: 6,
    name: 'MS.HEMA SUBRAMANI',
    subject: 'HINDI',
    classes: ['IX A', 'IX B', 'IX C', 'X A'],
    totalPeriods: 12,
    secondaryPeriods: 12,
    allotmentNote: 'IX A - 4; R3 (IX A,B,C) - 1+1+1; X A - 5',
    perClassPeriods: { 'IX A': 5, 'IX B': 1, 'IX C': 1, 'X A': 5 },
  },
  {
    id: 7,
    name: 'MS.PALANI GOMATHI',
    subject: 'MATHS',
    classes: ['IX C', 'X B', 'XI B'],
    totalPeriods: 23,
    secondaryPeriods: 14,
    classTeacherOf: 'IX C',
    allotmentNote: 'IX C - 7; X B - 7; XI B - 9',
    perClassPeriods: { 'IX C': 7, 'X B': 7 },
  },
  {
    id: 8,
    name: 'MS.MUTHULAKSHMI (LINK FROM MIDDLE)',
    subject: 'MATHS',
    classes: ['IX A'],
    totalPeriods: 7,
    secondaryPeriods: 7,
    allotmentNote: 'IX A - 7',
    perClassPeriods: { 'IX A': 7 },
  },
  {
    id: 9,
    name: 'MR.GAJENDIRAN',
    subject: 'MATHS',
    classes: ['IX B', 'X A', 'X C'],
    totalPeriods: 21,
    secondaryPeriods: 21,
    classTeacherOf: 'X C',
    allotmentNote: 'IX B - 7; X A, C - 7+7',
    perClassPeriods: { 'IX B': 7, 'X A': 7, 'X C': 7 },
  },
  {
    id: 10,
    name: 'MR.JOHN',
    subject: 'PHYSICS',
    classes: ['X A', 'X B', 'X C', 'XI B'],
    totalPeriods: 22,
    secondaryPeriods: 15,
    allotmentNote: 'X A,B,C - 5+5+5; XI B - 7',
    perClassPeriods: { 'X A': 5, 'X B': 5, 'X C': 5 },
  },
  {
    id: 11,
    name: 'MS.SATHYA',
    subject: 'PHYSICS & CHEMISTRY',
    classes: ['IX B', 'IX C', 'X C', 'XI B'],
    totalPeriods: 20,
    secondaryPeriods: 13,
    allotmentNote: 'PHY - IX B,C - 8; CHEM - X C - 5; XI B(CHEM) - 7',
    perClassPeriods: { 'IX B': 4, 'IX C': 4, 'X C': 5 },
  },
  {
    id: 12,
    name: 'MR.JESUDAS',
    subject: 'CHEMISTRY',
    classes: ['IX A', 'IX B', 'IX C', 'X A', 'X B'],
    totalPeriods: 22,
    secondaryPeriods: 22,
    allotmentNote: 'IX A, B, C - 4+4+4; X A, B - 5+5',
    perClassPeriods: { 'IX A': 4, 'IX B': 4, 'IX C': 4, 'X A': 5, 'X B': 5 },
  },
  {
    id: 13,
    name: 'MS.DHILSHATH BANU',
    subject: 'BIOLOGY',
    classes: ['X A', 'X B', 'X C', 'XI'],
    totalPeriods: 18,
    secondaryPeriods: 12,
    allotmentNote: 'X A,B,C - 4+4+4; XI - 6',
    perClassPeriods: { 'X A': 4, 'X B': 4, 'X C': 4 },
  },
  {
    id: 14,
    name: 'MR ALLWIN',
    subject: 'PHYSICS, BIOLOGY',
    classes: ['IX A', 'IX B', 'IX C'],
    totalPeriods: 16,
    secondaryPeriods: 16,
    allotmentNote: 'PHY - IX A - 4; BIO IX A, B, C - 4+4+4',
    perClassPeriods: { 'IX A': 8, 'IX B': 4, 'IX C': 4 },
  },
  {
    id: 15,
    name: 'MS.JEYASHREE',
    subject: 'HISTORY',
    classes: ['IX A', 'IX C', 'X A', 'X B', 'X C'],
    totalPeriods: 21,
    secondaryPeriods: 21,
    classTeacherOf: 'IX A',
    allotmentNote: 'IX A - 6 (H & G); IX C - 3 (HIS); X A, B, C - 4+4+4 (HIS)',
    perClassPeriods: { 'IX A': 6, 'IX C': 3, 'X A': 4, 'X B': 4, 'X C': 4 },
  },
  {
    id: 16,
    name: 'MS.ELAYALAKSHMI',
    subject: 'GEOGRAPHY',
    classes: ['IX B', 'IX C', 'X A', 'X B', 'X C'],
    totalPeriods: 21,
    secondaryPeriods: 21,
    classTeacherOf: 'X A',
    allotmentNote: 'IX B - 6 (H & G); IX C - 3 (GEO); X A, B, C - 4+4+4 (GEO)',
    perClassPeriods: { 'IX B': 6, 'IX C': 3, 'X A': 4, 'X B': 4, 'X C': 4 },
  },
  {
    id: 17,
    name: 'MS.NAGALAKSHMI',
    subject: 'ARTIFICIAL INTELLIGENCE',
    classes: ['IX A', 'IX B', 'IX C', 'X A', 'X B', 'X C'],
    totalPeriods: 12,
    secondaryPeriods: 12,
    classTeacherOf: 'IX B',
    allotmentNote: 'IX A, B, C - 2+2+2; X A, B, C - 2+2+2',
    perClassPeriods: { 'IX A': 2, 'IX B': 2, 'IX C': 2, 'X A': 2, 'X B': 2, 'X C': 2 },
  },
  {
    id: 18,
    name: 'MR KARTHIKEYAN',
    subject: 'PET',
    classes: ['IX A', 'IX B', 'IX C', 'X A', 'X B', 'X C'],
    totalPeriods: 6,
    secondaryPeriods: 6,
    allotmentNote: 'IX A, B, C - 1+1+1; X A, B, C - 1+1+1',
    perClassPeriods: { 'IX A': 1, 'IX B': 1, 'IX C': 1, 'X A': 1, 'X B': 1, 'X C': 1 },
  },
];

// Sheet 4a: Raw Class Timetables for IX A, IX B, IX C
export const secClassTimeIX: ClassTimetableSheetIX[] = [
  {
    className: 'IX A',
    classTeacher: 'MS JAYASHREE',
    rows: [
      {
        day: 'MONDAY',
        zero: 'Maths - Ms.Sathya',
        p1: 'HISTORY - MS JAYASHREE',
        p2: 'MATHS - MS MUTHULAKSHMI',
        p3: 'II LANGUAGE - MR VELMURUGAN / MS HEMA',
        p4: 'PHYSICS - MR ALLWIN',
        p5: 'ENGLISH - MS.YUVASHREE',
        p6: 'BIOLOGY - MR ALLWIN',
        coaching: 'SCIENCE (MR ALLWIN / MR JESUDAS)',
      },
      {
        day: 'TUESDAY',
        zero: 'Science - Ms.Jayashree',
        p1: 'GEOGRAPHY - MS JAYASHREE',
        p2: 'MATHS - MS MUTHULAKSHMI',
        p3: 'II LANGUAGE - MR VELMURUGAN / MS HEMA',
        p4: 'CHEMISTRY - MR JESUDAS',
        p5: 'ENGLISH - MS.YUVASHREE',
        p6: 'GEOGRAPHY - MS JAYASHREE',
        coaching: 'II LANGUAGE - MR VELMURUGAN / MS UMA / MS HEMA',
      },
      {
        day: 'WEDNESDAY',
        zero: 'II Language - Ms.Hema / Mr. Velmurugan',
        p1: 'II LANGUAGE - MR VELMURUGAN / MS HEMA',
        p2: 'MATHS - MS MUTHULAKSHMI',
        p3: 'HISTORY - MS JAYASHREE',
        p4: 'BIOLOGY - MR ALLWIN',
        p5: 'PHYSICS - MR ALLWIN',
        p6: 'SCIENCE LAB - MR ALLWIN / MR JESUDAS',
        coaching: 'ENGLISH - MS.YUVASHREE',
      },
      {
        day: 'THURSDAY',
        zero: 'AI - Ms.Nagalakshmi',
        p1: 'AI - MS.NAGA',
        p2: 'MATHS - MS MUTHULAKSHMI',
        p3: 'AI LAB - MS NAGALAKSHMI',
        p4: 'HISTORY - MS JAYASHREE',
        p5: 'III LANGUAGE - MS UMA / MS HEMA',
        p6: 'ENGLISH - MS.YUVASHREE',
        coaching: 'AI - MS.NAGALAKSHMI',
      },
      {
        day: 'FRIDAY',
        zero: 'English - Ms.Hema',
        p1: 'ENGLISH - MS.YUVASHREE',
        p2: 'CHEMISTRY - MR JESUDAS',
        p3: 'II LANGUAGE - MR VELMURUGAN / MS HEMA',
        p4: 'GEOGRAPHY - MS JAYASHREE',
        p5: 'MATHS - MS MUTHULAKSHMI',
        p6: 'PHYSICS - MR ALLWIN',
        coaching: 'MATHS - MR.GAJENDIRAN / MS.PALANI GOMATHI / MS MUTHULAKSHMI',
      },
      {
        day: 'SATURDAY',
        zero: 'SOCIAL - Ms. Jayashree',
        p1: 'BIOLOGY - MR ALLWIN',
        p2: 'KAUSHAL VIKHAS - MR ALLWIN',
        p3: 'PET - MR KARTHIKEYAN',
        p4: 'MATHS LAB - MS MUTHULAKSHMI',
        p5: 'MATHS - MS MUTHULAKSHMI',
        p6: 'CHEMISTRY - MR JESUDAS',
        coaching: 'SOCIAL - MS JAYASHREE / MS ELAYALAKSHMI',
      },
    ],
  },
  {
    className: 'IX B',
    classTeacher: 'MS NAGALAKSHMI',
    rows: [
      {
        day: 'MONDAY',
        zero: 'Maths - Mr.Gajendiran',
        p1: 'BIOLOGY - MR ALLWIN',
        p2: 'PHYSICS - MS SATHYA',
        p3: 'MATHS - MR.GAJENDIRAN',
        p4: 'III LANGUAGE - MS UMA / MS HEMA',
        p5: 'GEOGRAPHY - MS ELAYALAKSHMI',
        p6: 'ENGLISH - MS.YUVASHREE',
        coaching: 'SCIENCE (MS SATHYA / MR JESUDAS)',
      },
      {
        day: 'TUESDAY',
        zero: 'Science - Mr Jesudas',
        p1: 'CHEMISTRY - MR JESUDAS',
        p2: 'MATHS - MR.GAJENDIRAN',
        p3: 'GEOGRAPHY - MS ELAYALAKSHMI',
        p4: 'AI - MS.NAGALAKSHMI',
        p5: 'II LANGUAGE - MS UMA',
        p6: 'HISTORY - MS ELAYALAKSHMI',
        coaching: 'II LANGUAGE - MR VELMURUGAN / MS UMA / MS HEMA',
      },
      {
        day: 'WEDNESDAY',
        zero: 'II Language - Ms.Uma',
        p1: 'ENGLISH - MS.YUVASHREE',
        p2: 'CHEMISTRY - MR JESUDAS',
        p3: 'BIOLOGY - MR ALLWIN',
        p4: 'MATHS - MR.GAJENDIRAN',
        p5: 'MATHS LAB - MR.GAJENDIRAN',
        p6: 'II LANGUAGE - MS UMA',
        coaching: 'ENGLISH - MS.YUVASHREE',
      },
      {
        day: 'THURSDAY',
        zero: 'AI - Mr.Velmurugan',
        p1: 'II LANGUAGE - MS UMA',
        p2: 'CHEMISTRY - MR JESUDAS',
        p3: 'GEOGRAPHY - MS ELAYALAKSHMI',
        p4: 'ENGLISH - MS.YUVASHREE',
        p5: 'MATHS - MR.GAJENDIRAN',
        p6: 'SCIENCE LAB - MS SATHYA / MR JESUDAS / MR ALLWIN',
        coaching: 'AI - MS.NAGALAKSHMI',
      },
      {
        day: 'FRIDAY',
        zero: 'English - Ms. Uma',
        p1: 'MATHS - MR.GAJENDIRAN',
        p2: 'II LANGUAGE - MS UMA',
        p3: 'KAUSHAL VIKHAS - MR ALLWIN',
        p4: 'BIOLOGY - MR ALLWIN',
        p5: 'HISTORY - MS ELAYALAKSHMI',
        p6: 'PHYSICS - MS SATHYA',
        coaching: 'MATHS - MR.GAJENDIRAN / MS.PALANI GOMATHI / MS MUTHULAKSHMI',
      },
      {
        day: 'SATURDAY',
        zero: 'Social - Ms. Elayalakshmi',
        p1: 'MATHS - MR.GAJENDIRAN',
        p2: 'HISTORY - MS ELAYALAKSHMI',
        p3: 'ENGLISH - MS.YUVASHREE',
        p4: 'PET - MR KARTHIKEYAN',
        p5: 'PHYSICS - MS SATHYA',
        p6: 'AI LAB - MS NAGALAKSHMI',
        coaching: 'SOCIAL - MS JAYASHREE / MS ELAYALAKSHMI',
      },
    ],
  },
  {
    className: 'IX C',
    classTeacher: 'MS PALANI GOMATHI',
    rows: [
      {
        day: 'MONDAY',
        zero: 'Maths - Ms Palani',
        p1: 'CHEMISTRY - MR JESUDAS',
        p2: 'BIOLOGY - MR ALLWIN',
        p3: 'MATHS - MS PALANI GOMATHI',
        p4: 'ENGLISH - MS YUVASHREE',
        p5: 'SCIENCE LAB - MS SATHYA / MR JESUDAS / MR ALLWIN',
        p6: 'MATHS - MS PALANI GOMATHI',
        coaching: 'SCIENCE (MS SATHYA / MR JESUDAS)',
      },
      {
        day: 'TUESDAY',
        zero: 'Science - Ms. Sathya',
        p1: 'II LANGUAGE - MS UMA',
        p2: 'HISTORY - MS JAYASHREE',
        p3: 'MATHS - MS PALANI GOMATHI',
        p4: 'ENGLISH - MS YUVASHREE',
        p5: 'PHYSICS - MS SATHYA',
        p6: 'CHEMISTRY - MR JESUDAS',
        coaching: 'II LANGUAGE - MR VELMURUGAN / MS UMA / MS HEMA',
      },
      {
        day: 'WEDNESDAY',
        zero: 'II Language - Ms.Nagalakshmi',
        p1: 'HISTORY - MS JAYASHREE',
        p2: 'GEOGRAPHY - MS ELAYALAKSMI',
        p3: 'AI LAB - MS NAGALAKSHMI',
        p4: 'MATHS LAB - MS PALANI GOMATHI',
        p5: 'PHYSICS - MS SATHYA',
        p6: 'III LANGUAGE - MS UMA / MS HEMA',
        coaching: 'ENGLISH - MS.YUVASHREE',
      },
      {
        day: 'THURSDAY',
        zero: 'AI - Mr Allwin',
        p1: 'MATHS - MS PALANI GOMATHI',
        p2: 'GEOGRAPHY - MS ELAYALAKSMI',
        p3: 'BIOLOGY - MR ALLWIN',
        p4: 'PHYSICS - MS SATHYA',
        p5: 'GEOGRAPHY - MS ELAYALAKSMI',
        p6: 'II LANGUAGE - MS UMA',
        coaching: 'AI - MS.NAGALAKSHMI',
      },
      {
        day: 'FRIDAY',
        zero: 'English - Ms. Yuvashree',
        p1: 'HISTORY - MS JAYASHREE',
        p2: 'ENGLISH - MS YUVASHREE',
        p3: 'MATHS - MS PALANI GOMATHI',
        p4: 'II LANGUAGE - MS UMA',
        p5: 'KAUSHAL VIKHAS - MR ALLWIN',
        p6: 'AI - MS.NAGALAKSHMI',
        coaching: 'MATHS - MR.GAJENDIRAN / MS.PALANI GOMATHI / MS MUTHULAKSHMI',
      },
      {
        day: 'SATURDAY',
        zero: 'Social - Ms.Uma',
        p1: 'ENGLISH - MS YUVASHREE',
        p2: 'PET - MR KARTHIKEYAN',
        p3: 'BIOLOGY - MR ALLWIN',
        p4: 'CHEMISTRY - MR JESUDAS',
        p5: 'II LANGUAGE - MS UMA',
        p6: 'MATHS - MS PALANI GOMATHI',
        coaching: 'SOCIAL - MS JAYASHREE / MS ELAYALAKSHMI',
      },
    ],
  },
];

// Sheet 4b: Raw Class Timetables for X A, X B, X C
export const secClassTimeX: ClassTimetableSheetX[] = [
  {
    className: 'X A',
    classTeacher: 'MS.ELAYALAKSHMI',
    rows: [
      {
        day: 'MONDAY',
        zero: 'PHYSICS - Ms.Elayalakshmi',
        p1: 'II LANGUAGE - MS UMA / MS.HEMA',
        p2: 'CHEMISTRY - MR JESUDAS',
        p3: 'ENGLISH - MS.SUBASHINI',
        p4: 'GEOGRAPHY - MS ELAYA',
        p5: 'MATHS - MR.GAJENDIRAN',
        p6: 'PHYSICS LAB - MR JOHN',
        p7: 'HISTORY - MS.JAYASHREE',
        coaching: 'II LANGUAGE - MR.VEL / MS.HEMA',
      },
      {
        day: 'TUESDAY',
        zero: 'AI - MS Hema',
        p1: 'MATHS - MR.GAJENDIRAN',
        p2: 'PHYSICS - MR.JOHN',
        p3: 'ENGLISH - MS.SUBASHINI',
        p4: 'HISTORY - MS JAYASHREE',
        p5: 'MATHS LAB - MR.GAJENDIRAN',
        p6: 'II LANGUAGE - MS UMA / MS.HEMA',
        p7: 'GEOGRAPHY - MS ELAYA',
        coaching: 'SOCIAL - MS JAYASHREE / MS ELAYALAKSHMI',
      },
      {
        day: 'WEDNESDAY',
        zero: 'SOCIAL - Ms.Elayalakshmi',
        p1: 'BIOLOGY - MS BANU',
        p2: 'MATHS - MR.GAJENDIRAN',
        p3: 'ENGLISH - MS.SUBASHINI',
        p4: 'CHEMISTRY - MR JESUDAS',
        p5: 'GEOGRAPHY - MS ELAYA',
        p6: 'AI - MS.NAGA',
        p7: 'II LANGUAGE - MS UMA / MS.HEMA',
        coaching: 'ENGLISH - MS.YUVASHREE',
      },
      {
        day: 'THURSDAY',
        zero: 'MATHS - Ms. Palani gomathi',
        p1: 'HISTORY - MS JAYASHREE',
        p2: 'ENGLISH - MS.SUBASHINI',
        p3: 'PHYSICS - MR.JOHN',
        p4: 'CHEMISTRY - MR JESUDAS',
        p5: 'BIOLOGY - MS BANU',
        p6: 'AI LAB - MS.NAGA',
        p7: 'MATHS - MR.GAJENDIRAN',
        coaching: 'MATHS - MR.GAJENDIRAN / MS.PALANI',
      },
      {
        day: 'FRIDAY',
        zero: 'CHEMISTRY - Mr.John',
        p1: 'CHEMISTRY - MR JESUDAS',
        p2: 'HISTORY - MS JAYASHREE',
        p3: 'MATHS - MR.GAJENDIRAN',
        p4: 'PET - MR KARTHIKEYAN',
        p5: 'II LANGUAGE - MS UMA / MS.HEMA',
        p6: 'BIOLOGY - MS BANU',
        p7: 'PHYSICS - MR.JOHN',
        coaching: 'AI - MS.NAGA',
      },
      {
        day: 'SATURDAY',
        zero: 'BIOLOGY - Ms. Dhilshath banu',
        p1: 'PHYSICS - MR.JOHN',
        p2: 'II LANGUAGE - MS UMA / MS.HEMA',
        p3: 'CHEMISTRY LAB - MR JESUDAS',
        p4: 'MATHS - MR.GAJENDIRAN',
        p5: 'BIOLOGY LAB - MS BANU',
        p6: 'GEOGRAPHY - MS ELAYA',
        p7: 'ENGLISH - MS.SUBASHINI',
        coaching: 'SCIENCE (MR JOHN / MR JESUDAS / MS SATHYA / MS BANU)',
      },
    ],
  },
  {
    className: 'X B',
    classTeacher: 'MS.YUVASHREE',
    rows: [
      {
        day: 'MONDAY',
        zero: 'PHYSICS - MS.Yuvashree',
        p1: 'MATHS - MS PALANI',
        p2: 'ENGLISH - MS.YUVASHREE',
        p3: 'HISTORY - MS JAYASHREE',
        p4: 'CHEMISTRY - MR JESUDAS',
        p5: 'AI LAB - MS.NAGA',
        p6: 'II LANGUAGE - MR VELMURUGAN',
        p7: 'GEOGRAPHY - MS ELAYA',
        coaching: 'II LANGUAGE - MR.VEL / MS.HEMA',
      },
      {
        day: 'TUESDAY',
        zero: 'AI - MR.Velmurugan',
        p1: 'II LANGUAGE - MR VELMURUGAN',
        p2: 'CHEMISTRY - MR JESUDAS',
        p3: 'PHYSICS - MR.JOHN',
        p4: 'MATHS - MS PALANI GOMATHI',
        p5: 'HISTORY - MS JAYASHREE',
        p6: 'BIOLOGY LAB - MS BANU',
        p7: 'AI - MS.NAGALAKSHMI',
        coaching: 'SOCIAL - MS JAYA / MS ELAYA',
      },
      {
        day: 'WEDNESDAY',
        zero: 'SOCIAL - Ms. Jayashree',
        p1: 'GEOGRAPHY - MS ELAYA',
        p2: 'BIOLOGY - MS BANU',
        p3: 'MATHS - MS PALANI',
        p4: 'PHYSICS - MR.JOHN',
        p5: 'ENGLISH - MS.YUVASHREE',
        p6: 'MATHS - MS PALANI',
        p7: 'CHEMISTRY - MR JESUDAS',
        coaching: 'ENGLISH - MS.YUVASHREE',
      },
      {
        day: 'THURSDAY',
        zero: 'MATHS - Mr. Yuvashree',
        p1: 'BIOLOGY - MS BANU',
        p2: 'PHYSICS - MR.JOHN',
        p3: 'HISTORY - MS JAYASHREE',
        p4: 'II LANGUAGE - MR VELMURUGAN',
        p5: 'MATHS LAB - MS PALANI',
        p6: 'GEOGRAPHY - MS ELAYA',
        p7: 'ENGLISH - MS.YUVASHREE',
        coaching: 'MATHS - MR.GAJENDIRAN / MS.PALANI',
      },
      {
        day: 'FRIDAY',
        zero: 'CHEMISTRY - Mr.Jesudas',
        p1: 'GEOGRAPHY - MS ELAYA',
        p2: 'MATHS - MS PALANI',
        p3: 'PET - MR KARTHIKEYAN',
        p4: 'PHYSICS LAB - MR JOHN',
        p5: 'CHEMISTRY - MR JESUDAS',
        p6: 'ENGLISH - MS.YUVASHREE',
        p7: 'II LANGUAGE - MR VELMURUGAN',
        coaching: 'AI - MS.NAGALAKSHMI',
      },
      {
        day: 'SATURDAY',
        zero: 'BIOLOGY - MR. Allwin',
        p1: 'HISTORY - MS JAYASHREE',
        p2: 'MATHS - MS PALANI',
        p3: 'PHYSICS - MR.JOHN',
        p4: 'II LANGUAGE - MR VELMURUGAN',
        p5: 'CHEMISTRY LAB - MR JESUDAS',
        p6: 'ENGLISH - MS.YUVASHREE',
        p7: 'BIOLOGY - MS BANU',
        coaching: 'SCIENCE (MR JOHN / MR JESUDAS / MS SATHYA / MS BANU)',
      },
    ],
  },
  {
    className: 'X C',
    classTeacher: 'MS. GAJENDIRAN',
    rows: [
      {
        day: 'MONDAY',
        zero: 'PHYSICS - Mr. John',
        p1: 'CHEMISTRY - MS SATHYA',
        p2: 'AI - MS.NAGA',
        p3: 'GEOGRAPHY - MS ELAYA',
        p4: 'ENGLISH - MS.JEEVITHA',
        p5: 'II LANGUAGE - MR VELMURUGAN',
        p6: 'MATHS - MR.GAJENDIRAN',
        p7: 'BIOLOGY - MS BANU',
        coaching: 'II LANGUAGE - MR VEL / MS HEMA',
      },
      {
        day: 'TUESDAY',
        zero: 'AI - Ms. Nagalakshmi',
        p1: 'PHYSICS - MR.JOHN',
        p2: 'ENGLISH - MS.JEEVITHA',
        p3: 'BIOLOGY LAB - MS BANU',
        p4: 'II LANGUAGE - MR VELMURUGAN',
        p5: 'GEOGRAPHY - MS ELAYA',
        p6: 'MATHS - MR.GAJENDIRAN',
        p7: 'CHEMISTRY LAB - MS SATHYA',
        coaching: 'SOCIAL - MS JAYA / MS ELAYA',
      },
      {
        day: 'WEDNESDAY',
        zero: 'SOCIAL - Ms. Gajendiran',
        p1: 'CHEMISTRY - MS SATHYA',
        p2: 'ENGLISH - MS.JEEVITHA',
        p3: 'BIOLOGY - MS BANU',
        p4: 'HISTORY - MS JAYA',
        p5: 'II LANGUAGE - MR VELMURUGAN',
        p6: 'MATHS LAB - MR.GAJENDIRAN',
        p7: 'PHYSICS - MR.JOHN',
        coaching: 'ENGLISH - MS.YUVASHREE',
      },
      {
        day: 'THURSDAY',
        zero: 'MATHS - Mr. Gajendiran',
        p1: 'PHYSICS - MR.JOHN',
        p2: 'MATHS - MR.GAJENDIRAN',
        p3: 'CHEMISTRY - MS SATHYA',
        p4: 'MATHS - MR.GAJENDIRAN',
        p5: 'ENGLISH - MS.JEEVITHA',
        p6: 'II LANGUAGE - MR VELMURUGAN',
        p7: 'HISTORY - MS JAYASHREE',
        coaching: 'MATHS - MR.GAJENDIRAN / MS.PALANI',
      },
      {
        day: 'FRIDAY',
        zero: 'CHEMISTRY - Mr.Allwin',
        p1: 'PHYSICS - MR.JOHN',
        p2: 'GEOGRAPHY - MS ELAYA',
        p3: 'CHEMISTRY - MS SATHYA',
        p4: 'MATHS - MR.GAJENDIRAN',
        p5: 'PET - MR KARTHIKEYAN',
        p6: 'HISTORY - MS JAYASHREE',
        p7: 'AI LAB - MS.NAGA',
        coaching: 'AI - MS.NAGA',
      },
      {
        day: 'SATURDAY',
        zero: 'BIOLOGY - Ms. Yuvashree',
        p1: 'BIOLOGY - MS BANU',
        p2: 'ENGLISH - MS.JEEVITHA',
        p3: 'II LANGUAGE - MR VELMURUGAN',
        p4: 'HISTORY - MS JAYA',
        p5: 'GEOGRAPHY - MS ELAYA',
        p6: 'PHYSICS LAB - MR JOHN',
        p7: 'MATHS - MR.GAJENDIRAN',
        coaching: 'SCIENCE (MR JOHN / MR JESUDAS / MS SATHYA / MS BANU)',
      },
    ],
  },
];

// Sheet 5: Teacher-specific timetables
export const teacherTimetables: TeacherTimetableSheet[] = [
  {
    id: 1,
    name: 'MS. SUBASHINI (PRINCIPAL)',
    subjectInfo: 'ENGLISH (X A)',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: 'X A', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: 'X A', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: 'X A', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: 'X A', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: 'X A', freePeriods: '' },
    ],
  },
  {
    id: 2,
    name: 'MS.JEEVITHA (HM)',
    subjectInfo: 'ENGLISH (X C)',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: '', p4: 'X C', p5: '', p6: '', p7: '', freePeriods: '0,1,2,3,5,7' },
      { day: 'TUESDAY', zero: '', p1: '', p2: 'X C', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '0,1,3,4,5,6,7' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: 'X C', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '0,3,4,5,6' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'X C', p6: '', p7: '', freePeriods: '0,1,2,3,6,7' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '0,1,2,4,5,6,7' },
      { day: 'SATURDAY', zero: '', p1: '', p2: 'X C', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '0,1,4,5,6,7' },
    ],
  },
  {
    id: 3,
    name: 'MS.YUVASHREE',
    subjectInfo: 'ENGLISH (X B) (IX A,B,C)',
    rows: [
      { day: 'MONDAY', zero: 'X B', p1: '', p2: 'X B', p3: '', p4: 'IX C', p5: 'IX A', p6: 'IX B', p7: '', freePeriods: '1,3,7' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: 'IX C', p5: 'IX A', p6: '', p7: '', freePeriods: '0,1,2,3,6,7' },
      { day: 'WEDNESDAY', zero: '', p1: 'IX B', p2: '', p3: '', p4: '', p5: 'X B', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '0,2,3,4,6' },
      { day: 'THURSDAY', zero: 'X B', p1: '', p2: '', p3: '', p4: 'IX B', p5: '', p6: 'IX A', p7: 'X B', freePeriods: '1,2,3,5' },
      { day: 'FRIDAY', zero: 'IX C', p1: 'IX A', p2: 'IX C', p3: '', p4: '', p5: '', p6: 'X B', p7: '', freePeriods: '3,4,5,7' },
      { day: 'SATURDAY', zero: 'X C', p1: 'IX C', p2: '', p3: 'IX B', p4: '', p5: '', p6: 'X B', p7: '', freePeriods: '2,4,5,7' },
    ],
  },
  {
    id: 4,
    name: 'MR.VELMURUGAN',
    subjectInfo: 'TAMIL (X B, X C) (IX A)',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: 'IX A', p4: '', p5: 'X C', p6: 'X B', p7: '', freePeriods: '0,1,2,4,7' },
      { day: 'TUESDAY', zero: 'X B', p1: 'X B', p2: '', p3: 'IX A', p4: 'X C', p5: '', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '2,5,6' },
      { day: 'WEDNESDAY', zero: 'IX A', p1: 'IX A', p2: '', p3: '', p4: '', p5: 'X C', p6: '', p7: '', freePeriods: '2,3,4,6,7' },
      { day: 'THURSDAY', zero: 'IX B', p1: '', p2: '', p3: '', p4: 'X B', p5: '', p6: 'X C', p7: '', freePeriods: '1,2,3,5,7' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: 'IX A', p4: '', p5: '', p6: '', p7: 'X B', freePeriods: '0,1,2,4,5,6' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: 'X C', p4: 'X B', p5: '', p6: '', p7: '', freePeriods: '0,1,2,5,6,7' },
    ],
  },
  {
    id: 5,
    name: 'MS UMA SHANKARI',
    subjectInfo: 'TAMIL (X A) (IX B,C)',
    rows: [
      { day: 'MONDAY', zero: '', p1: 'X A', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '0,2,3,4,5,6,7' },
      { day: 'TUESDAY', zero: '', p1: 'IX C', p2: '', p3: '', p4: '', p5: 'IX B', p6: 'X A', p7: 'CC - 9 A,B,C', freePeriods: '0,2,3,4' },
      { day: 'WEDNESDAY', zero: 'IX B', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX B', p7: 'X A', freePeriods: '1,2,3,4,5' },
      { day: 'THURSDAY', zero: '', p1: 'IX B', p2: '', p3: '', p4: '', p5: 'IX A - III L', p6: '', p7: '', freePeriods: '0,2,3,4,7' },
      { day: 'FRIDAY', zero: 'IX B', p1: '', p2: 'IX B', p3: '', p4: 'IX C', p5: 'X A', p6: '', p7: '', freePeriods: '1,3,6,7' },
      { day: 'SATURDAY', zero: 'IX C', p1: '', p2: 'X A', p3: '', p4: '', p5: 'IX C', p6: '', p7: '', freePeriods: '1,3,4,6,7' },
    ],
  },
  {
    id: 6,
    name: 'MS.HEMA',
    subjectInfo: 'HINDI (X A & IX A) (IX A, B, C)',
    rows: [
      { day: 'MONDAY', zero: '', p1: 'X A', p2: '', p3: 'IX A', p4: 'IX B - III L', p5: '', p6: '', p7: '', freePeriods: '0,2,5,6,7' },
      { day: 'TUESDAY', zero: 'X A', p1: '', p2: '', p3: 'IX A', p4: '', p5: '', p6: 'X A', p7: 'CC - 9 A,B,C', freePeriods: '1,2,4,5' },
      { day: 'WEDNESDAY', zero: 'IX A', p1: 'IX A', p2: '', p3: '', p4: '', p5: '', p6: 'IX C - III L', p7: 'X A', freePeriods: '2,3,4,5' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'IX A - III L', p6: '', p7: '', freePeriods: '0,1,2,3,4,6,7' },
      { day: 'FRIDAY', zero: 'IX A', p1: '', p2: '', p3: 'IX A', p4: '', p5: 'X A', p6: '', p7: '', freePeriods: '1,2,4,6,7' },
      { day: 'SATURDAY', zero: '', p1: '', p2: 'X A', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '0,1,3,4,5,6,7' },
    ],
  },
  {
    id: 7,
    name: 'MR.GAJENDIRAN',
    subjectInfo: 'MATHS (X A, X C) (IX B) - CT X C',
    rows: [
      { day: 'MONDAY', zero: 'IX B', p1: '', p2: '', p3: 'IX B', p4: '', p5: 'X A', p6: 'X C', p7: '', freePeriods: '1,2,4,7' },
      { day: 'TUESDAY', zero: '', p1: 'X A', p2: 'IX B', p3: '', p4: '', p5: 'X A LAB', p6: 'X C', p7: '', freePeriods: '0,3,4,7' },
      { day: 'WEDNESDAY', zero: 'X C', p1: '', p2: 'X A', p3: '', p4: 'IX B', p5: 'IX B LAB', p6: 'X C LAB', p7: '', freePeriods: '1,3,7' },
      { day: 'THURSDAY', zero: 'X C', p1: '', p2: 'X C', p3: '', p4: 'X C', p5: 'IX B', p6: '', p7: 'X A', freePeriods: '1,3,7' },
      { day: 'FRIDAY', zero: '', p1: 'IX B', p2: '', p3: 'X A', p4: 'X C', p5: '', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '0,2,5,6' },
      { day: 'SATURDAY', zero: '', p1: 'IX B', p2: '', p3: '', p4: 'X A', p5: '', p6: '', p7: 'X C', freePeriods: '0,2,3,5,6' },
    ],
  },
  {
    id: 8,
    name: 'MS.PALANI GOMATHI',
    subjectInfo: 'MATHS (X B) (IX C)',
    rows: [
      { day: 'MONDAY', zero: 'IX C', p1: 'X B', p2: '', p3: 'IX C', p4: 'XI B', p5: '', p6: 'IX C', p7: '', freePeriods: '0,2,5,7' },
      { day: 'TUESDAY', zero: 'XI B', p1: 'XI B', p2: '', p3: 'IX C', p4: 'X B', p5: 'XI B', p6: '', p7: '', freePeriods: '2,6,7' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: 'XI B', p3: 'X B', p4: 'IX C LAB', p5: '', p6: 'X B', p7: '', freePeriods: '0,1,5,7' },
      { day: 'THURSDAY', zero: 'X A', p1: 'IX C', p2: '', p3: 'XI B', p4: '', p5: 'X B LAB', p6: '', p7: '', freePeriods: '2,4,6,7' },
      { day: 'FRIDAY', zero: '', p1: '', p2: 'X B', p3: 'IX C', p4: 'XI B', p5: '', p6: 'XI B', p7: 'CC - 9 A,B,C', freePeriods: '0,1,5' },
      { day: 'SATURDAY', zero: '', p1: 'XI B', p2: 'X B', p3: 'XI B', p4: '', p5: '', p6: 'IX C', p7: '', freePeriods: '0,4,5,7' },
    ],
  },
  {
    id: 9,
    name: 'MS MUTHU LAKSHMI',
    subjectInfo: 'MATHS (IX A)',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: 'IX A', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: 'IX A', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: 'IX A', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: 'IX A', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'IX A', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: '', p4: 'IX A LAB', p5: 'IX A', p6: '', p7: '', freePeriods: '' },
    ],
  },
  {
    id: 10,
    name: 'MR.JOHN',
    subjectInfo: 'PHYSICS (X A, B, C) (XI B)',
    rows: [
      { day: 'MONDAY', zero: 'X C', p1: 'XI B', p2: '', p3: '', p4: '', p5: '', p6: 'X A LAB', p7: '', freePeriods: '2,3,4,5,7' },
      { day: 'TUESDAY', zero: '', p1: 'X C', p2: 'X A', p3: 'X B', p4: '', p5: '', p6: 'XI B LAB', p7: 'XI B CC', freePeriods: '0,4,5' },
      { day: 'WEDNESDAY', zero: 'XI B', p1: 'XI B', p2: '', p3: 'XI B', p4: 'X B', p5: '', p6: '', p7: 'X C', freePeriods: '2,5,6' },
      { day: 'THURSDAY', zero: '', p1: 'X C', p2: 'X B', p3: 'X A', p4: 'XI B', p5: '', p6: '', p7: '', freePeriods: '0,5,6,7' },
      { day: 'FRIDAY', zero: 'X A', p1: 'X C', p2: '', p3: 'XI B', p4: 'X B LAB', p5: '', p6: '', p7: 'X A', freePeriods: '0,2,4,7' },
      { day: 'SATURDAY', zero: '', p1: 'X A', p2: '', p3: 'X B', p4: '', p5: 'XI B', p6: 'X C LAB', p7: '', freePeriods: '0,2,4,7' },
    ],
  },
  {
    id: 11,
    name: 'MS SATHYA',
    subjectInfo: 'PHYSICS (IX B, C) / (X C - CHEM)',
    rows: [
      { day: 'MONDAY', zero: 'IX A', p1: 'X C chem', p2: 'IX B', p3: 'XI B', p4: '', p5: 'IX C LAB', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '0,4,6' },
      { day: 'TUESDAY', zero: 'IX C', p1: '', p2: 'XI B', p3: '', p4: '', p5: 'IX C', p6: '', p7: 'X C LAB', freePeriods: '0,1,3,4,6' },
      { day: 'WEDNESDAY', zero: '', p1: 'X C chem', p2: '', p3: '', p4: 'XI B', p5: 'IX C', p6: '', p7: '', freePeriods: '0,2,3,6,7' },
      { day: 'THURSDAY', zero: '', p1: 'XI B', p2: '', p3: 'X C chem', p4: 'IX C', p5: 'XI B', p6: 'IX B LAB', p7: 'XI B CC', freePeriods: '0,2' },
      { day: 'FRIDAY', zero: 'XI B', p1: '', p2: 'XI B', p3: 'X C chem', p4: '', p5: '', p6: 'IX B', p7: '', freePeriods: '1,4,5,7' },
      { day: 'SATURDAY', zero: '', p1: '', p2: 'XI B LAB', p3: '', p4: '', p5: 'IX B', p6: '', p7: '', freePeriods: '0,1,3,4,6,7' },
    ],
  },
  {
    id: 12,
    name: 'MR.JESUDAS',
    subjectInfo: 'CHEMISTRY X (A, B) (IX A, B, C)',
    rows: [
      { day: 'MONDAY', zero: '', p1: 'IX C', p2: 'X A', p3: '', p4: 'X B', p5: 'IX C LAB', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '0,3,6' },
      { day: 'TUESDAY', zero: 'IX B', p1: 'IX B', p2: 'X B', p3: '', p4: 'IX A', p5: '', p6: 'IX C', p7: '', freePeriods: '3,5,7' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: 'IX B', p3: '', p4: 'X A', p5: '', p6: 'IX A LAB', p7: 'X B', freePeriods: '0,1,3,5' },
      { day: 'THURSDAY', zero: '', p1: '', p2: 'IX B', p3: '', p4: 'X A', p5: '', p6: 'IX B LAB', p7: '', freePeriods: '0,1,3,5,7' },
      { day: 'FRIDAY', zero: 'X B', p1: 'X A', p2: 'IX A', p3: '', p4: '', p5: 'X B', p6: '', p7: '', freePeriods: '3,4,6,7' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: 'X A LAB', p4: 'IX C', p5: 'X B LAB', p6: 'IX A', p7: '', freePeriods: '0,1,2,7' },
    ],
  },
  {
    id: 13,
    name: 'MR ALLWIN',
    subjectInfo: 'BIOLOGY - IX A, B, C',
    rows: [
      { day: 'MONDAY', zero: '', p1: 'IX B', p2: 'IX C', p3: '', p4: 'IX A PHY', p5: 'IX C LAB', p6: 'IX A BIO', p7: 'CC - 9 A,B,C', freePeriods: '0,1,3,5' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '1,2,3,4,5,7' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: 'IX B', p4: 'IX A BIO', p5: 'IX A PHY', p6: 'IX A LAB/BIO PHY/CHEM', p7: '', freePeriods: '0,1,3,7' },
      { day: 'THURSDAY', zero: 'IX C', p1: '', p2: '', p3: 'IX C', p4: '', p5: '', p6: 'IX B LAB', p7: '', freePeriods: '0,2,4,5,7' },
      { day: 'FRIDAY', zero: 'X C', p1: '', p2: '', p3: 'IX B K.VIKHAS', p4: 'IX B', p5: 'K.VIKHAS', p6: 'IX A PHY', p7: '', freePeriods: '1,2,3,4,6,7' },
      { day: 'SATURDAY', zero: '', p1: 'IX A BIO', p2: 'IX A K.VIKHAS', p3: 'IX C', p4: '', p5: '', p6: '', p7: 'X B BIO', freePeriods: '2,4,6' },
    ],
  },
  {
    id: 14,
    name: 'MS DHILSHATH BANU',
    subjectInfo: 'BIOLOGY - X A, B, C',
    rows: [
      { day: 'MONDAY', zero: 'XI A', p1: '', p2: '', p3: '', p4: '', p5: 'XI A', p6: '', p7: 'X C', freePeriods: '2,3,6' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: 'X C LAB', p4: 'XI A', p5: '', p6: 'X B LAB', p7: '', freePeriods: '0,1,2,5,6,7' },
      { day: 'WEDNESDAY', zero: '', p1: 'X A', p2: 'X B', p3: 'X C', p4: '', p5: '', p6: 'XI A LAB', p7: '', freePeriods: '0,2,5,7' },
      { day: 'THURSDAY', zero: '', p1: 'X B', p2: 'XI A', p3: '', p4: '', p5: 'X A', p6: '', p7: '', freePeriods: '1,3,4,6,7' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XI A', p6: 'X A', p7: '', freePeriods: '0,1,2,3,7' },
      { day: 'SATURDAY', zero: 'X A', p1: 'X C', p2: '', p3: '', p4: 'XI A', p5: 'X A LAB', p6: '', p7: 'X B', freePeriods: '0,2,3,6,7' },
    ],
  },
  {
    id: 15,
    name: 'MS.JAYASHREE',
    subjectInfo: 'HISTORY (X A B C) (IX B-6, IX C-HIS)',
    rows: [
      { day: 'MONDAY', zero: '', p1: 'IX A (HIS)', p2: '', p3: 'X B', p4: '', p5: '', p6: '', p7: 'X A', freePeriods: '0,2,4,5,6' },
      { day: 'TUESDAY', zero: 'IX A', p1: 'IX A - GEO', p2: 'IX C (HIS)', p3: '', p4: 'X A', p5: 'X B', p6: 'IX A - GEO', p7: '', freePeriods: '0,3,7' },
      { day: 'WEDNESDAY', zero: 'X B', p1: 'IX C - HIS', p2: '', p3: 'IX A GEO', p4: 'X C', p5: '', p6: '', p7: '', freePeriods: '2,5,6' },
      { day: 'THURSDAY', zero: '', p1: 'X A', p2: '', p3: 'X B', p4: 'IX A (HIS)', p5: '', p6: '', p7: 'X C', freePeriods: '0,2,5,6' },
      { day: 'FRIDAY', zero: '', p1: 'IX C - HIS', p2: 'X A', p3: '', p4: 'IX A GEO', p5: '', p6: 'X C', p7: '', freePeriods: '0,3,4,7' },
      { day: 'SATURDAY', zero: 'IX A', p1: 'X B', p2: '', p3: '', p4: 'X C', p5: '', p6: '', p7: 'CC - 9 A,B,C', freePeriods: '0,2,3,5,6' },
    ],
  },
  {
    id: 16,
    name: 'MS.ELAYALAKSHMI',
    subjectInfo: 'GEOGRAPHY (X A B C) (IX A(H/G), IX C GEO)',
    rows: [
      { day: 'MONDAY', zero: 'X A', p1: '', p2: '', p3: 'X C', p4: 'X A', p5: 'IX B GEO', p6: '', p7: 'X B', freePeriods: '1,2,6' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: 'IX B GEO', p4: '', p5: 'X C', p6: 'IX B HIS', p7: 'X A', freePeriods: '0,1,2,4' },
      { day: 'WEDNESDAY', zero: 'X A', p1: 'X B', p2: 'IX C GEO', p3: '', p4: '', p5: 'X A', p6: '', p7: '', freePeriods: '3,4,6,7' },
      { day: 'THURSDAY', zero: '', p1: '', p2: 'IX C GEO', p3: 'IX B GEO', p4: '', p5: 'IX C GEO', p6: 'X B', p7: '', freePeriods: '0,1,4,7' },
      { day: 'FRIDAY', zero: '', p1: 'X B', p2: 'X C', p3: '', p4: '', p5: 'IX B HIS', p6: '', p7: '', freePeriods: '0,3,4,6,7' },
      { day: 'SATURDAY', zero: 'IX B', p1: '', p2: 'IX B HIS', p3: '', p4: '', p5: 'X C', p6: 'X A', p7: 'CC - 9 A,B,C', freePeriods: '1,3,4' },
    ],
  },
  {
    id: 17,
    name: 'MS.NAGALAKSHMI',
    subjectInfo: 'AI (X A, X B, X C)',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: 'X C', p3: '', p4: '', p5: 'X B LAB', p6: '', p7: '', freePeriods: '0,1,3,4,6,7' },
      { day: 'TUESDAY', zero: 'X C', p1: '', p2: '', p3: '', p4: 'IX B', p5: '', p6: '', p7: 'X B', freePeriods: '1,2,3,5,6' },
      { day: 'WEDNESDAY', zero: 'IX C', p1: '', p2: '', p3: 'IX C - LAB', p4: '', p5: '', p6: 'X A', p7: '', freePeriods: '1,2,4,5' },
      { day: 'THURSDAY', zero: 'IX A', p1: 'IX A', p2: '', p3: 'IX A - LAB', p4: '', p5: '', p6: 'X A LAB', p7: 'CC - 9 A,B,C', freePeriods: '2,4,5,6' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX C', p7: 'X C LAB', freePeriods: '0,1,2,3,4,5' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX B - LAB', p7: '', freePeriods: '0,1,2,3,4,5,7' },
    ],
  },
  {
    id: 18,
    name: 'MR. JAMES KINGLY',
    subjectInfo: 'PET (X A, X B, X C) (IX A, B, C)',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '', freePeriods: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: 'X B', p4: 'X A', p5: 'X C', p6: '', p7: '', freePeriods: '' },
      { day: 'SATURDAY', zero: '', p1: '', p2: 'IX C', p3: 'IX A', p4: 'IX B', p5: '', p6: '', p7: '', freePeriods: '' },
    ],
  },
];

// Sheet 6: Lab Timetables
export const labTimetables: LabTimetableSheet[] = [
  {
    id: 1,
    labName: 'PHYSICS LAB (X A, X B, X C)',
    teacherName: 'MR. JOHN',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: 'XII A', p3: '', p4: '', p5: 'IX C', p6: 'X A', p7: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XII A', p6: 'XI B', p7: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX A', p7: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XII B', p6: 'IX B', p7: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: 'XI A', p4: 'X B', p5: '', p6: '', p7: '' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XII B', p6: 'X C', p7: '' },
    ],
  },
  {
    id: 2,
    labName: 'CHEMISTRY LAB (X A, X B, X C)',
    teacherName: 'MR. JESUDAS',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: 'XI A', p3: '', p4: '', p5: 'IX C', p6: '', p7: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XII B', p6: '', p7: 'X C' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX A', p7: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XII A', p6: 'IX B', p7: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'XII A', p7: '' },
      { day: 'SATURDAY', zero: '', p1: '', p2: 'XII B', p3: 'X A', p4: 'XII B', p5: 'X B', p6: '', p7: '' },
    ],
  },
  {
    id: 3,
    labName: 'BIOLOGY LAB (X A, X B, X C) (IX A, B, C)',
    teacherName: 'MR. ALLWIN & MS BANU',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: '', p4: 'IX B', p5: 'IX C', p6: 'IX A', p7: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'X B', p7: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'XII A', p6: 'IX A', p7: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX B', p7: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'IX C', p6: 'XI A', p7: '' },
      { day: 'SATURDAY', zero: '', p1: 'X C', p2: '', p3: '', p4: '', p5: 'X A', p6: '', p7: '' },
    ],
  },
  {
    id: 4,
    labName: 'MATHS LAB (X A, X B, X C)',
    teacherName: 'MR. GAJENDIRAN & MS PALANI GOMATHI',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'X A LAB', p6: '', p7: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: 'IX B', p4: 'IX C', p5: '', p6: 'X C LAB', p7: '' },
      { day: 'THURSDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'X B LAB', p6: '', p7: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: '', p7: '' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: '', p4: 'IX A', p5: '', p6: '', p7: '' },
    ],
  },
  {
    id: 5,
    labName: 'AI LAB (X A, X B, X C)',
    teacherName: 'MS NAGALAKSHMI',
    rows: [
      { day: 'MONDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: 'X B LAB', p6: '', p7: '' },
      { day: 'TUESDAY', zero: '', p1: '', p2: 'XII A LAB', p3: '', p4: 'IX B LAB', p5: '', p6: 'XI B LAB', p7: '' },
      { day: 'WEDNESDAY', zero: '', p1: '', p2: '', p3: 'IX C LAB', p4: '', p5: 'XII B LAB', p6: '', p7: '' },
      { day: 'THURSDAY', zero: '', p1: 'IX A', p2: '', p3: 'IX A LAB', p4: '', p5: '', p6: 'X A LAB', p7: '' },
      { day: 'FRIDAY', zero: '', p1: '', p2: 'XI A LAB', p3: '', p4: '', p5: '', p6: 'IX C LAB', p7: 'X C LAB' },
      { day: 'SATURDAY', zero: '', p1: '', p2: '', p3: '', p4: '', p5: '', p6: 'IX B LAB', p7: '' },
    ],
  },
];

// Sheet 8: DRT Schedule (Zero Period)
export const drtSchedule: DrtScheduleRow[] = [
  {
    sno: 1,
    day: 'MONDAY',
    xa: 'PHYSICS - Ms.Elayalakshmi',
    xb: 'PHYSICS - MS.Yuvashree',
    xc: 'PHYSICS - Mr. John',
    ixa: 'Maths - Ms.Sathya',
    ixb: 'Maths - Mr.Gajendiran',
    ixc: 'Maths - Ms Palani',
  },
  {
    sno: 2,
    day: 'TUESDAY',
    xa: 'AI - MS Hema',
    xb: 'AI - MR.Velmurugan',
    xc: 'AI - Ms. Nagalakshmi',
    ixa: 'Science - Ms.Jayashree',
    ixb: 'Science - Mr Jesudas',
    ixc: 'Science - Ms. Sathya',
  },
  {
    sno: 3,
    day: 'WEDNESDAY',
    xa: 'SOCIAL - Ms.Elayalakshmi',
    xb: 'SOCIAL - Ms. Jayashree',
    xc: 'SOCIAL - Ms. Gajendiran',
    ixa: 'II Language - Ms.Hema / Mr. Velmurugan',
    ixb: 'II Language - Ms.Uma',
    ixc: 'II Language - Ms.Nagalakshmi',
  },
  {
    sno: 4,
    day: 'THURSDAY',
    xa: 'MATHS - Ms. Palani gomathi',
    xb: 'MATHS - Mr. Yuvashree',
    xc: 'MATHS - Mr. Gajendiran',
    ixa: 'AI - Ms.Nagalakshmi',
    ixb: 'AI - Mr.Velmurugan',
    ixc: 'AI - Mr Allwin',
  },
  {
    sno: 5,
    day: 'FRIDAY',
    xa: 'CHEMISTRY - Mr.John',
    xb: 'CHEMISTRY - Mr.Jesudas',
    xc: 'CHEMISTRY - Mr.Allwin',
    ixa: 'English - Ms.Hema',
    ixb: 'English - Ms. Uma',
    ixc: 'English - Ms. Yuvashree',
  },
  {
    sno: 6,
    day: 'SATURDAY',
    xa: 'BIOLOGY - Ms. Dhilshath banu',
    xb: 'BIOLOGY - MR. Allwin',
    xc: 'BIOLOGY - Ms. Yuvashree',
    ixa: 'SOCIAL - Ms. Elaya',
    ixb: 'Social - Ms.Jayashree',
    ixc: 'Social - Ms.Uma',
  },
];

// Sheet 9: Coaching Class Schedule
export const coachingClass: CoachingClassRow[] = [
  {
    sno: 1,
    day: 'MONDAY',
    gradeX: 'II LANGUAGE - MR VELMURUGAN / MS UMA / MS HEMA',
    gradeIX: 'SCIENCE (MR JOHN / MR JESUDAS / MS SATHYA / MR ALLWIN)',
  },
  {
    sno: 2,
    day: 'TUESDAY',
    gradeX: 'SOCIAL - MS JAYASHREE / MS ELAYALAKSHMI',
    gradeIX: 'II LANGUAGE - MR VELMURUGAN / MS HEMA',
  },
  {
    sno: 3,
    day: 'WEDNESDAY',
    gradeX: 'ENGLISH - MS.YUVASHREE',
    gradeIX: 'ENGLISH - MS.YUVASHREE',
  },
  {
    sno: 4,
    day: 'THURSDAY',
    gradeX: 'MATHS - MR.GAJENDIRAN / MS.PALANI GOMATHI',
    gradeIX: 'AI - MS.NAGALAKSHMI',
  },
  {
    sno: 5,
    day: 'FRIDAY',
    gradeX: 'AI - MS.NAGALAKSHMI',
    gradeIX: 'MATHS - MR.GAJENDIRAN / MS.PALANI GOMATHI / MS MUTHULAKSHMI',
  },
  {
    sno: 6,
    day: 'SATURDAY',
    gradeX: 'SCIENCE (MR JOHN / MR JESUDAS / MS DHILSHATHBANU / MS SATHYA)',
    gradeIX: 'SOCIAL - MS JAYASHREE / MS ELAYALAKSHMI',
  },
];

// Sheet 10: Teacher Free Period Matrix
export const teacherFreeTime: TeacherFreeTimeRow[] = [
  {
    id: 1,
    sno: '1',
    name: 'MS. JEEVITHA',
    subject: 'ENGLISH',
    classesHandling: 'X C - 5',
    monday: '0,1,2,3,5,7',
    tuesday: '0,1,3,4,5,6,7',
    wednesday: '0,3,4,5,6',
    thursday: '0,1,2,3,6,7',
    friday: '0,1,2,4,5,6,7',
    saturday: '0,1,4,5,6,7',
  },
  {
    id: 2,
    sno: '2',
    name: 'MS.YUVASHREE',
    subject: 'ENGLISH',
    classesHandling: 'IX A, B, C - 4+4+4; X B - 5',
    monday: '1,3,7',
    tuesday: '0,1,2,3,6,7',
    wednesday: '0,2,3,4,6',
    thursday: '1,2,3,5',
    friday: '3,4,5,7',
    saturday: '2,4,5,7',
  },
  {
    id: 3,
    sno: '3',
    name: 'MR.VELMURUGAN',
    subject: 'TAMIL',
    classesHandling: 'IX A - 4; X B, C - 5+5',
    monday: '0,1,2,4,7',
    tuesday: '2,5,6',
    wednesday: '2,3,4,6,7',
    thursday: '1,2,3,5,7',
    friday: '0,1,2,4,5,6',
    saturday: '0,1,2,5,6,7',
  },
  {
    id: 4,
    sno: '4',
    name: 'MS UMA SHANKARI',
    subject: 'TAMIL',
    classesHandling: 'IX B, C - 4+4; R3 (IX A) - 1; X A - 5',
    monday: '0,2,3,4,5,6,7',
    tuesday: '0,2,3,4',
    wednesday: '1,2,3,4,5',
    thursday: '0,2,3,4,7',
    friday: '1,3,6,7',
    saturday: '1,3,4,6,7',
  },
  {
    id: 5,
    sno: '5',
    name: 'MS.HEMA SUBRAMANI',
    subject: 'HINDI',
    classesHandling: 'IX A - 4; R3 (IX A,B,C) - 1+1+1; X A - 5',
    monday: '0,2,5,6,7',
    tuesday: '1,2,4,5',
    wednesday: '2,3,4,5',
    thursday: '0,1,2,3,4,6,7',
    friday: '1,2,4,6,7',
    saturday: '0,1,3,4,5,6,7',
  },
  {
    id: 6,
    sno: '6',
    name: 'MS.PALANI GOMATHI',
    subject: 'MATHS',
    classesHandling: 'IX C - 7; X B - 7; XI B - 9',
    monday: '0,2,5,7',
    tuesday: '2,6,7',
    wednesday: '0,1,5,7',
    thursday: '2,4,6,7',
    friday: '0,1,5',
    saturday: '0,4,5,7',
  },
  {
    id: 7,
    sno: '7',
    name: 'MS.MUTHULAKSHMI (LINK FROM MIDDLE)',
    subject: 'MATHS',
    classesHandling: 'IX A - 7',
    monday: '-',
    tuesday: '-',
    wednesday: '-',
    thursday: '-',
    friday: '-',
    saturday: '-',
  },
  {
    id: 8,
    sno: '7',
    name: 'MR.GAJENDIRAN',
    subject: 'MATHS',
    classesHandling: 'IX B - 7; X A, C - 7+7',
    monday: '1,2,4,7',
    tuesday: '0,3,4,7',
    wednesday: '1,3,7',
    thursday: '1,3,7',
    friday: '0,2,5,6',
    saturday: '0,2,3,5,6',
  },
  {
    id: 9,
    sno: '8',
    name: 'MR.JOHN',
    subject: 'PHYSICS',
    classesHandling: 'X A,B,C - 5+5+5; XI B - 7',
    monday: '2,3,4,5,7',
    tuesday: '0,4,5',
    wednesday: '2,5,6',
    thursday: '0,5,6,7',
    friday: '0,2,4,7',
    saturday: '0,2,4,7',
  },
  {
    id: 10,
    sno: '9',
    name: 'MS.SATHYA',
    subject: 'PHYSICS & CHEMISTRY',
    classesHandling: 'PHY - IX B,C - 8; CHEM - X C - 5; XI B(CHEM) - 7',
    monday: '0,4,6',
    tuesday: '0,1,3,4,6',
    wednesday: '0,2,3,6,7',
    thursday: '0,2',
    friday: '1,4,5,7',
    saturday: '0,1,3,4,6,7',
  },
  {
    id: 11,
    sno: '10',
    name: 'MR.JESUDAS',
    subject: 'CHEMISTRY',
    classesHandling: 'IX A, B, C - 4+4+4; X A, B - 5+5',
    monday: '0,3,6',
    tuesday: '3,5,7',
    wednesday: '0,1,3,5',
    thursday: '0,1,3,5,7',
    friday: '3,4,6,7',
    saturday: '0,1,2,7',
  },
  {
    id: 12,
    sno: '11',
    name: 'MS.DHILSHATH BANU',
    subject: 'BIOLOGY',
    classesHandling: 'X A,B,C - 4+4+4; XI - 6',
    monday: '1,2,3,4,6',
    tuesday: '0,1,2,5,7',
    wednesday: '0,4,5,7',
    thursday: '0,3,4,6,7',
    friday: '0,1,2,3,4,7',
    saturday: '2,3,6',
  },
  {
    id: 13,
    sno: '12',
    name: 'MR ALLWIN',
    subject: 'BIOLOGY',
    classesHandling: 'PHY - IX A - 4; BIO IX A, B, C - 4+4+4',
    monday: '1,3',
    tuesday: '0,1,2,3,4,5,6,7',
    wednesday: '1,2,4,5,7',
    thursday: '1,2,4,5,7',
    friday: '1,2,7',
    saturday: '1,4,5,7',
  },
  {
    id: 14,
    sno: '13',
    name: 'MS.JEYASHREE',
    subject: 'HISTORY',
    classesHandling: 'IX A - 6 (H & G); IX C - 3 (HIS); X A, B, C - 4+4+4 (HIS)',
    monday: '0,2,4,5,6',
    tuesday: '0,3,7',
    wednesday: '2,5,6',
    thursday: '0,2,5,6',
    friday: '0,3,4,7',
    saturday: '0,2,3,5,6',
  },
  {
    id: 15,
    sno: '14',
    name: 'MS.ELAYALAKSHMI',
    subject: 'GEOGRAPHY',
    classesHandling: 'IX B - 6 (H & G); IX C - 3 (GEO); X A, B, C - 4+4+4 (GEO)',
    monday: '1,2,6',
    tuesday: '0,1,2,4',
    wednesday: '3,4,6,7',
    thursday: '-',
    friday: '0,3,4,6,7',
    saturday: '1,3,4',
  },
  {
    id: 16,
    sno: '15',
    name: 'MS.NAGALAKSHMI',
    subject: 'ARTIFICIAL INTELLIGENCE',
    classesHandling: 'IX A, B, C - 2+2+2; X A, B, C - 2+2+2',
    monday: '0,1,3,4,6,7',
    tuesday: '1,2,3,5,6',
    wednesday: '1,2,4,5',
    thursday: '2,4,5,6',
    friday: '0,1,2,3,4,5',
    saturday: '0,1,2,3,4,5,7',
  },
];
