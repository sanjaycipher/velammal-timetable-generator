'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
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
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  classes as SCHOOL_CLASSES,
  coachingClass,
  DAYS,
  drtSchedule,
  guidelines,
  indexItems,
  labTimetables,
  periods,
  secClassTimeIX,
  secClassTimeX,
  subjectPeriodAllocation,
  TeacherAllotment,
  teacherFreeTime,
  teachers as INITIAL_TEACHERS,
  teacherTimetables,
} from '@/data/schoolData';

interface TeacherRow extends TeacherAllotment {
  classesText: string;
}

interface TimetableCell {
  subject: string;
  teacher: string;
}

type TimetableGrid = Record<string, (TimetableCell | null)[][]>;

interface AssignmentTask {
  teacher: string;
  subject: string;
  className: string;
  priority: number;
}

const NUM_DAYS = DAYS.length; // 6 (Monday - Saturday)
const NUM_PERIODS = 7; // Period 1 - Period 7
const emptySubscribe = () => () => {};

function buildTeacherTasks(rows: TeacherRow[]): AssignmentTask[] {
  const secondarySet = new Set(SCHOOL_CLASSES);
  const rawAllotments: { teacher: string; subject: string; className: string; count: number }[] = [];

  for (const row of rows) {
    const rowClasses = row.classesText
      .split(',')
      .map((c) => c.trim())
      .filter((c) => secondarySet.has(c));

    if (rowClasses.length === 0 || row.totalPeriods <= 0) {
      continue;
    }

    const isUnmodified =
      row.totalPeriods === row.secondaryPeriods ||
      (row.totalPeriods === INITIAL_TEACHERS.find((t) => t.id === row.id)?.totalPeriods &&
        rowClasses.join(',') === row.classes.filter((c) => secondarySet.has(c)).join(','));

    if (isUnmodified && Object.keys(row.perClassPeriods).length > 0) {
      for (const cls of rowClasses) {
        const count = row.perClassPeriods[cls] ?? 0;
        if (count > 0) {
          rawAllotments.push({
            teacher: row.name,
            subject: row.subject,
            className: cls,
            count,
          });
        }
      }
    } else {
      const base = Math.floor(row.totalPeriods / rowClasses.length);
      let rem = row.totalPeriods % rowClasses.length;
      for (const cls of rowClasses) {
        const count = base + (rem > 0 ? 1 : 0);
        if (rem > 0) rem--;
        if (count > 0) {
          rawAllotments.push({
            teacher: row.name,
            subject: row.subject,
            className: cls,
            count,
          });
        }
      }
    }
  }

  const teacherLoad = new Map<string, number>();
  const classLoad = new Map<string, number>();

  for (const a of rawAllotments) {
    teacherLoad.set(a.teacher, (teacherLoad.get(a.teacher) || 0) + a.count);
    classLoad.set(a.className, (classLoad.get(a.className) || 0) + a.count);
  }

  const maxSlots = NUM_DAYS * NUM_PERIODS;
  for (const [teacher, total] of teacherLoad.entries()) {
    if (total > maxSlots) {
      throw new Error(
        `Teacher "${teacher}" has ${total} periods, exceeding the ${maxSlots} weekly slots (6 days x 7 periods).`
      );
    }
  }
  for (const [cls, total] of classLoad.entries()) {
    if (total > maxSlots) {
      throw new Error(
        `Class "${cls}" has ${total} periods assigned, exceeding the ${maxSlots} weekly slots (6 days x 7 periods).`
      );
    }
  }

  const tasks: AssignmentTask[] = [];
  for (const a of rawAllotments) {
    const priority = (teacherLoad.get(a.teacher) || 0) + (classLoad.get(a.className) || 0);
    for (let i = 0; i < a.count; i++) {
      tasks.push({
        teacher: a.teacher,
        subject: a.subject,
        className: a.className,
        priority,
      });
    }
  }

  tasks.sort((a, b) => b.priority - a.priority);
  return tasks;
}

