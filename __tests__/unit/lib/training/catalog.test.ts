import {
  filterPrograms,
  formatElapsedTime,
  resolveProgramCollection,
  resolveWorkoutCollection,
} from "@/lib/training/catalog";

describe("resolveProgramCollection", () => {
  it("uses seed programs when backend returns the current stubbed empty array", () => {
    const programs = resolveProgramCollection([]);

    expect(programs.length).toBeGreaterThan(0);
    expect(programs[0]).toEqual(
      expect.objectContaining({
        id: "strength-foundation",
        title: "Strength Foundation",
        status: "ACTIVE",
      }),
    );
  });

  it("prefers backend programs when API data exists", () => {
    const programs = resolveProgramCollection([
      {
        id: "backend-program",
        title: "Backend Program",
        description: "Loaded from API",
        status: "DRAFT",
        durationWeeks: 4,
        sessionsPerWeek: 3,
        assignedAthleteCount: 1,
        weeks: [],
      },
    ]);

    expect(programs).toHaveLength(1);
    expect(programs[0].id).toBe("backend-program");
  });
});

describe("filterPrograms", () => {
  it("filters by status and search text", () => {
    const programs = resolveProgramCollection([]);

    expect(filterPrograms(programs, { status: "ACTIVE", q: "strength" })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "strength-foundation" }),
      ]),
    );
    expect(filterPrograms(programs, { status: "DRAFT", q: "strength" })).toEqual(
      [],
    );
  });
});

describe("resolveWorkoutCollection", () => {
  it("uses seed workouts when athlete backend is still stubbed", () => {
    const workouts = resolveWorkoutCollection([]);

    expect(workouts.length).toBeGreaterThan(0);
    expect(workouts[0]).toEqual(
      expect.objectContaining({
        id: "workout-upper-push",
        status: "SCHEDULED",
      }),
    );
  });
});

describe("formatElapsedTime", () => {
  it("formats seconds as mm:ss under one hour", () => {
    expect(formatElapsedTime(32 * 60 + 15)).toBe("32:15");
  });

  it("formats seconds as h:mm:ss at one hour and above", () => {
    expect(formatElapsedTime(75 * 60 + 4)).toBe("1:15:04");
  });
});
