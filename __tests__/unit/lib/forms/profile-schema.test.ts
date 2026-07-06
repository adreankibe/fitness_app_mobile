import { profileSchema } from "@/lib/forms/profile-schema";

describe("profileSchema", () => {
  it("accepts trimmed profile names", () => {
    const result = profileSchema.parse({
      fullName: "  Ada Lovelace  ",
    });

    expect(result.fullName).toBe("Ada Lovelace");
  });

  it("rejects blank profile names", () => {
    expect(() => profileSchema.parse({ fullName: " " })).toThrow(
      "Full name is required",
    );
  });
});
