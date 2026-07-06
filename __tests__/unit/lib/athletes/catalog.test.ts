import {
  findAthlete,
  findAthleteWorkoutLog,
  resolveAthleteCollection,
} from "@/lib/athletes/catalog";

describe("athlete catalog fallback", () => {
  it("uses seeded coach-facing athletes when backend returns the current empty stub", () => {
    const athletes = resolveAthleteCollection([]);

    expect(athletes.length).toBeGreaterThan(0);
    expect(athletes[0]).toMatchObject({
      id: expect.any(String),
      fullName: expect.any(String),
      adherencePercent: expect.any(Number),
    });
  });

  it("prefers backend athlete records when available", () => {
    const athletes = resolveAthleteCollection([
      {
        id: "athlete-live",
        fullName: "Live Athlete",
        email: "live@example.com",
        status: "ACTIVE",
        currentProgram: "Meet Prep",
        coachName: "Coach One",
        adherencePercent: 91,
        readiness: "High",
        lastWorkoutAt: "2026-07-06T09:00:00.000Z",
        upcomingWorkoutTitle: "Heavy Squat",
        workoutLogs: [],
      },
    ]);

    expect(athletes).toHaveLength(1);
    expect(athletes[0].id).toBe("athlete-live");
  });

  it("finds athlete workout logs for coach review screens", () => {
    const athlete = findAthlete(resolveAthleteCollection([]), "athlete-maya");
    const log = findAthleteWorkoutLog(athlete, "log-maya-upper");

    expect(log).toMatchObject({
      id: "log-maya-upper",
      status: "COMPLETED",
      exercises: expect.arrayContaining([
        expect.objectContaining({ name: expect.any(String) }),
      ]),
    });
  });
});
