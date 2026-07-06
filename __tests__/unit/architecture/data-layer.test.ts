declare const require: (moduleName: string) => any;

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const productionRoots = ["app", "components", "hooks", "lib", "store", "http"];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry: any) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    return [fullPath];
  });
}

function read(filePath: string) {
  return fs.readFileSync(filePath, "utf8") as string;
}

describe("data layer architecture", () => {
  it("keeps backend request definitions under http/requests instead of services", () => {
    const serviceFiles = fs
      .readdirSync(path.join(root, "services"), { withFileTypes: true })
      .filter((entry: any) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry: any) => entry.name);

    expect(serviceFiles).toEqual([]);
  });

  it("prevents production code from importing service wrappers", () => {
    const offenders = productionRoots
      .flatMap((dir) => walk(path.join(root, dir)))
      .filter((filePath) => read(filePath).includes("@/services/"))
      .map((filePath) => path.relative(root, filePath));

    expect(offenders).toEqual([]);
  });

  it("keeps backend request imports inside store modules", () => {
    const offenders = productionRoots
      .flatMap((dir) => walk(path.join(root, dir)))
      .filter((filePath) => !path.relative(root, filePath).startsWith(`store${path.sep}modules${path.sep}`))
      .filter((filePath) => !path.relative(root, filePath).startsWith(`http${path.sep}requests${path.sep}`))
      .filter((filePath) => read(filePath).includes("@/http/requests/"))
      .map((filePath) => path.relative(root, filePath));

    expect(offenders).toEqual([]);
  });

  it("keeps domain request APIs in the CRM-style http/requests folder", () => {
    const expectedRequests = [
      "athletes",
      "audit-events",
      "auth",
      "invitations",
      "members",
      "organizations",
      "programs",
      "teams",
      "users",
      "workouts",
    ];

    for (const requestName of expectedRequests) {
      expect(
        fs.existsSync(path.join(root, "http", "requests", `${requestName}.ts`)),
      ).toBe(true);
    }
  });

  it("keeps query hooks thin over stores instead of direct React Query fetchers", () => {
    const offenders = walk(path.join(root, "hooks", "queries"))
      .filter((filePath) =>
        read(filePath).includes("@tanstack/react-query"),
      )
      .map((filePath) => path.relative(root, filePath));

    expect(offenders).toEqual([]);
  });

  it("defines CRM-style Zustand promise stores for server domains", () => {
    const expectedStores = [
      "athletes",
      "audit-events",
      "auth-session",
      "invitations",
      "members",
      "organizations",
      "programs",
      "teams",
      "users",
      "workouts",
    ];

    for (const storeName of expectedStores) {
      expect(
        fs.existsSync(path.join(root, "store", "modules", `${storeName}.ts`)),
      ).toBe(true);
    }
  });
});
