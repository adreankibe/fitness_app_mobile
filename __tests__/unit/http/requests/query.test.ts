import { pathSegment, toQuery } from "@/http/requests/query";

describe("toQuery", () => {
  it("encodes query params and drops empty values", () => {
    expect(toQuery({ email: "coach+1@example.com", q: "", status: "PENDING" })).toBe(
      "?email=coach%2B1%40example.com&status=PENDING",
    );
  });
});

describe("pathSegment", () => {
  it("encodes dynamic path segments so route tokens cannot change backend paths", () => {
    expect(pathSegment("../auth/me?x=1")).toBe("..%2Fauth%2Fme%3Fx%3D1");
  });
});
