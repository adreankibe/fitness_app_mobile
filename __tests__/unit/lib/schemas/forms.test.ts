import {
  completeProfileSchema,
  createOrganizationSchema,
  inviteMemberSchema,
} from "@/lib/schemas/forms";

describe("Phase 2/3 form schemas", () => {
  it("requires accepted terms for profile completion", () => {
    expect(() =>
      completeProfileSchema.parse({ acceptTerms: false, fullName: "Ada" }),
    ).toThrow("Accept terms to continue.");
  });

  it("validates organization slug format", () => {
    expect(
      createOrganizationSchema.parse({
        name: "RepScript Strength",
        slug: "repscript-strength",
        timezone: "Africa/Nairobi",
      }).slug,
    ).toBe("repscript-strength");
    expect(() =>
      createOrganizationSchema.parse({
        name: "RepScript Strength",
        slug: "-bad",
        timezone: "Africa/Nairobi",
      }),
    ).toThrow();
  });

  it("validates invitation role and redemption limits", () => {
    expect(
      inviteMemberSchema.parse({
        email: "athlete@example.com",
        expiresInDays: 14,
        maxRedemptions: 1,
        role: "ATHLETE",
      }).role,
    ).toBe("ATHLETE");
  });
});
