'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import {
  PeriodSlot,
  PreferredSlot,
  SchoolClass,
  Subject,
  Teacher,
  useStore,
} from '@/store/useStore';
import { generateTimetable } from '@/utils/solver';

type SchoolCategoryId = 'pre-primary' | 'primary' | 'middle' | 'secondary' | 'senior-secondary';

interface CategoryTemplate {
  id: SchoolCategoryId;
  title: string;
  subtitle: string;
  classes: SchoolClass[];
  subjects: Subject[];
  teachers: Teacher[];
}

const DEFAULT_PERIODS: PeriodSlot[] = [
  { id: 'p1', periodNumber: 1, label: 'Period 1', startTime: '08:45', endTime: '09:30', isBreak: false },
  { id: 'p2', periodNumber: 2, label: 'Period 2', startTime: '09:30', endTime: '10:15', isBreak: false },
  { id: 'b1', periodNumber: 0, label: 'Short Break', startTime: '10:15', endTime: '10:30', isBreak: true },
  { id: 'p3', periodNumber: 3, label: 'Period 3', startTime: '10:30', endTime: '11:15', isBreak: false },
  { id: 'p4', periodNumber: 4, label: 'Period 4', startTime: '11:15', endTime: '12:00', isBreak: false },
  { id: 'b2', periodNumber: 0, label: 'Lunch Break', startTime: '12:00', endTime: '12:40', isBreak: true },
  { id: 'p5', periodNumber: 5, label: 'Period 5', startTime: '12:40', endTime: '13:25', isBreak: false },
  { id: 'p6', periodNumber: 6, label: 'Period 6', startTime: '13:25', endTime: '14:10', isBreak: false },
  { id: 'p7', periodNumber: 7, label: 'Period 7', startTime: '14:10', endTime: '14:55', isBreak: false },
];

