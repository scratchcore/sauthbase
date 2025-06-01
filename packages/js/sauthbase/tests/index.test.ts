import { describe, it, expect } from "vitest";
import { ScratchAuthBase, version } from "../src/index";

describe("auth-base", () => {
  const scratchAuthBase = new ScratchAuthBase({
    secretKey: "",
    redirect_url: "http://localhost:3000",
  });
  it("get scratch user info", () => {
    expect(scratchAuthBase.getUser("Toakiryu"));
  });

  it("should have correct version", () => {
    expect(version).toBe("0.0.1");
  });
});
