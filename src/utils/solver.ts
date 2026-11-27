import type {
  ClassTimetableGrid,
  PeriodSlot,
  SchoolClass,
  SchoolConfig,
  Subject,
  Teacher,
  TimetableCell,
  TimetableResult,
} from '@/store/useStore';

export interface SolverInput {
  school: SchoolConfig;
  periods: PeriodSlot[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: SchoolClass[];
}

export interface SolverResult {
  success: boolean;
  timetable: TimetableResult;
  warnings: string[];
  error?: string;
}

interface PlacementTask {
  id: number;
  classId: string;
  classIndex: number;
  classLabel: string;
  subject: Subject;
  duration: 1 | 2; // 2 = double period, 1 = single period
  eligibleTeachers: Teacher[];
}

interface CandidateMove {
  day: number;
  slotIdx: number;
  teacher: Teacher;
  score: number;
}

const MAX_BACKTRACK_STEPS = 40_000;

function isTeacherUnavailable(teacher: Teacher, day: number, slot: PeriodSlot): boolean {
  if (teacher.unavailablePeriods.length === 0) return false;
  const byId = `${day}-${slot.id}`;
  const byNum = `${day}-${slot.periodNumber}`;
  return teacher.unavailablePeriods.includes(byId) || teacher.unavailablePeriods.includes(byNum);
}

function findEligibleTeachers(subject: Subject, teachers: Teacher[]): Teacher[] {
  const targetName = subject.name.trim().toLowerCase();
  return teachers.filter((t) =>
    t.subjects.some(
      (s) => s.trim().toLowerCase() === targetName || s === subject.id
    )
  );
}

/**
 * Backtracking + Dynamic MRV + Swap-Repair timetable solver.
 * Satisfies hard constraints (no teacher/class clashes, exact weekly subject counts,
 * teacher unavailability, break exclusions, daily/weekly caps) and optimizes soft
 * constraints (double-period pairing, morning/last-period preferences, even daily spread).
 */
export function generateTimetable(data: SolverInput): SolverResult {
  const { school, periods, teachers, subjects, classes } = data;
  const warnings: string[] = [];

  const numDays = Math.max(1, school.workingDays);
  const numSlots = periods.length;

  if (classes.length === 0) {
    return { success: false, timetable: {}, warnings, error: 'No classes configured.' };
  }
  if (subjects.length === 0) {
    return { success: false, timetable: {}, warnings, error: 'No subjects configured.' };
  }
  if (teachers.length === 0) {
    return { success: false, timetable: {}, warnings, error: 'No teachers configured.' };
  }

  const teachingSlotIndices = periods
    .map((p, idx) => (p.isBreak ? -1 : idx))
    .filter((idx) => idx !== -1);

  if (teachingSlotIndices.length === 0) {
    return { success: false, timetable: {}, warnings, error: 'No non-break teaching periods configured.' };
  }

  const totalWeeklyTeachingSlots = numDays * teachingSlotIndices.length;

  const totalRequiredPerClass = subjects.reduce((sum, s) => sum + Math.max(0, s.periodsPerWeekRequired), 0);
  if (totalRequiredPerClass > totalWeeklyTeachingSlots) {
    return {
      success: false,
      timetable: {},
      warnings,
      error: `Subjects require ${totalRequiredPerClass} periods/week, which exceeds the ${totalWeeklyTeachingSlots} available teaching slots.`,
    };
  }

  // Build initial task list
  const buildTasks = (allowDouble: boolean): PlacementTask[] => {
    const list: PlacementTask[] = [];
    let nextId = 0;
    classes.forEach((cls, classIndex) => {
      const classLabel = `${cls.className}${cls.section ? `-${cls.section}` : ''}`;
      for (const subject of subjects) {
        const req = Math.max(0, subject.periodsPerWeekRequired);
        if (req === 0) continue;

        const eligibleTeachers = findEligibleTeachers(subject, teachers);
        if (allowDouble && subject.requiresDoublePeriod && req >= 2) {
          const doubleCount = Math.floor(req / 2);
          const remainder = req % 2;
          for (let i = 0; i < doubleCount; i++) {
            list.push({ id: nextId++, classId: cls.id, classIndex, classLabel, subject, duration: 2, eligibleTeachers });
          }
          if (remainder === 1) {
            list.push({ id: nextId++, classId: cls.id, classIndex, classLabel, subject, duration: 1, eligibleTeachers });
          }
        } else {
          for (let i = 0; i < req; i++) {
            list.push({ id: nextId++, classId: cls.id, classIndex, classLabel, subject, duration: 1, eligibleTeachers });
          }
        }
      }
    });
    return list;
  };

  for (const subject of subjects) {
    if (subject.periodsPerWeekRequired > 0 && findEligibleTeachers(subject, teachers).length === 0) {
      return {
        success: false,
        timetable: {},
        warnings,
        error: `No teacher is assigned to teach "${subject.name}".`,
      };
    }
  }

  const firstTeachingIdx = teachingSlotIndices[0];
  const lastTeachingIdx = teachingSlotIndices[teachingSlotIndices.length - 1];
  const midTeachingIdx = teachingSlotIndices[Math.floor(teachingSlotIndices.length / 2)];

  function runSolver(tasks: PlacementTask[]): { solved: boolean; grid: TimetableResult } {
    const grid: TimetableResult = {};
    for (const cls of classes) {
      const classGrid: ClassTimetableGrid = Array.from({ length: numDays }, () =>
        periods.map((slot) =>
          slot.isBreak
            ? {
                subjectId: 'BREAK',
                subjectName: slot.label,
                teacherId: '',
                teacherName: '',
                isBreak: true,
                breakLabel: slot.label,
              }
            : null
        )
      );
      grid[cls.id] = classGrid;
    }

    const teacherBusy: Set<string>[][] = Array.from({ length: numDays }, () =>
      Array.from({ length: numSlots }, () => new Set<string>())
    );
    const teacherDailyCount = new Map<string, number[]>();
    const teacherWeeklyCount = new Map<string, number>();
    for (const t of teachers) {
      teacherDailyCount.set(t.id, Array(numDays).fill(0));
      teacherWeeklyCount.set(t.id, 0);
    }

    const classSubjectDailyCount = new Map<string, number[]>();
    for (const cls of classes) {
      for (const sub of subjects) {
        classSubjectDailyCount.set(`${cls.id}:${sub.id}`, Array(numDays).fill(0));
      }
    }

    function scoreCandidate(
      task: PlacementTask,
      day: number,
      slotIdx: number,
      teacher: Teacher
    ): number {
      let score = 0;

      const pref = task.subject.preferredSlot ?? 'any';
      if (pref === 'morning') {
        if (slotIdx <= midTeachingIdx) score += 25;
        if (slotIdx === firstTeachingIdx) score += 10;
      } else if (pref === 'last') {
        if (slotIdx >= midTeachingIdx) score += 20;
        if (slotIdx === lastTeachingIdx) score += 15;
      }

      // Spread subject evenly across days
      const dailyKey = `${task.classId}:${task.subject.id}`;
      const existingOnDay = classSubjectDailyCount.get(dailyKey)?.[day] ?? 0;
      score -= existingOnDay * 35;

      // Balance teacher daily load
      const tDayLoad = teacherDailyCount.get(teacher.id)?.[day] ?? 0;
      score -= tDayLoad * 6;

      // Stagger classes slightly across days/slots to avoid artificial bottlenecks
      if ((day + task.classIndex) % numDays === 0) score += 2;

      return score;
    }

    function getCandidates(task: PlacementTask): CandidateMove[] {
      const candidates: CandidateMove[] = [];

      for (let day = 0; day < numDays; day++) {
        for (let i = 0; i < teachingSlotIndices.length; i++) {
          const slotIdx = teachingSlotIndices[i];
          const slot = periods[slotIdx];

          if (grid[task.classId][day][slotIdx] !== null) continue;

          if (task.duration === 2) {
            const nextSlotIdx = slotIdx + 1;
            if (nextSlotIdx >= numSlots) continue;
            const nextSlot = periods[nextSlotIdx];
            if (nextSlot.isBreak) continue;
            if (grid[task.classId][day][nextSlotIdx] !== null) continue;
          }

          for (const teacher of task.eligibleTeachers) {
            const weekly = teacherWeeklyCount.get(teacher.id) ?? 0;
            if (weekly + task.duration > teacher.maxPeriodsPerWeek) continue;

            const daily = teacherDailyCount.get(teacher.id)?.[day] ?? 0;
            if (daily + task.duration > teacher.maxPeriodsPerDay) continue;

            if (teacherBusy[day][slotIdx].has(teacher.id)) continue;
            if (isTeacherUnavailable(teacher, day, slot)) continue;

            if (task.duration === 2) {
              const nextSlotIdx = slotIdx + 1;
              const nextSlot = periods[nextSlotIdx];
              if (teacherBusy[day][nextSlotIdx].has(teacher.id)) continue;
              if (isTeacherUnavailable(teacher, day, nextSlot)) continue;
            }

            candidates.push({
              day,
              slotIdx,
              teacher,
              score: scoreCandidate(task, day, slotIdx, teacher),
            });
          }
        }
      }

      candidates.sort((a, b) => b.score - a.score);
      return candidates;
    }

    function place(task: PlacementTask, move: CandidateMove): void {
      const { day, slotIdx, teacher } = move;
      const cell: TimetableCell = {
        subjectId: task.subject.id,
        subjectName: task.subject.name,
        teacherId: teacher.id,
        teacherName: teacher.name,
        isDoublePeriod: task.duration === 2,
      };

      grid[task.classId][day][slotIdx] = cell;
      teacherBusy[day][slotIdx].add(teacher.id);

      if (task.duration === 2) {
        grid[task.classId][day][slotIdx + 1] = { ...cell };
        teacherBusy[day][slotIdx + 1].add(teacher.id);
      }

      teacherDailyCount.get(teacher.id)![day] += task.duration;
      teacherWeeklyCount.set(teacher.id, (teacherWeeklyCount.get(teacher.id) ?? 0) + task.duration);
      classSubjectDailyCount.get(`${task.classId}:${task.subject.id}`)![day] += task.duration;
    }

    function unplace(task: PlacementTask, move: CandidateMove): void {
      const { day, slotIdx, teacher } = move;

      grid[task.classId][day][slotIdx] = null;
      teacherBusy[day][slotIdx].delete(teacher.id);

      if (task.duration === 2) {
        grid[task.classId][day][slotIdx + 1] = null;
        teacherBusy[day][slotIdx + 1].delete(teacher.id);
      }

      teacherDailyCount.get(teacher.id)![day] -= task.duration;
      teacherWeeklyCount.set(teacher.id, (teacherWeeklyCount.get(teacher.id) ?? 0) - task.duration);
      classSubjectDailyCount.get(`${task.classId}:${task.subject.id}`)![day] -= task.duration;
    }

    // Dynamic MRV backtracking
    const placed = new Array<boolean>(tasks.length).fill(false);
    let placedCount = 0;
    let steps = 0;
    let aborted = false;

    function selectNextTask(): { task: PlacementTask; idx: number; candidates: CandidateMove[] } | null {
      let bestIdx = -1;
      let bestCandidates: CandidateMove[] = [];
      let minCount = Infinity;

      for (let i = 0; i < tasks.length; i++) {
        if (placed[i]) continue;
        const task = tasks[i];
        const cands = getCandidates(task);
        if (cands.length === 0) {
          return { task, idx: i, candidates: [] };
        }
        // Prioritize double-period tasks first when counts are tied
        const effectiveCount = task.duration === 2 ? cands.length - 0.5 : cands.length;
        if (effectiveCount < minCount) {
          minCount = effectiveCount;
          bestIdx = i;
          bestCandidates = cands;
          if (cands.length === 1) break;
        }
      }

      if (bestIdx === -1) return null;
      return { task: tasks[bestIdx], idx: bestIdx, candidates: bestCandidates };
    }

    function backtrack(): boolean {
      if (placedCount === tasks.length) return true;
      if (++steps > MAX_BACKTRACK_STEPS) {
        aborted = true;
        return false;
      }

      const next = selectNextTask();
      if (!next || next.candidates.length === 0) return false;

      const { task, idx, candidates } = next;
      placed[idx] = true;
      placedCount++;

      for (const move of candidates) {
        place(task, move);
        if (backtrack()) return true;
        unplace(task, move);
        if (aborted) break;
      }

      placed[idx] = false;
      placedCount--;
      return false;
    }

    if (backtrack()) {
      return { solved: true, grid };
    }

    // Phase 2: Constructive greedy + Swap-Repair fallback for single-period tasks
    // Reset state
    for (const cls of classes) {
      for (let d = 0; d < numDays; d++) {
        for (let s = 0; s < numSlots; s++) {
          if (!periods[s].isBreak) grid[cls.id][d][s] = null;
        }
      }
    }
    for (let d = 0; d < numDays; d++) {
      for (let s = 0; s < numSlots; s++) {
        teacherBusy[d][s].clear();
      }
    }
    for (const t of teachers) {
      teacherDailyCount.set(t.id, Array(numDays).fill(0));
      teacherWeeklyCount.set(t.id, 0);
    }
    for (const arr of classSubjectDailyCount.values()) {
      arr.fill(0);
    }

    // Order tasks: double periods first, then most constrained
    const orderedTasks = [...tasks].sort((a, b) => b.duration - a.duration);
    const unplacedTasks: PlacementTask[] = [];

    for (const task of orderedTasks) {
      const cands = getCandidates(task);
      if (cands.length > 0) {
        place(task, cands[0]);
      } else {
        unplacedTasks.push(task);
      }
    }

    // Attempt 1-swap repair for any unplaced single-period tasks
    for (let pass = 0; pass < 5 && unplacedTasks.length > 0; pass++) {
      for (let u = unplacedTasks.length - 1; u >= 0; u--) {
        const task = unplacedTasks[u];
        if (task.duration !== 1) continue;

        let repaired = false;
        // Find an empty slot in task.classId where the teacher is busy, or a slot where teacher is free
        for (let day = 0; day < numDays && !repaired; day++) {
          for (const slotIdx of teachingSlotIndices) {
            if (grid[task.classId][day][slotIdx] !== null) continue;
            const slot = periods[slotIdx];

            for (const teacher of task.eligibleTeachers) {
              if (isTeacherUnavailable(teacher, day, slot)) continue;
              if ((teacherWeeklyCount.get(teacher.id) ?? 0) >= teacher.maxPeriodsPerWeek) continue;
              if ((teacherDailyCount.get(teacher.id)?.[day] ?? 0) >= teacher.maxPeriodsPerDay) continue;

              if (!teacherBusy[day][slotIdx].has(teacher.id)) {
                place(task, { day, slotIdx, teacher, score: 0 });
                unplacedTasks.splice(u, 1);
                repaired = true;
                break;
              }
            }
            if (repaired) break;
          }
        }

        // If still unplaced, try swapping another cell in task.classId with an empty slot in task.classId
        if (!repaired) {
          for (let d1 = 0; d1 < numDays && !repaired; d1++) {
            for (const s1 of teachingSlotIndices) {
              const existing = grid[task.classId][d1][s1];
              if (!existing || existing.isBreak || existing.isDoublePeriod) continue;
              const existingTeacher = teachers.find((t) => t.id === existing.teacherId);
              if (!existingTeacher) continue;

              // Can `task` go into (d1, s1)?
              for (const taskTeacher of task.eligibleTeachers) {
                if (isTeacherUnavailable(taskTeacher, d1, periods[s1])) continue;
                if (teacherBusy[d1][s1].has(taskTeacher.id)) continue;
                if ((teacherWeeklyCount.get(taskTeacher.id) ?? 0) >= taskTeacher.maxPeriodsPerWeek) continue;
                if ((teacherDailyCount.get(taskTeacher.id)?.[d1] ?? 0) >= taskTeacher.maxPeriodsPerDay) continue;

                // Can `existing` move to some empty (d2, s2) in task.classId?
                for (let d2 = 0; d2 < numDays && !repaired; d2++) {
                  for (const s2 of teachingSlotIndices) {
                    if (grid[task.classId][d2][s2] !== null) continue;
                    if (isTeacherUnavailable(existingTeacher, d2, periods[s2])) continue;
                    if (teacherBusy[d2][s2].has(existingTeacher.id)) continue;
                    const d2Count = teacherDailyCount.get(existingTeacher.id)?.[d2] ?? 0;
                    if (d2 !== d1 && d2Count >= existingTeacher.maxPeriodsPerDay) continue;

                    // Perform swap!
                    grid[task.classId][d1][s1] = null;
                    teacherBusy[d1][s1].delete(existingTeacher.id);
                    teacherDailyCount.get(existingTeacher.id)![d1] -= 1;

                    grid[task.classId][d2][s2] = existing;
                    teacherBusy[d2][s2].add(existingTeacher.id);
                    teacherDailyCount.get(existingTeacher.id)![d2] += 1;

                    place(task, { day: d1, slotIdx: s1, teacher: taskTeacher, score: 0 });
                    unplacedTasks.splice(u, 1);
                    repaired = true;
                    break;
                  }
                }
                if (repaired) break;
              }
              if (repaired) break;
            }
          }
        }
      }
    }

    return { solved: unplacedTasks.length === 0, grid };
  }

  // First try with double periods intact
  const primaryTasks = buildTasks(true);
  let attempt = runSolver(primaryTasks);

  // Fallback: split double periods into single periods if strict consecutive pairing failed
  if (!attempt.solved && primaryTasks.some((t) => t.duration === 2)) {
    warnings.push(
      'Could not pair all double-period labs consecutively; fell back to single-period placement where needed.'
    );
    attempt = runSolver(buildTasks(false));
  }

  if (!attempt.solved) {
    return {
      success: false,
      timetable: attempt.grid,
      warnings,
      error:
        'No valid timetable satisfies all hard constraints. Check teacher weekly/daily limits and unavailable periods.',
    };
  }

  return {
    success: true,
    timetable: attempt.grid,
    warnings,
  };
}
