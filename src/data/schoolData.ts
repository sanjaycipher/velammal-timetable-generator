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

export const DAYS: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const classes: string[] = ['IX A', 'IX B', 'IX C', 'X A', 'X B', 'X C'];

export const guidelines: Guideline[] = [
  {
    id: 1,
    rule: 'All teachers are to be appropriately allotted classes.',
    remarks: 'FOLLOWED',
  },
  {
    id: 2,
    rule: 'Teachers handling classes from the Primary to Senior Secondary level are to be allotted a minimum of 28 periods.',
    remarks: 'FOLLOWED',
  },
  {
    id: 3,
    rule: 'All teachers handling Primary classes are to be allotted four sections.',
    remarks: 'NA',
  },
  {
    id: 4,
    rule: 'Secondary Level – Section Allotment: English, Tamil, Hindi – 4 sections; Mathematics – 3 sections; Physics, Chemistry, Biology, History, Geography – 5 sections; Other subjects – 3 sections.',
    remarks: 'FOLLOWED',
  },
  {
    id: 5,
    rule: 'One Physical Education Teacher (PET) is to be allotted for every 500 students.',
    remarks: 'FOLLOWED',
  },
  {
    id: 6,
    rule: 'Senior In-charges are to be allotted one section.',
    remarks: 'FOLLOWED',
  },
  {
    id: 7,
    rule: 'Vice-Principals and Headmasters are also allotted one section, subject to change from one to two sections, if required.',
    remarks: 'FOLLOWED',
  },
  {
    id: 8,
    rule: 'Assistant Headmasters are to be allotted two sections.',
    remarks: 'NA',
  },
  {
    id: 9,
    rule: 'Controller of Examinations (COEs) are to handle three sections.',
    remarks: 'NA',
  },
  {
    id: 10,
    rule: 'In cases where the division of sections based on workload results in a fraction (e.g., 0.25), suitable adjustments may be made.',
    remarks: 'FOLLOWED',
  },
  {
    id: 11,
    rule: 'Small schools to go with Part time ECA teachers.',
    remarks: 'NA',
  },
  {
    id: 12,
    rule: 'Substitute teachers are appointed based on the overall workload of the teachers.',
    remarks: 'NA',
  },
  {
    id: 13,
    rule: 'Tentative section allotment needs to be done and workout the exact workload.',
    remarks: 'FOLLOWED',
  },
  {
    id: 14,
    rule: 'Follow last year period allotment to freeze the number of periods.',
    remarks: 'FOLLOWED',
  },
  {
    id: 15,
    rule: 'There is no special teacher for Library Classes, Club, Hand writing and Uniformed Services.',
    remarks: 'NA',
  },
  {
    id: 16,
    rule: 'Schools with Foundation must deduct section count based on the number of IIT sections and fix the teachers for Math, Physics and Chemistry.',
    remarks: 'NA',
  },
  {
    id: 17,
    rule: 'Check Biology.',
    remarks: 'NA',
  },
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
