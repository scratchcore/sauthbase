import { describe, it, expect } from "vitest";
import { getScratchUserInfo } from "../src/scratchapi";

describe("scratch api methods", () => {
  describe("getScratchUserInfo", () => {
    it("SUCCESS", async () => {
      const result = await getScratchUserInfo("scratchteam");
      expect(result.success).toBe(true);
      expect(result.success && result.data).toBeDefined();
    });
    it("ERROR/ARGUMENT_REQUIRED_USERNAME", async () => {
      const result = await getScratchUserInfo();
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/ARGUMENT_REQUIRED_USERNAME");
    });
    it("ERROR/USER_NOT_FOUND", async () => {
      const result = await getScratchUserInfo("a");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/USER_NOT_FOUND");
    });
    it("ERROR/REQUEST_FAILED_SCRATCH_API", async () => {
      const result = await getScratchUserInfo("/");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/REQUEST_FAILED_SCRATCH_API");
    });
  });
});