function solveTimetableClient(rows: TeacherRow[]): {
  grid: TimetableGrid;
  totalScheduled: number;
} {
  const tasks = buildTeacherTasks(rows);

  const teacherBusy = new Map<string, boolean[][]>();
  const classGrid: TimetableGrid = {};
  const subjectDayCount = new Map<string, Map<string, number[]>>();

  for (const cls of SCHOOL_CLASSES) {
    classGrid[cls] = Array.from({ length: NUM_DAYS }, () =>
      Array<TimetableCell | null>(NUM_PERIODS).fill(null)
    );
    subjectDayCount.set(cls, new Map());
  }

  for (const t of tasks) {
    if (!teacherBusy.has(t.teacher)) {
      teacherBusy.set(
        t.teacher,
        Array.from({ length: NUM_DAYS }, () => Array<boolean>(NUM_PERIODS).fill(false))
      );
    }
  }

  const startTime = performance.now();
  const TIME_LIMIT_MS = 3500;
  let steps = 0;
  let timedOut = false;

  const getSubjDay = (cls: string, subj: string, day: number) =>
    subjectDayCount.get(cls)?.get(subj)?.[day] ?? 0;

  const addSubjDay = (cls: string, subj: string, day: number, delta: number) => {
    const map = subjectDayCount.get(cls)!;
    if (!map.has(subj)) {
      map.set(subj, Array(NUM_DAYS).fill(0));
    }
    map.get(subj)![day] += delta;
  };

  function backtrack(idx: number): boolean {
    if (idx === tasks.length) return true;
    if ((++steps & 1023) === 0 && performance.now() - startTime > TIME_LIMIT_MS) {
      timedOut = true;
      return false;
    }

    const task = tasks[idx];
    const tBusy = teacherBusy.get(task.teacher)!;
    const cGrid = classGrid[task.className];

    const candidates: { d: number; p: number; sameDay: number }[] = [];
    for (let d = 0; d < NUM_DAYS; d++) {
      const sameDay = getSubjDay(task.className, task.subject, d);
      for (let p = 0; p < NUM_PERIODS; p++) {
        if (!tBusy[d][p] && cGrid[d][p] === null) {
          candidates.push({ d, p, sameDay });
        }
      }
    }

    if (candidates.length === 0) return false;

    candidates.sort((a, b) => {
      if (a.sameDay !== b.sameDay) return a.sameDay - b.sameDay;
      if (a.p !== b.p) return a.p - b.p;
      return a.d - b.d;
    });

    for (const { d, p } of candidates) {
      tBusy[d][p] = true;
      cGrid[d][p] = { subject: task.subject, teacher: task.teacher };
      addSubjDay(task.className, task.subject, d, 1);

      if (backtrack(idx + 1)) return true;

      tBusy[d][p] = false;
      cGrid[d][p] = null;
      addSubjDay(task.className, task.subject, d, -1);
      if (timedOut) return false;
    }

    return false;
  }

  const ok = backtrack(0);
  if (!ok) {
    throw new Error(
      timedOut
        ? 'Timetable solver timed out. Please adjust teacher period allotments and try again.'
        : 'Could not find a conflict-free timetable with the current teacher allotments.'
    );
  }

  return { grid: classGrid, totalScheduled: tasks.length };
}

const INDEX_TO_TAB: Record<number, number> = {
  1: 1, // Guidelines
  2: 2, // Period Allotment
  3: 3, // Teacher Allotment
  4: 4, // Class Timetables
  5: 5, // Teacher Timetables
  6: 6, // Lab Timetables
  7: 10, // Single Sheet / Generated AI Timetable
  8: 7, // DRT Schedule
  9: 8, // Coaching Class
  10: 9, // Free Timetable
};