const CATEGORY_TEMPLATES: Record<SchoolCategoryId, CategoryTemplate> = {
  'pre-primary': {
    id: 'pre-primary',
    title: 'Pre-Primary (Pre-KG, LKG, UKG)',
    subtitle: 'Activity-based: Rhymes, Storytelling, Phonics, Art & Play Time',
    classes: [
      { id: 'pp-prekg-a', className: 'Pre-KG', section: 'A', groups: [] },
      { id: 'pp-lkg-a', className: 'LKG', section: 'A', groups: [] },
      { id: 'pp-ukg-a', className: 'UKG', section: 'A', groups: [] },
    ],
    subjects: [
      { id: 'pp-eng', name: 'English & Phonics', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'pp-num', name: 'Number Work', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'pp-rhy', name: 'Rhymes & Storytelling', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'pp-evs', name: 'General Awareness', periodsPerWeekRequired: 6, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'pp-art', name: 'Art & Craft', periodsPerWeekRequired: 6, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'pp-play', name: 'Play Time & Music', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'last' },
    ],
    teachers: [
      { id: 't-pp-1', name: 'Ms. Anitha (Pre-Primary)', subjects: ['English & Phonics', 'Rhymes & Storytelling'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pp-2', name: 'Ms. Kavitha (Pre-Primary)', subjects: ['Number Work', 'General Awareness'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pp-3', name: 'Ms. Meena (Activity)', subjects: ['Art & Craft', 'Play Time & Music'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pp-4', name: 'Ms. Shalini (Support)', subjects: ['English & Phonics', 'Number Work', 'Play Time & Music'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pp-5', name: 'Ms. Deepa (Support)', subjects: ['Rhymes & Storytelling', 'General Awareness', 'Art & Craft'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
    ],
  },
  primary: {
    id: 'primary',
    title: 'Primary (Class I – V)',
    subtitle: 'Foundational languages, Math, EVS, Computer & PT',
    classes: [
      { id: 'pr-1a', className: 'Class I', section: 'A', groups: [] },
      { id: 'pr-3a', className: 'Class III', section: 'A', groups: [] },
      { id: 'pr-5a', className: 'Class V', section: 'A', groups: [] },
    ],
    subjects: [
      { id: 'pr-eng', name: 'English', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'pr-tam', name: 'Tamil', periodsPerWeekRequired: 6, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'pr-mat', name: 'Mathematics', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'pr-evs', name: 'EVS', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'pr-cs', name: 'Computer', periodsPerWeekRequired: 4, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'pr-art', name: 'Art & Library', periodsPerWeekRequired: 5, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'pr-pt', name: 'PT', periodsPerWeekRequired: 4, requiresDoublePeriod: false, preferredSlot: 'last' },
    ],
    teachers: [
      { id: 't-pr-1', name: 'Ms. Lakshmi (Eng)', subjects: ['English'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pr-2', name: 'Mr. Murugan (Tam)', subjects: ['Tamil'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pr-3', name: 'Ms. Nandhini (Math)', subjects: ['Mathematics'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pr-4', name: 'Ms. Revathi (EVS)', subjects: ['EVS'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pr-5', name: 'Mr. Vignesh (CS)', subjects: ['Computer'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pr-6', name: 'Ms. Sowmya (Art)', subjects: ['Art & Library'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-pr-7', name: 'Mr. Raja (PT)', subjects: ['PT'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
    ],
  },
  middle: {
    id: 'middle',
    title: 'Middle School (Class VI – VIII)',
    subtitle: 'Core subjects + Science Lab, Computer & PT',
    classes: [
      { id: 'md-6a', className: 'Class VI', section: 'A', groups: [] },
      { id: 'md-7a', className: 'Class VII', section: 'A', groups: [] },
      { id: 'md-8a', className: 'Class VIII', section: 'A', groups: [] },
    ],
    subjects: [
      { id: 'md-eng', name: 'English', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'md-tam', name: 'Tamil', periodsPerWeekRequired: 6, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'md-mat', name: 'Mathematics', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'md-sci', name: 'Science', periodsPerWeekRequired: 8, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'md-soc', name: 'Social Science', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'md-cs', name: 'Computer Science', periodsPerWeekRequired: 4, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'md-pt', name: 'PT', periodsPerWeekRequired: 2, requiresDoublePeriod: false, preferredSlot: 'last' },
    ],
    teachers: [
      { id: 't-md-1', name: 'Ms. Priya (Eng)', subjects: ['English'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-md-2', name: 'Mr. Karthik (Tam)', subjects: ['Tamil'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-md-3', name: 'Mr. Arun (Math)', subjects: ['Mathematics'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-md-4', name: 'Ms. Divya (Sci)', subjects: ['Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-md-5', name: 'Mr. Senthil (Soc)', subjects: ['Social Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-md-6', name: 'Ms. Keerthi (CS)', subjects: ['Computer Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-md-7', name: 'Mr. Bala (PT)', subjects: ['PT'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
    ],
  },
  secondary: {
    id: 'secondary',
    title: 'Secondary (Class IX – X)',
    subtitle: 'Board classes with double-period Labs, Maths & PT',
    classes: [
      { id: 'sec-9a', className: 'Class IX', section: 'A', groups: [] },
      { id: 'sec-10a', className: 'Class X', section: 'A', groups: [] },
      { id: 'sec-10b', className: 'Class X', section: 'B', groups: [] },
    ],
    subjects: [
      { id: 'sec-eng', name: 'English', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'sec-tam', name: 'Tamil', periodsPerWeekRequired: 6, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'sec-mat', name: 'Mathematics', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'sec-sci', name: 'Science', periodsPerWeekRequired: 8, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'sec-soc', name: 'Social Science', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'any' },
      { id: 'sec-ai', name: 'AI / Computer', periodsPerWeekRequired: 4, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'sec-pt', name: 'PT', periodsPerWeekRequired: 2, requiresDoublePeriod: false, preferredSlot: 'last' },
    ],
    teachers: [
      { id: 't-sec-1', name: 'Ms. Priya (Eng)', subjects: ['English'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-sec-2', name: 'Mr. Karthik (Tam)', subjects: ['Tamil'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-sec-3', name: 'Mr. Arun (Math)', subjects: ['Mathematics'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: ['5-p7'] },
      { id: 't-sec-4', name: 'Ms. Divya (Sci)', subjects: ['Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-sec-5', name: 'Mr. Senthil (Soc)', subjects: ['Social Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-sec-6', name: 'Ms. Keerthi (AI)', subjects: ['AI / Computer'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-sec-7', name: 'Mr. Bala (PT)', subjects: ['PT'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
    ],
  },
  'senior-secondary': {
    id: 'senior-secondary',
    title: 'Senior Secondary (Class XI – XII)',
    subtitle: 'Stream-wise (Science / Commerce) with practical double periods',
    classes: [
      { id: 'ss-11s', className: 'Class XI', section: 'Science', groups: [] },
      { id: 'ss-12s', className: 'Class XII', section: 'Science', groups: [] },
    ],
    subjects: [
      { id: 'ss-eng', name: 'English Core', periodsPerWeekRequired: 6, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'ss-phy', name: 'Physics', periodsPerWeekRequired: 9, requiresDoublePeriod: true, preferredSlot: 'morning' },
      { id: 'ss-che', name: 'Chemistry', periodsPerWeekRequired: 9, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'ss-mat', name: 'Mathematics', periodsPerWeekRequired: 9, requiresDoublePeriod: false, preferredSlot: 'morning' },
      { id: 'ss-cs', name: 'Computer / Biology', periodsPerWeekRequired: 7, requiresDoublePeriod: true, preferredSlot: 'any' },
      { id: 'ss-pt', name: 'PT / Library', periodsPerWeekRequired: 2, requiresDoublePeriod: false, preferredSlot: 'last' },
    ],
    teachers: [
      { id: 't-ss-1', name: 'Ms. Harini (Eng)', subjects: ['English Core'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-ss-2', name: 'Mr. Prakash (Phy)', subjects: ['Physics'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-ss-3', name: 'Ms. Vidya (Che)', subjects: ['Chemistry'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-ss-4', name: 'Mr. Suresh (Math)', subjects: ['Mathematics'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-ss-5', name: 'Ms. Keerthi (CS/Bio)', subjects: ['Computer / Biology'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
      { id: 't-ss-6', name: 'Mr. Bala (PT)', subjects: ['PT / Library'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
    ],
  },
};

export default function CreateTimetablePage() {
  const router = useRouter();
  const { setSchool, setPeriods, addClass, addSubject, addTeacher, setTimetableResult, resetStore } =
    useStore();

  const [category, setCategory] = useState<SchoolCategoryId>('secondary');
  const [schoolName, setSchoolName] = useState('Velammal Vidyalaya Poonamallee');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [workingDays, setWorkingDays] = useState(6);

  const [periods, setLocalPeriods] = useState<PeriodSlot[]>(DEFAULT_PERIODS);
  const [classes, setLocalClasses] = useState<SchoolClass[]>(CATEGORY_TEMPLATES.secondary.classes);
  const [subjects, setLocalSubjects] = useState<Subject[]>(CATEGORY_TEMPLATES.secondary.subjects);
  const [teachers, setLocalTeachers] = useState<Teacher[]>(CATEGORY_TEMPLATES.secondary.teachers);

  const [formError, setFormError] = useState<string | null>(null);

  const handleCategoryChange = (nextCategory: SchoolCategoryId) => {
    setCategory(nextCategory);
    const tpl = CATEGORY_TEMPLATES[nextCategory];
    setLocalClasses(tpl.classes.map((c) => ({ ...c })));
    setLocalSubjects(tpl.subjects.map((s) => ({ ...s })));
    setLocalTeachers(tpl.teachers.map((t) => ({ ...t, subjects: [...t.subjects], unavailablePeriods: [...t.unavailablePeriods] })));
    setFormError(null);
  };

  const teachingPeriodsCount = useMemo(
    () => periods.filter((p) => !p.isBreak).length,
    [periods]
  );
  const totalWeeklySlots = workingDays * teachingPeriodsCount;
  const totalSubjectPeriods = useMemo(
    () => subjects.reduce((sum, s) => sum + Math.max(0, Number(s.periodsPerWeekRequired) || 0), 0),
    [subjects]
  );

  // Class handlers
  const handleAddClass = () => {
    setLocalClasses((prev) => [
      ...prev,
      { id: `cls-${Date.now()}`, className: 'Class X', section: String.fromCharCode(65 + (prev.length % 26)), groups: [] },
    ]);
  };

  // Period handlers
  const handleAddPeriod = () => {
    const nextNum = teachingPeriodsCount + 1;
    setLocalPeriods((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        periodNumber: nextNum,
        label: `Period ${nextNum}`,
        startTime: '15:00',
        endTime: '15:45',
        isBreak: false,
      },
    ]);
  };

  // Subject handlers
  const handleAddSubject = () => {
    setLocalSubjects((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        name: 'New Subject',
        periodsPerWeekRequired: 2,
        requiresDoublePeriod: false,
        preferredSlot: 'any',
      },
    ]);
  };

  // Teacher handlers
  const handleAddTeacher = () => {
    setLocalTeachers((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        name: 'New Teacher',
        subjects: subjects[0] ? [subjects[0].name] : [],
        maxPeriodsPerDay: 6,
        maxPeriodsPerWeek: 30,
        unavailablePeriods: [],
      },
    ]);
  };

  const handleSubmitAndGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (classes.length === 0) {
      setFormError('Please add at least one class/section.');
      return;
    }
    if (subjects.length === 0) {
      setFormError('Please add at least one subject.');
      return;
    }
    if (teachers.length === 0) {
      setFormError('Please add at least one teacher.');
      return;
    }
    if (totalSubjectPeriods > totalWeeklySlots) {
      setFormError(
        `Weekly subject periods (${totalSubjectPeriods}) exceed available weekly slots (${totalWeeklySlots}). Reduce subject periods or add more periods/days.`
      );
      return;
    }

    const schoolConfig = {
      name: schoolName.trim() || 'My School',
      academicYear: academicYear.trim() || '2026-2027',
      workingDays,
      periodsPerDay: teachingPeriodsCount,
    };

    const result = generateTimetable({
      school: schoolConfig,
      periods,
      teachers,
      subjects,
      classes,
    });

    if (!result.success) {
      setFormError(result.error ?? 'Could not generate a valid timetable with these constraints.');
      return;
    }

    // Save into Zustand store and redirect to /generate
    resetStore();
    setSchool(schoolConfig);
    setPeriods(periods);
    classes.forEach(addClass);
    subjects.forEach(addSubject);
    teachers.forEach(addTeacher);
    setTimetableResult(result.timetable);

    router.push('/generate');
  };

  return (
    <Box sx={{ flex: 1, bgcolor: '#f0f4f9', py: { xs: 2.5, md: 5 } }}>
      <Container maxWidth="md">
        <form onSubmit={handleSubmitAndGenerate}>
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {/* Google-Form Header Card */}
            <Paper
              elevation={1}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                borderTop: '10px solid #1976d2',
                p: { xs: 2.5, sm: 4 },
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: { xs: '1.6rem', sm: '2.125rem' } }}
              >
                Create New Timetable
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fill in your school requirements step by step like a form. Select a category (Pre-KG to XII) to
                load recommended defaults, customize anything, and generate your conflict-free timetable.
              </Typography>
            </Paper>

            {/* Section 1: School & Category */}
            <Paper elevation={1} sx={{ p: 3.5, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                1. School Details &amp; Category (Pre-KG to XII)
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <TextField
                  label="School Name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>Working Days</InputLabel>
                  <Select
                    label="Working Days"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Number(e.target.value))}
                  >
                    <MenuItem value={5}>5 Days (Mon–Fri)</MenuItem>
                    <MenuItem value={6}>6 Days (Mon–Sat)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Select School Category (loads category-wise defaults):
              </Typography>
              <RadioGroup
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as SchoolCategoryId)}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                  }}
                >
                  {(Object.values(CATEGORY_TEMPLATES) as CategoryTemplate[]).map((tpl) => (
                    <Paper
                      key={tpl.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        borderColor: category === tpl.id ? 'primary.main' : 'divider',
                        bgcolor: category === tpl.id ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                      }}
                    >
                      <FormControlLabel
                        value={tpl.id}
                        control={<Radio size="small" />}
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {tpl.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tpl.subtitle}
                            </Typography>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Paper>
                  ))}
                </Box>
              </RadioGroup>
            </Paper>

            {/* Section 2: Classes & Sections */}
            <Paper elevation={1} sx={{ p: 3.5, borderRadius: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  2. Classes &amp; Sections
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddClass} variant="outlined">
                  Add Class / Section
                </Button>
              </Stack>

              <Stack spacing={1.5}>
                {classes.map((cls, idx) => (
                  <Stack key={cls.id} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <TextField
                      label="Class"
                      size="small"
                      value={cls.className}
                      onChange={(e) =>
                        setLocalClasses((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, className: e.target.value } : c))
                        )
                      }
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Section / Stream"
                      size="small"
                      value={cls.section}
                      onChange={(e) =>
                        setLocalClasses((prev) =>
                          prev.map((c, i) => (i === idx ? { ...c, section: e.target.value } : c))
                        )
                      }
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => setLocalClasses((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={classes.length <= 1}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Section 3: Period & Bell Schedule */}
            <Paper elevation={1} sx={{ p: 3.5, borderRadius: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    3. Period &amp; Bell Schedule
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {teachingPeriodsCount} teaching periods/day × {workingDays} days = {totalWeeklySlots} slots/week
                  </Typography>
                </Box>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddPeriod} variant="outlined">
                  Add Period
                </Button>
              </Stack>

              <Stack spacing={1.25}>
                {periods.map((slot, idx) => (
                  <Stack
                    key={slot.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    sx={{ alignItems: { sm: 'center' } }}
                  >
                    <TextField
                      label="Label"
                      size="small"
                      value={slot.label}
                      onChange={(e) =>
                        setLocalPeriods((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, label: e.target.value } : p))
                        )
                      }
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Start"
                      size="small"
                      value={slot.startTime}
                      onChange={(e) =>
                        setLocalPeriods((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, startTime: e.target.value } : p))
                        )
                      }
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="End"
                      size="small"
                      value={slot.endTime}
                      onChange={(e) =>
                        setLocalPeriods((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, endTime: e.target.value } : p))
                        )
                      }
                      sx={{ flex: 1 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={slot.isBreak}
                          onChange={(e) =>
                            setLocalPeriods((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, isBreak: e.target.checked } : p))
                            )
                          }
                        />
                      }
                      label="Break"
                    />
                    <IconButton
                      color="error"
                      onClick={() => setLocalPeriods((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={periods.length <= 1}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Section 4: Subjects & Weekly Periods */}
            <Paper elevation={1} sx={{ p: 3.5, borderRadius: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    4. Subjects &amp; Weekly Periods
                  </Typography>
                  <Chip
                    icon={<FactCheckOutlinedIcon />}
                    label={`Total: ${totalSubjectPeriods} / ${totalWeeklySlots} weekly slots`}
                    size="small"
                    color={totalSubjectPeriods === totalWeeklySlots ? 'success' : totalSubjectPeriods > totalWeeklySlots ? 'error' : 'warning'}
                    sx={{ mt: 0.5, fontWeight: 600 }}
                  />
                </Box>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddSubject} variant="outlined">
                  Add Subject
                </Button>
              </Stack>

              <Stack spacing={1.5}>
                {subjects.map((sub, idx) => (
                  <Stack
                    key={sub.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    sx={{ alignItems: { sm: 'center' } }}
                  >
                    <TextField
                      label="Subject Name"
                      size="small"
                      value={sub.name}
                      onChange={(e) =>
                        setLocalSubjects((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, name: e.target.value } : s))
                        )
                      }
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      label="Periods/Week"
                      type="number"
                      size="small"
                      value={sub.periodsPerWeekRequired}
                      onChange={(e) =>
                        setLocalSubjects((prev) =>
                          prev.map((s, i) =>
                            i === idx ? { ...s, periodsPerWeekRequired: Math.max(0, Number(e.target.value)) } : s
                          )
                        )
                      }
                      sx={{ width: { xs: '100%', sm: 120 } }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Preferred</InputLabel>
                      <Select
                        label="Preferred"
                        value={sub.preferredSlot ?? 'any'}
                        onChange={(e) =>
                          setLocalSubjects((prev) =>
                            prev.map((s, i) =>
                              i === idx ? { ...s, preferredSlot: e.target.value as PreferredSlot } : s
                            )
                          )
                        }
                      >
                        <MenuItem value="any">Any</MenuItem>
                        <MenuItem value="morning">Morning</MenuItem>
                        <MenuItem value="last">Last</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={sub.requiresDoublePeriod}
                          onChange={(e) =>
                            setLocalSubjects((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, requiresDoublePeriod: e.target.checked } : s
                              )
                            )
                          }
                        />
                      }
                      label="2-Period Lab"
                    />
                    <IconButton
                      color="error"
                      onClick={() => setLocalSubjects((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={subjects.length <= 1}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Section 5: Teachers & Constraints */}
            <Paper elevation={1} sx={{ p: 3.5, borderRadius: 3 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  5. Teachers &amp; Workload Limits
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={handleAddTeacher} variant="outlined">
                  Add Teacher
                </Button>
              </Stack>

              <Stack spacing={2}>
                {teachers.map((teacher, idx) => (
                  <Paper key={teacher.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      sx={{ alignItems: { sm: 'center' } }}
                    >
                      <TextField
                        label="Teacher Name"
                        size="small"
                        value={teacher.name}
                        onChange={(e) =>
                          setLocalTeachers((prev) =>
                            prev.map((t, i) => (i === idx ? { ...t, name: e.target.value } : t))
                          )
                        }
                        sx={{ flex: 2 }}
                      />
                      <FormControl size="small" sx={{ flex: 2 }}>
                        <InputLabel>Subjects</InputLabel>
                        <Select
                          multiple
                          label="Subjects"
                          value={teacher.subjects}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLocalTeachers((prev) =>
                              prev.map((t, i) =>
                                i === idx ? { ...t, subjects: typeof val === 'string' ? val.split(',') : val } : t
                              )
                            );
                          }}
                          renderValue={(selected) => (selected as string[]).join(', ')}
                        >
                          {subjects.map((sub) => (
                            <MenuItem key={sub.id} value={sub.name}>
                              <Checkbox checked={teacher.subjects.includes(sub.name)} size="small" />
                              {sub.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Max/Day"
                        type="number"
                        size="small"
                        value={teacher.maxPeriodsPerDay}
                        onChange={(e) =>
                          setLocalTeachers((prev) =>
                            prev.map((t, i) =>
                              i === idx ? { ...t, maxPeriodsPerDay: Math.max(1, Number(e.target.value)) } : t
                            )
                          )
                        }
                        sx={{ width: { xs: '100%', sm: 95 } }}
                      />
                      <TextField
                        label="Max/Week"
                        type="number"
                        size="small"
                        value={teacher.maxPeriodsPerWeek}
                        onChange={(e) =>
                          setLocalTeachers((prev) =>
                            prev.map((t, i) =>
                              i === idx ? { ...t, maxPeriodsPerWeek: Math.max(1, Number(e.target.value)) } : t
                            )
                          )
                        }
                        sx={{ width: { xs: '100%', sm: 105 } }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => setLocalTeachers((prev) => prev.filter((_, i) => i !== idx))}
                        disabled={teachers.length <= 1}
                      >
                        <DeleteOutlinedIcon />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Paper>

            {formError && (
              <Alert severity="error" onClose={() => setFormError(null)}>
                {formError}
              </Alert>
            )}

            {/* Submit Button */}
            <Stack direction="row" sx={{ justifyContent: 'flex-end', pb: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Save &amp; Generate Timetable
              </Button>
            </Stack>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
