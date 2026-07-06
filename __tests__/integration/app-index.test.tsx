jest.mock("@/hooks/use-health-check", () => ({
  useHealthCheck: () => ({
    isError: false,
    isLoading: false,
  }),
}));

import HomeScreen from "@/app/index";

describe("HomeScreen", () => {
  it("renders the mobile environment status screen", () => {
    const tree = JSON.stringify(HomeScreen());

    expect(tree).toContain("Fitness Coaching");
    expect(tree).toContain("Expo mobile environment ready");
  });
});
