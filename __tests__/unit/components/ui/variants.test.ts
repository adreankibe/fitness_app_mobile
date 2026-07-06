import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants, labelVariants } from "@/components/ui/button";
import { useThemeStore } from "@/store/modules/theme";

describe("ui variants", () => {
  it("builds button classes for variants and sizes", () => {
    expect(buttonVariants({ size: "lg", variant: "destructive" })).toContain(
      "bg-destructive",
    );
    expect(labelVariants({ size: "sm", variant: "link" })).toContain(
      "underline",
    );
  });

  it("builds badge classes for status variants", () => {
    expect(badgeVariants({ variant: "success" })).toContain("bg-green-100");
    expect(badgeVariants({ variant: "warning" })).toContain("bg-amber-100");
  });
});

describe("theme store", () => {
  beforeEach(() => {
    useThemeStore.setState({ mode: "system" });
  });

  it("toggles from resolved dark mode to explicit light mode", () => {
    useThemeStore.getState().toggleResolvedMode("dark");

    expect(useThemeStore.getState().mode).toBe("light");
  });

  it("toggles from resolved light mode to explicit dark mode", () => {
    useThemeStore.getState().toggleResolvedMode("light");

    expect(useThemeStore.getState().mode).toBe("dark");
  });
});
