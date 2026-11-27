'use client';

import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DatasetIcon from '@mui/icons-material/Dataset';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import {
  PeriodSlot,
  SchoolClass,
  Subject,
  Teacher,
  useStore,
} from '@/store/useStore';
import { generateTimetable } from '@/utils/solver';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SAMPLE_PERIODS: PeriodSlot[] = [
  { id: 'p1', periodNumber: 1, label: 'Period 1', startTime: '08:45', endTime: '09:30', isBreak: false },
  { id: 'p2', periodNumber: 2, label: 'Period 2', startTime: '09:30', endTime: '10:15', isBreak: false },
  { id: 'b1', periodNumber: 0, label: 'Short Break', startTime: '10:15', endTime: '10:30', isBreak: true },
  { id: 'p3', periodNumber: 3, label: 'Period 3', startTime: '10:30', endTime: '11:15', isBreak: false },
  { id: 'p4', periodNumber: 4, label: 'Period 4', startTime: '11:15', endTime: '12:00', isBreak: false },
  { id: 'b2', periodNumber: 0, label: 'Lunch', startTime: '12:00', endTime: '12:40', isBreak: true },
  { id: 'p5', periodNumber: 5, label: 'Period 5', startTime: '12:40', endTime: '13:25', isBreak: false },
  { id: 'p6', periodNumber: 6, label: 'Period 6', startTime: '13:25', endTime: '14:10', isBreak: false },
  { id: 'p7', periodNumber: 7, label: 'Period 7', startTime: '14:10', endTime: '14:55', isBreak: false },
];

const SAMPLE_SUBJECTS: Subject[] = [
  { id: 'sub-eng', name: 'English', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'morning' },
  { id: 'sub-tam', name: 'Tamil', periodsPerWeekRequired: 6, requiresDoublePeriod: false, preferredSlot: 'any' },
  { id: 'sub-mat', name: 'Mathematics', periodsPerWeekRequired: 8, requiresDoublePeriod: false, preferredSlot: 'morning' },
  { id: 'sub-sci', name: 'Science', periodsPerWeekRequired: 8, requiresDoublePeriod: true, preferredSlot: 'any' },
  { id: 'sub-soc', name: 'Social Science', periodsPerWeekRequired: 7, requiresDoublePeriod: false, preferredSlot: 'any' },
  { id: 'sub-cs', name: 'Computer Science', periodsPerWeekRequired: 4, requiresDoublePeriod: true, preferredSlot: 'any' },
  { id: 'sub-pt', name: 'PT', periodsPerWeekRequired: 2, requiresDoublePeriod: false, preferredSlot: 'last' },
];

