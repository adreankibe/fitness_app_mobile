declare const require: (moduleName: string) => any;

const { existsSync } = require("fs");
const path = require("path");

const root = process.cwd();

const expectedRoutes = [
  "app/(auth)/register.tsx",
  "app/(auth)/onboarding/join-org.tsx",
  "app/(app)/athletes/index.tsx",
  "app/(app)/athletes/[id].tsx",
  "app/(app)/athletes/[id]/workout/[logId].tsx",
  "app/(app)/programs/[id]/week/[weekId].tsx",
  "app/(app)/programs/create.tsx",
  "app/(app)/org/invite/manage.tsx",
];

describe("screen design plan route coverage", () => {
  it.each(expectedRoutes)("implements %s", (route) => {
    expect(existsSync(path.join(root, route))).toBe(true);
  });
});
