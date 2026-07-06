export type ProgramStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";
export type WorkoutStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "MISSED";
export type SegmentType =
  | "WARM_UP"
  | "MAIN_WORK"
  | "ACCESSORY"
  | "CONDITIONING"
  | "COOLDOWN";

export type ProgramExercise = {
  id: string;
  name: string;
  prescription: string;
  notes?: string;
  segmentType: SegmentType;
};

export type ProgramSession = {
  id: string;
  day: number;
  title: string;
  estimatedMinutes: number;
  exercises: ProgramExercise[];
};

export type ProgramWeek = {
  id: string;
  weekNumber: number;
  title: string;
  sessions: ProgramSession[];
};

export type ProgramTemplate = {
  id: string;
  title: string;
  description: string;
  status: ProgramStatus;
  durationWeeks: number;
  sessionsPerWeek: number;
  assignedAthleteCount: number;
  weeks: ProgramWeek[];
};

export type WorkoutLog = {
  id: string;
  title: string;
  programTitle: string;
  scheduledFor: string;
  status: WorkoutStatus;
  estimatedMinutes: number;
  exerciseCount: number;
  sessionRpe?: number;
  notes?: string;
  volumeKg?: number;
  session: ProgramSession;
};

export type ProgramFilters = {
  status?: "ALL" | ProgramStatus;
  q?: string;
};

export type WorkoutFilters = {
  status?: "ALL" | WorkoutStatus;
};

const upperPushSession: ProgramSession = {
  id: "upper-push",
  day: 1,
  title: "Upper Body Push",
  estimatedMinutes: 60,
  exercises: [
    {
      id: "band-pull-aparts",
      name: "Band Pull-Aparts",
      prescription: "2 x 15 - RPE 5 - Rest 60s",
      segmentType: "WARM_UP",
    },
    {
      id: "arm-circles",
      name: "Arm Circles",
      prescription: "1 x 20 each direction",
      segmentType: "WARM_UP",
    },
    {
      id: "bench-press",
      name: "Barbell Bench Press",
      prescription: "4 x 8 - 80 kg - RPE 8 - Rest 120s",
      notes: "Top set can move to RPE 9 if bar speed stays sharp.",
      segmentType: "MAIN_WORK",
    },
    {
      id: "incline-db-press",
      name: "Incline Dumbbell Press",
      prescription: "3 x 10 - 30 kg - RPE 7 - Rest 90s",
      segmentType: "MAIN_WORK",
    },
    {
      id: "tricep-pushdowns",
      name: "Tricep Pushdowns",
      prescription: "3 x 12 - RPE 6 - Rest 60s",
      segmentType: "ACCESSORY",
    },
    {
      id: "chest-stretch",
      name: "Chest Stretch",
      prescription: "2 x 30s hold",
      segmentType: "COOLDOWN",
    },
  ],
};

const lowerBodySession: ProgramSession = {
  id: "lower-body",
  day: 2,
  title: "Lower Body",
  estimatedMinutes: 45,
  exercises: [
    {
      id: "empty-bar-squat",
      name: "Empty Bar Squat",
      prescription: "2 x 10 - smooth tempo",
      segmentType: "WARM_UP",
    },
    {
      id: "back-squat",
      name: "Back Squat",
      prescription: "5 x 5 - 120 kg - RPE 8 - Rest 180s",
      segmentType: "MAIN_WORK",
    },
    {
      id: "rdl",
      name: "Romanian Deadlift",
      prescription: "3 x 8 - 95 kg - RPE 7",
      segmentType: "MAIN_WORK",
    },
    {
      id: "split-squat",
      name: "Split Squat",
      prescription: "3 x 10 each side",
      segmentType: "ACCESSORY",
    },
  ],
};