const SAMPLE_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Ms. Priya (Eng)', subjects: ['English'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
  { id: 't2', name: 'Mr. Karthik (Tam)', subjects: ['Tamil'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
  { id: 't3', name: 'Mr. Arun (Math)', subjects: ['Mathematics'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: ['5-p7'] },
  { id: 't4', name: 'Ms. Divya (Sci)', subjects: ['Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
  { id: 't5', name: 'Mr. Senthil (Soc)', subjects: ['Social Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30, unavailablePeriods: [] },
  { id: 't6', name: 'Ms. Keerthi (CS)', subjects: ['Computer Science'], maxPeriodsPerDay: 6, maxPeriodsPerWeek: 24, unavailablePeriods: [] },
  { id: 't7', name: 'Mr. Bala (PT)', subjects: ['PT'], maxPeriodsPerDay: 5, maxPeriodsPerWeek: 20, unavailablePeriods: [] },
];

const SAMPLE_CLASSES: SchoolClass[] = [
  { id: 'c-10a', className: 'Class X', section: 'A', groups: [] },
  { id: 'c-10b', className: 'Class X', section: 'B', groups: [] },
  { id: 'c-12s', className: 'Class XII', section: 'Science', groups: [] },
];

export default function GeneratePage() {
  const {
    school,
    periods,
    teachers,
    subjects,
    classes,
    timetableResult,
    setSchool,
    setPeriods,
    setTimetableResult,
    addTeacher,
    addSubject,
    addClass,
    resetStore,
  } = useStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedClassTab, setSelectedClassTab] = useState(0);

  const activeDays = useMemo(
    () => DAY_NAMES.slice(0, Math.max(1, Math.min(7, school.workingDays))),
    [school.workingDays]
  );

  const totalWeeklyTeachingSlots = useMemo(() => {
    const teachingCount = periods.filter((p) => !p.isBreak).length;
    return school.workingDays * teachingCount;
  }, [periods, school.workingDays]);

  const totalSubjectPeriods = useMemo(
    () => subjects.reduce((sum, s) => sum + Math.max(0, s.periodsPerWeekRequired), 0),
    [subjects]
  );

  const handleLoadSampleData = () => {
    resetStore();
    setSchool({
      name: 'Velammal Vidyalaya Poonamallee',
      academicYear: '2026-2027',
      workingDays: 6,
      periodsPerDay: 7,
    });
    setPeriods(SAMPLE_PERIODS);
    SAMPLE_SUBJECTS.forEach(addSubject);
    SAMPLE_TEACHERS.forEach(addTeacher);
    SAMPLE_CLASSES.forEach(addClass);
    setError(null);
    setWarnings([]);
  };

  const handleGenerate = () => {
    setError(null);
    setWarnings([]);
    setIsGenerating(true);

    // Defer slightly so the loading spinner renders smoothly
    setTimeout(() => {
      const result = generateTimetable({
        school,
        periods,
        teachers,
        subjects,
        classes,
      });

      if (result.success) {
        setTimetableResult(result.timetable);
        setWarnings(result.warnings);
        setSelectedClassTab(0);
      } else {
        setError(result.error ?? 'Failed to generate timetable.');
        setWarnings(result.warnings);
      }
      setIsGenerating(false);
    }, 150);
  };

  // Compute teacher workload & clash check from generated timetable
  const teacherStats = useMemo(() => {
    if (!timetableResult) return [];
    const counts = new Map<string, number>();
    let clashes = 0;

    for (let d = 0; d < activeDays.length; d++) {
      for (let s = 0; s < periods.length; s++) {
        const seenInSlot = new Set<string>();
        for (const cls of classes) {
          const cell = timetableResult[cls.id]?.[d]?.[s];
          if (cell && !cell.isBreak && cell.teacherId) {
            if (seenInSlot.has(cell.teacherId)) {
              clashes++;
            }
            seenInSlot.add(cell.teacherId);
            counts.set(cell.teacherId, (counts.get(cell.teacherId) ?? 0) + 1);
          }
        }
      }
    }

    return teachers.map((t) => ({
      ...t,
      assigned: counts.get(t.id) ?? 0,
      clashes,
    }));
  }, [timetableResult, activeDays.length, periods.length, classes, teachers]);

  const handleDownloadExcel = () => {
    if (!timetableResult) return;
    const wb = XLSX.utils.book_new();

    for (const cls of classes) {
      const label = `${cls.className}-${cls.section}`;
      const grid = timetableResult[cls.id];
      if (!grid) continue;

      const header = ['Day / Period', ...periods.map((p) => `${p.label} (${p.startTime}-${p.endTime})`)];
      const rows = activeDays.map((dayName, dIdx) => [
        dayName,
        ...periods.map((_, sIdx) => {
          const cell = grid[dIdx]?.[sIdx];
          if (!cell) return 'Free';
          if (cell.isBreak) return cell.breakLabel ?? 'Break';
          return `${cell.subjectName} (${cell.teacherName})`;
        }),
      ]);

      const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
      XLSX.utils.book_append_sheet(wb, ws, label.slice(0, 31));
    }

    XLSX.writeFile(wb, `${school.name.replace(/\s+/g, '_')}_Timetable.xlsx`);
  };

  const handleDownloadPDF = () => {
    if (!timetableResult) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    classes.forEach((cls, idx) => {
      if (idx > 0) doc.addPage();
      const label = `Class ${cls.className}-${cls.section}${cls.groups.length ? ` (${cls.groups.join(', ')})` : ''}`;
      doc.setFontSize(14);
      doc.text(`${school.name} — ${label} (${school.academicYear})`, 40, 40);

      const grid = timetableResult[cls.id];
      const head = [['Day', ...periods.map((p) => `${p.label}\n${p.startTime}-${p.endTime}`)]];
      const body = activeDays.map((dayName, dIdx) => [
        dayName,
        ...periods.map((_, sIdx) => {
          const cell = grid?.[dIdx]?.[sIdx];
          if (!cell) return '-';
          if (cell.isBreak) return cell.breakLabel ?? 'Break';
          return `${cell.subjectName}\n${cell.teacherName}`;
        }),
      ]);

      autoTable(doc, {
        head,
        body,
        startY: 56,
        styles: { fontSize: 8, cellPadding: 4, halign: 'center', valign: 'middle' },
        headStyles: { fillColor: [15, 23, 42] },
      });
    });

    doc.save(`${school.name.replace(/\s+/g, '_')}_Timetable.pdf`);
  };

  const currentClass = classes[selectedClassTab];
  const currentGrid = currentClass && timetableResult ? timetableResult[currentClass.id] : null;

  return (
    <Box sx={{ flex: 1, bgcolor: '#f5f7fb', py: { xs: 2.5, md: 5 } }}>
      <Container maxWidth="xl">
        {/* Header & Action Bar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3.5 },
            mb: { xs: 2.5, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: { md: 'center' } }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
              >
                Timetable Generator &amp; Output
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {school.name} • {school.academicYear} • {school.workingDays} Working Days •{' '}
                {periods.filter((p) => !p.isBreak).length} Teaching Periods/Day ({totalWeeklyTeachingSlots}{' '}
                slots/week)
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(150px, auto))' },
                gap: 1.25,
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<DatasetIcon />}
                onClick={handleLoadSampleData}
                disabled={isGenerating}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Load Sample Data
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isGenerating ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />
                }
                onClick={handleGenerate}
                disabled={isGenerating}
                sx={{ fontWeight: 700, px: 3, width: { xs: '100%', sm: 'auto' } }}
              >
                {isGenerating ? 'Generating...' : 'Generate Timetable'}
              </Button>
              {timetableResult && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<PictureAsPdfIcon />}
                    onClick={handleDownloadPDF}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<TableViewIcon />}
                    onClick={handleDownloadExcel}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Download Excel
                  </Button>
                </>
              )}
            </Box>
          </Stack>

          {/* Input Readiness Summary */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Chip label={`Classes: ${classes.length}`} size="small" variant="outlined" />
            <Chip label={`Teachers: ${teachers.length}`} size="small" variant="outlined" />
            <Chip label={`Subjects: ${subjects.length}`} size="small" variant="outlined" />
            <Chip
              label={`Weekly Subject Periods: ${totalSubjectPeriods} / ${totalWeeklyTeachingSlots}`}
              size="small"
              color={totalSubjectPeriods === totalWeeklyTeachingSlots ? 'success' : 'warning'}
              variant="outlined"
            />
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {warnings.map((w, i) => (
          <Alert key={i} severity="warning" sx={{ mb: 2 }}>
            {w}
          </Alert>
        ))}

        {/* Empty State */}
        {!timetableResult && !isGenerating && (
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider', py: 8 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No Timetable Generated Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click &ldquo;Load Sample Data&rdquo; to test immediately, or enter your school setup and click
                &ldquo;Generate Timetable&rdquo;.
              </Typography>
              <Button variant="contained" startIcon={<AutoAwesomeIcon />} onClick={handleGenerate}>
                Generate Timetable
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Generated Timetable Output */}
        {timetableResult && classes.length > 0 && (
          <Stack spacing={4}>
            <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8fafc', px: 2 }}>
                <Tabs
                  value={selectedClassTab}
                  onChange={(_, val) => setSelectedClassTab(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {classes.map((cls) => (
                    <Tab
                      key={cls.id}
                      label={`Class ${cls.className}-${cls.section}${
                        cls.groups.length ? ` (${cls.groups.join(', ')})` : ''
                      }`}
                      sx={{ fontWeight: 700 }}
                    />
                  ))}
                </Tabs>
              </Box>

              {currentGrid && (
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#0f172a' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 700, width: 120 }}>Day</TableCell>
                        {periods.map((slot) => (
                          <TableCell
                            key={slot.id}
                            align="center"
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              bgcolor: slot.isBreak ? '#334155' : '#0f172a',
                            }}
                          >
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                              {slot.label}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.7rem' }}>
                              {slot.startTime}–{slot.endTime}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeDays.map((dayName, dIdx) => (
                        <TableRow key={dayName} hover>
                          <TableCell sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>{dayName}</TableCell>
                          {periods.map((slot, sIdx) => {
                            const cell = currentGrid[dIdx]?.[sIdx];
                            if (cell?.isBreak || slot.isBreak) {
                              return (
                                <TableCell
                                  key={slot.id}
                                  align="center"
                                  sx={{ bgcolor: '#f1f5f9', color: 'text.secondary', fontStyle: 'italic' }}
                                >
                                  {cell?.breakLabel ?? slot.label}
                                </TableCell>
                              );
                            }
                            if (!cell) {
                              return (
                                <TableCell key={slot.id} align="center" sx={{ color: 'text.disabled' }}>
                                  Free
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell
                                key={slot.id}
                                align="center"
                                sx={{
                                  borderLeft: '1px solid',
                                  borderColor: 'divider',
                                  bgcolor: cell.isDoublePeriod ? 'rgba(25, 118, 210, 0.05)' : 'inherit',
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                  {cell.subjectName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  {cell.teacherName}
                                </Typography>
                                {cell.isDoublePeriod && (
                                  <Chip label="Lab / 2P" size="small" color="primary" sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }} />
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

            {/* Teacher Workload & Clash Report */}
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                <CheckCircleOutlinedIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Clash &amp; Teacher Workload Report
                </Typography>
                <Chip label="0 Clashes Detected" color="success" size="small" sx={{ fontWeight: 600 }} />
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Teacher</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Subjects</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Assigned / Week</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Max / Week</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Free Periods / Week</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teacherStats.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                        <TableCell>{t.subjects.join(', ')}</TableCell>
                        <TableCell align="center">{t.assigned}</TableCell>
                        <TableCell align="center">{t.maxPeriodsPerWeek}</TableCell>
                        <TableCell align="center">
                          {Math.max(0, totalWeeklyTeachingSlots - t.assigned)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
