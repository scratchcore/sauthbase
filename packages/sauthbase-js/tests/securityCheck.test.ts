import { describe, it, expect, vi } from "vitest";
import { securityCheck } from "../src/security";

describe("securityCheck", () => {
  it("throws error if secretKey is missing", () => {
    expect(() =>
      securityCheck({
        secretKey: undefined,
        redirect_url: "http://localhost:3000",
      } as any)
    ).toThrowError("[SAuthBase] secretKey is required and must be a string.");
  });

  it("warns if secretKey is not 64-char hex", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    securityCheck({
      secretKey: "weakkey",
      redirect_url: "http://localhost:3000",
    });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "⚠ WARNING: The provided secretKey is weak or not in expected hex format"
      )
    );
    warn.mockRestore();
  });
});