export const seedPrograms: ProgramTemplate[] = [
  {
    id: "strength-foundation",
    title: "Strength Foundation",
    description: "Twelve-week base block for squat, bench, and deadlift.",
    status: "ACTIVE",
    durationWeeks: 12,
    sessionsPerWeek: 4,
    assignedAthleteCount: 5,
    weeks: [
      {
        id: "week-1",
        weekNumber: 1,
        title: "Foundation",
        sessions: [
          upperPushSession,
          lowerBodySession,
          {
            ...upperPushSession,
            id: "upper-pull",
            day: 3,
            title: "Upper Body Pull",
            exercises: upperPushSession.exercises.slice(0, 5),
          },
          {
            ...lowerBodySession,
            id: "full-body",
            day: 4,
            title: "Full Body",
            estimatedMinutes: 55,
          },
        ],
      },
      {
        id: "week-2",
        weekNumber: 2,
        title: "Progression",
        sessions: [upperPushSession, lowerBodySession],
      },
      {
        id: "week-3",
        weekNumber: 3,
        title: "Intensity Build",
        sessions: [upperPushSession],
      },
    ],
  },
  {
    id: "hypertrophy-block",
    title: "Hypertrophy Block",
    description: "Higher-volume accessories with controlled main lift work.",
    status: "ACTIVE",
    durationWeeks: 8,
    sessionsPerWeek: 5,
    assignedAthleteCount: 3,
    weeks: [{ id: "week-1-hypertrophy", weekNumber: 1, title: "Volume", sessions: [upperPushSession] }],
  },
  {
    id: "endurance-base",
    title: "Endurance Base",
    description: "Short conditioning-heavy block for general preparedness.",
    status: "DRAFT",
    durationWeeks: 6,
    sessionsPerWeek: 3,
    assignedAthleteCount: 0,
    weeks: [],
  },
];

export const seedWorkouts: WorkoutLog[] = [
  {
    id: "workout-upper-push",
    title: "Upper Body Push",
    programTitle: "Strength Foundation",
    scheduledFor: "2026-07-08T06:00:00.000Z",
    status: "SCHEDULED",
    estimatedMinutes: 60,
    exerciseCount: upperPushSession.exercises.length,
    session: upperPushSession,
  },
  {
    id: "workout-lower-body",
    title: "Lower Body",
    programTitle: "Strength Foundation",
    scheduledFor: "2026-07-10T06:00:00.000Z",
    status: "SCHEDULED",
    estimatedMinutes: 45,
    exerciseCount: lowerBodySession.exercises.length,
    session: lowerBodySession,
  },
  {
    id: "workout-full-body-complete",
    title: "Full Body",
    programTitle: "Strength Foundation",
    scheduledFor: "2026-07-06T06:00:00.000Z",
    status: "COMPLETED",
    estimatedMinutes: 55,
    exerciseCount: 6,
    sessionRpe: 7,
    notes: "Felt strong today.",
    volumeKg: 12450,
    session: { ...lowerBodySession, id: "full-body-history", title: "Full Body" },
  },
  {
    id: "workout-lower-missed",
    title: "Lower Body",
    programTitle: "Strength Foundation",
    scheduledFor: "2026-07-03T06:00:00.000Z",
    status: "MISSED",
    estimatedMinutes: 45,
    exerciseCount: lowerBodySession.exercises.length,
    session: lowerBodySession,
  },
];

export function normalizeItems<T>(response: T[] | { items?: T[] } | undefined): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

export function resolveProgramCollection(
  response: ProgramTemplate[] | { items?: ProgramTemplate[] } | undefined,
): ProgramTemplate[] {
  const items = normalizeItems(response);
  return items.length > 0 ? items : seedPrograms;
}

export function resolveWorkoutCollection(
  response: WorkoutLog[] | { items?: WorkoutLog[] } | undefined,
): WorkoutLog[] {
  const items = normalizeItems(response);
  return items.length > 0 ? items : seedWorkouts;
}

export function filterPrograms(
  programs: ProgramTemplate[],
  filters: ProgramFilters = {},
): ProgramTemplate[] {
  const q = filters.q?.trim().toLowerCase();
  return programs.filter((program) => {
    const matchesStatus =
      !filters.status || filters.status === "ALL" || program.status === filters.status;
    const matchesSearch =
      !q ||
      program.title.toLowerCase().includes(q) ||
      program.description.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });
}

export function filterWorkouts(
  workouts: WorkoutLog[],
  filters: WorkoutFilters = {},
): WorkoutLog[] {
  return workouts.filter(
    (workout) =>
      !filters.status ||
      filters.status === "ALL" ||
      workout.status === filters.status,
  );
}

export function findProgram(programs: ProgramTemplate[], id: string | undefined) {
  return programs.find((program) => program.id === id) ?? null;
}

export function findSession(
  programs: ProgramTemplate[],
  programId: string | undefined,
  sessionId: string | undefined,
) {
  const program = findProgram(programs, programId);
  return (
    program?.weeks
      .flatMap((week) => week.sessions)
      .find((session) => session.id === sessionId) ?? null
  );
}

export function findWorkout(workouts: WorkoutLog[], id: string | undefined) {
  return workouts.find((workout) => workout.id === id) ?? null;
}

export function formatElapsedTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  const two = (value: number) => String(value).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${two(minutes)}:${two(remainder)}`;
  }

  return `${minutes}:${two(remainder)}`;
}
