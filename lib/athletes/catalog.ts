import type { ItemsResponse } from "@/types";

export type AthleteStatus = "ACTIVE" | "SUSPENDED" | "TRIAL";
export type AthleteWorkoutStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "MISSED";

export type AthleteExerciseLog = {
  id: string;
  name: string;
  topSet: string;
  volumeKg: number;
  notes?: string;
};

export type AthleteWorkoutLog = {
  id: string;
  title: string;
  status: AthleteWorkoutStatus;
  completedAt: string | null;
  scheduledAt: string;
  durationMinutes: number | null;
  sessionRpe: number | null;
  volumeKg: number;
  coachNotes?: string;
  athleteNotes?: string;
  exercises: AthleteExerciseLog[];
};

export type AthleteSummary = {
  id: string;
  fullName: string;
  email: string | null;
  status: AthleteStatus | string;
  currentProgram: string | null;
  coachName: string | null;
  adherencePercent: number;
  readiness: string;
  lastWorkoutAt: string | null;
  upcomingWorkoutTitle: string | null;
  workoutLogs: AthleteWorkoutLog[];
};

const seedAthletes: AthleteSummary[] = [
  {
    id: "athlete-maya",
    fullName: "Maya Okoth",
    email: "maya@example.com",
    status: "ACTIVE",
    currentProgram: "Strength Foundation",
    coachName: "Coach One",
    adherencePercent: 92,
    readiness: "Ready",
    lastWorkoutAt: "2026-07-06T07:30:00.000Z",
    upcomingWorkoutTitle: "Lower Body Strength",
    workoutLogs: [
      {
        id: "log-maya-upper",
        title: "Upper Push",
        status: "COMPLETED",
        completedAt: "2026-07-06T07:30:00.000Z",
        scheduledAt: "2026-07-06T06:30:00.000Z",
        durationMinutes: 55,
        sessionRpe: 7,
        volumeKg: 12450,
        coachNotes: "Bench moved well. Add 2.5 kg next top set.",
        athleteNotes: "Left shoulder felt good after warm-up.",
        exercises: [
          {
            id: "ex-bench",
            name: "Bench Press",
            topSet: "80 kg x 5 @ RPE 7",
            volumeKg: 3200,
            notes: "Clean bar path.",
          },
          {
            id: "ex-row",
            name: "Chest Supported Row",
            topSet: "42.5 kg x 10",
            volumeKg: 2550,
          },
        ],
      },
      {
        id: "log-maya-lower",
        title: "Lower Body",
        status: "SCHEDULED",
        completedAt: null,
        scheduledAt: "2026-07-08T06:30:00.000Z",
        durationMinutes: null,
        sessionRpe: null,
        volumeKg: 0,
        coachNotes: "Keep squats at RPE 7. No grinders.",
        exercises: [
          {
            id: "ex-squat",
            name: "Back Squat",
            topSet: "110 kg x 5 @ RPE 7",
            volumeKg: 0,
          },
        ],
      },
    ],
  },
  {
    id: "athlete-dan",
    fullName: "Daniel Kimani",
    email: "daniel@example.com",
    status: "ACTIVE",
    currentProgram: "Hypertrophy Block",
    coachName: "Coach One",
    adherencePercent: 76,
    readiness: "Watch fatigue",
    lastWorkoutAt: "2026-07-05T17:45:00.000Z",
    upcomingWorkoutTitle: "Full Body Volume",
    workoutLogs: [
      {
        id: "log-dan-full",
        title: "Full Body Volume",
        status: "MISSED",
        completedAt: null,
        scheduledAt: "2026-07-03T17:00:00.000Z",
        durationMinutes: null,
        sessionRpe: null,
        volumeKg: 0,
        coachNotes: "Check in before next session.",
        exercises: [],
      },
    ],
  },
];

function normalizeItems<T>(data: T[] | ItemsResponse<T> | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.items;
}

export function resolveAthleteCollection(
  data: AthleteSummary[] | ItemsResponse<AthleteSummary> | null | undefined,
) {
  const items = normalizeItems(data);
  return items.length ? items : seedAthletes;
}

export function findAthlete(
  athletes: AthleteSummary[],
  athleteId: string | undefined,
) {
  return athletes.find((athlete) => athlete.id === athleteId) ?? null;
}

export function findAthleteWorkoutLog(
  athlete: AthleteSummary | null | undefined,
  logId: string | undefined,
) {
  return athlete?.workoutLogs.find((log) => log.id === logId) ?? null;
}

export function formatAdherence(value: number) {
  return `${Math.round(value)}%`;
}