export default function HomePage() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<number>(0);
  const [classSubTab, setClassSubTab] = useState<number>(0);
  const [teacherSubTab, setTeacherSubTab] = useState<number>(0);
  const [labSubTab, setLabSubTab] = useState<number>(0);

  const [teacherRows, setTeacherRows] = useState<TeacherRow[]>(() =>
    INITIAL_TEACHERS.map((t) => ({
      ...t,
      classesText: t.classes.join(', '),
    }))
  );
  const [timetable, setTimetable] = useState<TimetableGrid | null>(null);
  const [totalScheduled, setTotalScheduled] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<string>(SCHOOL_CLASSES[0]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data: { authenticated?: boolean; username?: string }) => {
        if (!cancelled) {
          setAuthenticatedUser(data.authenticated ? data.username || 'admin' : null);
          setAuthChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthenticatedUser(null);
          setAuthChecked(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = (await res.json()) as { authenticated?: boolean; username?: string; error?: string };
      if (!res.ok || !data.authenticated) {
        setLoginError(data.error || 'Invalid username or password.');
        return;
      }
      setAuthenticatedUser(data.username || loginUsername);
      setLoginPassword('');
    } catch {
      setLoginError('Unable to reach authentication server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticatedUser(null);
    setLoginUsername('');
    setLoginPassword('');
  };

  const teacherAllotmentColumns: GridColDef<TeacherRow>[] = [
    { field: 'id', headerName: 'S.No', width: 70 },
    { field: 'name', headerName: 'Teacher Name', flex: 1.4, minWidth: 210 },
    { field: 'subject', headerName: 'Subject', flex: 1, minWidth: 160, editable: true },
    {
      field: 'classesText',
      headerName: 'Classes Allotted',
      flex: 1.2,
      minWidth: 180,
      editable: true,
    },
    {
      field: 'totalPeriods',
      headerName: 'Total Periods',
      type: 'number',
      width: 130,
      editable: true,
    },
    {
      field: 'allotmentNote',
      headerName: 'Excel Breakdown',
      flex: 1.4,
      minWidth: 220,
    },
  ];

  const freeTimeColumns: GridColDef[] = [
    { field: 'sno', headerName: 'S.No', width: 65 },
    { field: 'name', headerName: 'Name of the Teacher', flex: 1.2, minWidth: 180 },
    { field: 'subject', headerName: 'Subject', flex: 0.9, minWidth: 140 },
    { field: 'classesHandling', headerName: 'Classes Handling', flex: 1.3, minWidth: 200 },
    { field: 'monday', headerName: 'Monday', flex: 0.8, minWidth: 115 },
    { field: 'tuesday', headerName: 'Tuesday', flex: 0.8, minWidth: 115 },
    { field: 'wednesday', headerName: 'Wednesday', flex: 0.8, minWidth: 115 },
    { field: 'thursday', headerName: 'Thursday', flex: 0.8, minWidth: 115 },
    { field: 'friday', headerName: 'Friday', flex: 0.8, minWidth: 115 },
    { field: 'saturday', headerName: 'Saturday', flex: 0.8, minWidth: 115 },
  ];

  const handleProcessRowUpdate = (updatedRow: TeacherRow) => {
    const sanitizedPeriods = Math.max(0, Number(updatedRow.totalPeriods) || 0);
    const nextRow: TeacherRow = {
      ...updatedRow,
      totalPeriods: sanitizedPeriods,
    };
    setTeacherRows((prev) => prev.map((r) => (r.id === nextRow.id ? nextRow : r)));
    return nextRow;
  };

  const handleGenerateTimetable = () => {
    setError('');
    try {
      const { grid, totalScheduled: count } = solveTimetableClient(teacherRows);
      setTimetable(grid);
      setTotalScheduled(count);
      setActiveTab(10); // Automatically switch to Tab 11 (Generated AI Timetable)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate timetable.');
    }
  };

  const handleDownloadExcel = () => {
    if (!timetable) return;
    const wb = XLSX.utils.book_new();

    for (const cls of SCHOOL_CLASSES) {
      const classGrid = timetable[cls];
      const header = ['Day', ...Array.from({ length: NUM_PERIODS }, (_, i) => `Period ${i + 1}`)];
      const body = DAYS.map((day, dIdx) => [
        day,
        ...classGrid[dIdx].map((cell) =>
          cell ? `${cell.subject}\n(${cell.teacher})` : 'Free'
        ),
      ]);

      const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
      ws['!cols'] = [{ wch: 14 }, ...Array(NUM_PERIODS).fill({ wch: 24 })];
      XLSX.utils.book_append_sheet(wb, ws, cls);
    }

    XLSX.writeFile(wb, 'Velammal_Timetable.xlsx');
  };

  const handleDownloadPDF = () => {
    if (!timetable) return;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    SCHOOL_CLASSES.forEach((cls, idx) => {
      if (idx > 0) doc.addPage();
      doc.setFontSize(14);
      doc.text(`Velammal Vidyalaya Poonamallee - Class ${cls} Timetable (2026-27)`, 40, 40);

      const head = [['Day', ...Array.from({ length: NUM_PERIODS }, (_, i) => `Period ${i + 1}`)]];
      const body = DAYS.map((day, dIdx) => [
        day,
        ...timetable[cls][dIdx].map((cell) =>
          cell ? `${cell.subject}\n${cell.teacher}` : 'Free'
        ),
      ]);

      autoTable(doc, {
        startY: 56,
        head,
        body,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 5, halign: 'center', valign: 'middle' },
        headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', halign: 'left', fillColor: [245, 247, 251] } },
      });
    });

    doc.save('Velammal_Timetable.pdf');
  };

  if (!mounted) {
    return null;
  }

  if (!authChecked) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f7fb',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticatedUser) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f7fb',
          px: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '100%', borderRadius: 3 }}>
          <Stack spacing={2.5} component="form" onSubmit={handleLogin}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <LockOutlinedIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Velammal Vidyalaya
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access the Timetable Generator
              </Typography>
            </Box>

            {loginError && (
              <Alert severity="error" onClose={() => setLoginError('')}>
                {loginError}
              </Alert>
            )}

            <TextField
              label="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              fullWidth
              required
              autoFocus
              autoComplete="username"
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loginLoading}
              sx={{ fontWeight: 700, py: 1.25 }}
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  const currentIXClass = classSubTab < 3 ? secClassTimeIX[classSubTab] : null;
  const currentXClass = classSubTab >= 3 ? secClassTimeX[classSubTab - 3] : null;
  const currentTeacherSheet = teacherTimetables[teacherSubTab];
  const currentLabSheet = labTimetables[labSubTab];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Velammal Vidyalaya - Timetable Generator
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Poonamallee • Secondary Compartment (IX &amp; X) • 2026–27
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Chip
              label={authenticatedUser}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 600 }}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerateTimetable}
              sx={{ fontWeight: 700, px: 3 }}
            >
              Generate Timetable
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white', px: 1 }}
          >
            <Tab label="1. Index" sx={{ fontWeight: 600 }} />
            <Tab label="2. Guidelines" sx={{ fontWeight: 600 }} />
            <Tab label="3. Period Allotment" sx={{ fontWeight: 600 }} />
            <Tab label="4. Teacher Allotment" sx={{ fontWeight: 600 }} />
            <Tab label="5. Class Timetables" sx={{ fontWeight: 600 }} />
            <Tab label="6. Teacher Timetables" sx={{ fontWeight: 600 }} />
            <Tab label="7. Lab Timetables" sx={{ fontWeight: 600 }} />
            <Tab label="8. DRT Schedule" sx={{ fontWeight: 600 }} />
            <Tab label="9. Coaching Class" sx={{ fontWeight: 600 }} />
            <Tab label="10. Free Timetable" sx={{ fontWeight: 600 }} />
            <Tab label="11. Generated AI Timetable" sx={{ fontWeight: 700, color: 'secondary.main' }} />
          </Tabs>

          {/* Tab 1: Index */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Velammal Vidyalaya Poonamallee — Secondary Compartment Index (2026–27)
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700, width: 90 }}>
                        S.No
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>Particulars</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, width: 160 }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {indexItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{item.sno}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.particulars}
                          </Typography>
                          {item.subItems && (
                            <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap' }} useFlexGap>
                              {item.subItems.map((sub, idx) => (
                                <Chip
                                  key={sub}
                                  label={sub}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => {
                                    setClassSubTab(idx);
                                    setActiveTab(4);
                                  }}
                                />
                              ))}
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setActiveTab(INDEX_TO_TAB[item.id] ?? 0)}
                          >
                            Open Sheet
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 2: Guidelines */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                13. Guidelines for Class Time Table (17 Rules)
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700, width: 70 }}>
                        S.No
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>Guideline</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, width: 140 }}>
                        Remarks
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {guidelines.map((g) => (
                      <TableRow key={g.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{g.id}</TableCell>
                        <TableCell>{g.rule}</TableCell>
                        <TableCell>
                          <Chip
                            label={g.remarks}
                            color={g.remarks === 'FOLLOWED' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 3: Period Allotment */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                    Secondary Time Slots &amp; Period Allotment
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Slot</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Time</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {periods.map((slot) => (
                          <TableRow key={slot.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{slot.label}</TableCell>
                            <TableCell>{slot.time}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  slot.isTeachingPeriod ? 'Teaching Period' : 'Break / Non-Teaching'
                                }
                                color={slot.isTeachingPeriod ? 'primary' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                    CBSE Subject-Wise Period Allocation (1 HR Slots)
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Subject</TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            IX (1 HR)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            X (1 HR)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subjectPeriodAllocation.map((row) => (
                          <TableRow
                            key={row.id}
                            hover
                            sx={
                              row.subject === 'TOTAL'
                                ? { bgcolor: 'grey.100', fontWeight: 700 }
                                : undefined
                            }
                          >
                            <TableCell sx={{ fontWeight: row.subject === 'TOTAL' ? 700 : 600 }}>
                              {row.subject}
                            </TableCell>
                            <TableCell align="center">{row.ixHours}</TableCell>
                            <TableCell align="center">{row.xHours}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Tab 4: Teacher Allotment (Editable) */}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{
                  mb: 2,
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
                spacing={1}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  SEC - Teacher Allotment (Double-click cells to edit)
                </Typography>
                <Chip
                  label={`${teacherRows.length} Teachers • ${teacherRows.reduce(
                    (acc, r) => acc + r.totalPeriods,
                    0
                  )} Total Periods`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Box sx={{ height: 580, width: '100%' }}>
                <DataGrid
                  rows={teacherRows}
                  columns={teacherAllotmentColumns}
                  processRowUpdate={handleProcessRowUpdate}
                  onProcessRowUpdateError={(err) => setError(String(err))}
                  pageSizeOptions={[18, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 18, page: 0 } },
                  }}
                  disableRowSelectionOnClick
                />
              </Box>
            </Box>
          )}

          {/* Tab 5: Class Timetables (Raw Excel Layout for IX A-C & X A-C) */}
          {activeTab === 4 && (
            <Box sx={{ p: 3 }}>
              <Tabs
                value={classSubTab}
                onChange={(_e, v) => setClassSubTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="IX A" sx={{ fontWeight: 600 }} />
                <Tab label="IX B" sx={{ fontWeight: 600 }} />
                <Tab label="IX C" sx={{ fontWeight: 600 }} />
                <Tab label="X A" sx={{ fontWeight: 600 }} />
                <Tab label="X B" sx={{ fontWeight: 600 }} />
                <Tab label="X C" sx={{ fontWeight: 600 }} />
              </Tabs>

              {currentIXClass && (
                <Box>
                  <Stack
                    direction="row"
                    sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Class {currentIXClass.className} — Raw Excel Timetable
                    </Typography>
                    <Chip
                      label={`Class Teacher: ${currentIXClass.classTeacher}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" sx={{ minWidth: 1200 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Day</TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Zero Period / DRT (8.30–9.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 1 (9.00–10.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 2 (10.00–11.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Break (11.00–11.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 3 (11.15–12.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 4 (12.15–1.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Lunch (1.15–1.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 5 (1.45–2.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 6 (2.45–3.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Coaching Class (3.45–4.45)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentIXClass.rows.map((r) => (
                          <TableRow key={r.day} hover>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{r.day}</TableCell>
                            <TableCell align="center">{r.zero}</TableCell>
                            <TableCell align="center">{r.p1}</TableCell>
                            <TableCell align="center">{r.p2}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              BREAK
                            </TableCell>
                            <TableCell align="center">{r.p3}</TableCell>
                            <TableCell align="center">{r.p4}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              LUNCH
                            </TableCell>
                            <TableCell align="center">{r.p5}</TableCell>
                            <TableCell align="center">{r.p6}</TableCell>
                            <TableCell align="center">{r.coaching}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {currentXClass && (
                <Box>
                  <Stack
                    direction="row"
                    sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Class {currentXClass.className} — Raw Excel Timetable
                    </Typography>
                    <Chip
                      label={`Class Teacher: ${currentXClass.classTeacher}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" sx={{ minWidth: 1400 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Day</TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Zero Period / DRT (8.30–9.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 1 (9.00–10.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 2 (10.00–11.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Break (11.00–11.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 3 (11.15–12.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 4 (12.15–1.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Lunch (1.15–1.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 5 (1.45–2.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 6 (2.45–3.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Break (3.45–4.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 7 (4.00–4.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Coaching Class (4.45–5.45)
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentXClass.rows.map((r) => (
                          <TableRow key={r.day} hover>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{r.day}</TableCell>
                            <TableCell align="center">{r.zero}</TableCell>
                            <TableCell align="center">{r.p1}</TableCell>
                            <TableCell align="center">{r.p2}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              BREAK
                            </TableCell>
                            <TableCell align="center">{r.p3}</TableCell>
                            <TableCell align="center">{r.p4}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              LUNCH
                            </TableCell>
                            <TableCell align="center">{r.p5}</TableCell>
                            <TableCell align="center">{r.p6}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              BREAK
                            </TableCell>
                            <TableCell align="center">{r.p7}</TableCell>
                            <TableCell align="center">{r.coaching}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}

          {/* Tab 6: Teacher Timetables */}
          {activeTab === 5 && (
            <Box sx={{ p: 3 }}>
              <Tabs
                value={teacherSubTab}
                onChange={(_e, v) => setTeacherSubTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                {teacherTimetables.map((t) => (
                  <Tab key={t.id} label={t.name} sx={{ fontWeight: 600 }} />
                ))}
              </Tabs>

              {currentTeacherSheet && (
                <Box>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                      mb: 2,
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                    }}
                    spacing={1}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {currentTeacherSheet.name}
                    </Typography>
                    <Chip
                      label={currentTeacherSheet.subjectInfo}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" sx={{ minWidth: 1100 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Day</TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Zero / DRT (8.30–9.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 1 (9.00–10.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 2 (10.00–11.00)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Break
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 3 (11.15–12.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 4 (12.15–1.15)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700, bgcolor: 'warning.dark' }}>
                            Lunch
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 5 (1.45–2.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 6 (2.45–3.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 7 (4.00–4.45)
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Free Periods
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentTeacherSheet.rows.map((r) => (
                          <TableRow key={r.day} hover>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{r.day}</TableCell>
                            <TableCell align="center">{r.zero || '-'}</TableCell>
                            <TableCell align="center">{r.p1 || '-'}</TableCell>
                            <TableCell align="center">{r.p2 || '-'}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              BREAK
                            </TableCell>
                            <TableCell align="center">{r.p3 || '-'}</TableCell>
                            <TableCell align="center">{r.p4 || '-'}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: '#fff8e1', fontWeight: 700, color: 'warning.dark' }}>
                              LUNCH
                            </TableCell>
                            <TableCell align="center">{r.p5 || '-'}</TableCell>
                            <TableCell align="center">{r.p6 || '-'}</TableCell>
                            <TableCell align="center">{r.p7 || '-'}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                              {r.freePeriods || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}

          {/* Tab 7: Lab Timetables */}
          {activeTab === 6 && (
            <Box sx={{ p: 3 }}>
              <Tabs
                value={labSubTab}
                onChange={(_e, v) => setLabSubTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                {labTimetables.map((lab) => (
                  <Tab key={lab.id} label={lab.labName} sx={{ fontWeight: 600 }} />
                ))}
              </Tabs>

              {currentLabSheet && (
                <Box>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                      mb: 2,
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                    }}
                    spacing={1}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {currentLabSheet.labName}
                    </Typography>
                    <Chip
                      label={`In-Charge: ${currentLabSheet.teacherName}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" sx={{ minWidth: 950 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700 }}>Day</TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Zero / DRT
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 1
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 2
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 3
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 4
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 5
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 6
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>
                            Period 7
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentLabSheet.rows.map((r) => (
                          <TableRow key={r.day} hover>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{r.day}</TableCell>
                            <TableCell align="center">{r.zero || '-'}</TableCell>
                            <TableCell align="center">{r.p1 || '-'}</TableCell>
                            <TableCell align="center">{r.p2 || '-'}</TableCell>
                            <TableCell align="center">{r.p3 || '-'}</TableCell>
                            <TableCell align="center">{r.p4 || '-'}</TableCell>
                            <TableCell align="center">{r.p5 || '-'}</TableCell>
                            <TableCell align="center">{r.p6 || '-'}</TableCell>
                            <TableCell align="center">{r.p7 || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}

          {/* Tab 8: DRT Schedule */}
          {activeTab === 7 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Grade IX &amp; X — DRT Schedule (Zero Period: 8.30 AM – 9.00 AM)
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small" sx={{ minWidth: 950 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>S.No</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>Day</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>X A</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>X B</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>X C</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>IX A</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>IX B</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>IX C</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {drtSchedule.map((row) => (
                      <TableRow key={row.sno} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{row.sno}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{row.day}</TableCell>
                        <TableCell align="center">{row.xa}</TableCell>
                        <TableCell align="center">{row.xb}</TableCell>
                        <TableCell align="center">{row.xc}</TableCell>
                        <TableCell align="center">{row.ixa}</TableCell>
                        <TableCell align="center">{row.ixb}</TableCell>
                        <TableCell align="center">{row.ixc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Alert severity="info">
                *FOR GRADE - 10, ENGLISH / II LANGUAGE MUST BE CONDUCTED DURING CLASS HOURS.
              </Alert>
            </Box>
          )}

          {/* Tab 9: Coaching Class */}
          {activeTab === 8 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                After-School Coaching Class Schedule
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700, width: 70 }}>
                        S.No
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700, width: 140 }}>
                        Day
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>Grade X</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>Grade IX</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coachingClass.map((row) => (
                      <TableRow key={row.sno} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{row.sno}</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{row.day}</TableCell>
                        <TableCell>{row.gradeX}</TableCell>
                        <TableCell>{row.gradeIX}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 10: Free Timetable (DataGrid) */}
          {activeTab === 9 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                Free Period Timetable Matrix (2026–27)
              </Typography>
              <Box sx={{ height: 560, width: '100%' }}>
                <DataGrid
                  rows={teacherFreeTime}
                  columns={freeTimeColumns}
                  pageSizeOptions={[16, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 16, page: 0 } },
                  }}
                  disableRowSelectionOnClick
                />
              </Box>
            </Box>
          )}

          {/* Tab 11: Generated AI Timetable */}
          {activeTab === 10 && (
            <Box sx={{ p: 3 }}>
              {!timetable ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No AI timetable generated yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Click &ldquo;Generate Timetable&rdquo; in the header to create a conflict-free
                    6&times;7 schedule for IX A – X C.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleGenerateTimetable}
                  >
                    Generate Timetable
                  </Button>
                </Box>
              ) : (
                <Stack spacing={3}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', md: 'center' },
                    }}
                    spacing={2}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Generated AI Timetable (6 Days &times; 7 Periods)
                      </Typography>
                      <Chip
                        label={`${totalScheduled} Periods Scheduled`}
                        color="success"
                        size="small"
                      />
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleDownloadPDF}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<TableViewIcon />}
                        onClick={handleDownloadExcel}
                      >
                        Download Excel
                      </Button>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    {SCHOOL_CLASSES.map((cls) => (
                      <Chip
                        key={cls}
                        label={`Class ${cls}`}
                        color={selectedClass === cls ? 'primary' : 'default'}
                        variant={selectedClass === cls ? 'filled' : 'outlined'}
                        onClick={() => setSelectedClass(cls)}
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                  </Stack>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" sx={{ minWidth: 900 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 700, width: 120 }}>
                            Day
                          </TableCell>
                          {Array.from({ length: NUM_PERIODS }, (_, i) => (
                            <TableCell
                              key={i}
                              align="center"
                              sx={{ color: 'white', fontWeight: 700 }}
                            >
                              Period {i + 1}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {DAYS.map((day, dIdx) => (
                          <TableRow key={day} hover>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>
                              {day}
                            </TableCell>
                            {timetable[selectedClass][dIdx].map((cell, pIdx) => (
                              <TableCell key={pIdx} align="center" sx={{ py: 1.5 }}>
                                {cell ? (
                                  <>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                      {cell.subject}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {cell.teacher}
                                    </Typography>
                                  </>
                                ) : (
                                  <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={{ fontStyle: 'italic' }}
                                  >
                                    Free
                                  </Typography>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
