import { describe, it, expect, vi } from "vitest";
import { sauthbase } from "../src/main";

describe("sauthbase instance methods", () => {
  const sab = sauthbase.init({
    secretKey: sauthbase.generateSecureKey(),
    redirect_url: "http://localhost:3000/auth",
  });

  describe("use", () => {
    it("SUCCESS", () => {
      expect(sauthbase.use()).toBe(sab);
    });
    it("ERROR/NOT_INITIALIZED", () => {
      // 現在のインスタンスを退避してリセット
      const original = (sauthbase as any).instance;
      (sauthbase as any).instance = undefined;

      expect(() => sauthbase.use()).toThrowError(
        "SAuthBase has not been initialized."
      );

      // 元に戻す
      (sauthbase as any).instance = original;
    });
  });

  describe("isReady", () => {
    it("SUCCESS", () => {
      const ready = sauthbase.isReady();
      expect(ready).toBe(true);
    });
  });

  describe("calculateHmac", () => {
    it("SUCCESS", () => {
      const result = sab.calculateHmac("test");
      expect(result.success).toBe(true);
      expect(result.success && result.data).toBeDefined();
    });
    it("ERROR/INTERNAL_HMAC_CALCULATION", () => {
      vi.spyOn(Buffer, "from").mockImplementation(() => {
        throw new Error("forced error for test");
      });

      const result = sab.calculateHmac("test");
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.status).toBe(500);
        expect(result.code).toBe("ERROR/INTERNAL_HMAC_CALCULATION");
      }

      vi.restoreAllMocks();
    });
  });

  describe("encrypt", () => {
    it("SUCCESS", () => {
      const enc = sab.encrypt("hello");
      expect(enc.success).toBe(true);
    });

    it("ERROR/INTERNAL_ENCRYPTION", () => {
      // 暗号化失敗を再現するために createCipheriv を強制エラー化
      vi.spyOn(require("crypto"), "createCipheriv").mockImplementation(() => {
        throw new Error("forced error for test");
      });

      const result = sab.encrypt("should fail");
      expect(result.success).toBe(false);
      if (result.success === false) {
        expect(result.status).toBe(500);
        expect(result.code).toBe("ERROR/INTERNAL_ENCRYPTION");
      }

      // 他のテストに影響しないようにリセット
      vi.restoreAllMocks();
    });
  });

  describe("decrypt", () => {
    it("SUCCESS", () => {
      const enc = sab.encrypt("hello");
      expect(enc.success).toBe(true);
      if (enc.success) {
        const dec = sab.decrypt(enc.data);
        expect(dec.success).toBe(true);
        expect(dec.success && dec.data).toBe("hello");
      }
    });
    it("ERROR/FORMAT_INVALID_TOKEN", () => {
      const result = sab.decrypt("a");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/FORMAT_INVALID_TOKEN");
    });
  });

  describe("generationAuthPageUrl", () => {
    it("SUCCESS", () => {
      const url = sab.generationAuthPageUrl("MyApp");
      expect(url.success).toBe(true);
      expect(url.success && url.data).toContain("MyApp");

      const url2 = sab.generationAuthPageUrl();
      expect(url2.success).toBe(true);
    });
  });

  describe("generateEncryptedToken", () => {
    it("SUCCESS", async () => {
      const result = await sab.generateEncryptedToken("scratchteam");
      expect(result.success).toBe(true);
      expect(result.success && result.data).toBeDefined();
    });
    it("ERROR/ARGUMENT_REQUIRED_SESSION", async () => {
      const result = await sab.generateEncryptedToken();
      expect(result.success).toBe(false);
    });

    it("ERROR/INTERNAL_HMAC_FAILURE", async () => {
      // HMACを強制的に失敗させる
      vi.spyOn(sab, "calculateHmac").mockImplementation(() => {
        return {
          success: false,
          status: 500,
          code: "ERROR/INTERNAL_HMAC_FAILURE",
          message: "forced HMAC error",
        };
      });

      const result = await sab.generateEncryptedToken("scratchteam");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/INTERNAL_HMAC_FAILURE");

      vi.restoreAllMocks();
    });

    it("ERROR/INTERNAL_ENCRYPTION_FAILURE", async () => {
      // HMACは正常に返し、encryptを失敗させる
      vi.spyOn(sab, "calculateHmac").mockImplementation(() => {
        return {
          success: true,
          code: "SUCCESS",
          data: "fakehmac",
        };
      });
      vi.spyOn(sab, "encrypt").mockImplementation(() => {
        return {
          success: false,
          status: 500,
          code: "ERROR/INTERNAL_ENCRYPTION_FAILURE",
          message: "forced encryption error",
        };
      });

      const result = await sab.generateEncryptedToken("scratchteam");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/INTERNAL_ENCRYPTION_FAILURE");

      vi.restoreAllMocks();
    });
  });

  describe("verifySession", () => {
    it("SUCCESS", async () => {
      const mockFetcher = vi.fn().mockResolvedValue({
        data: {
          valid: true,
          username: "scratchteam",
          redirect: "http://localhost:3000/auth",
        },
      });

      const result = await sab.verifySession("dummy_token", mockFetcher);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.payload.username).toBe("scratchteam");
      }
    });
    it("ERROR/ARGUMENT_REQUIRED_SESSION", async () => {
      const result = await sab.verifySession("");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/ARGUMENT_REQUIRED_SESSION");
    });
    it("ERROR/SESSION_INVALID_OR_REDIRECT_MISMATCH", async () => {
      const mockFetcher = vi.fn().mockResolvedValue({
        data: {
          valid: true,
          username: "scratchteam",
          redirect: "http://localhost:8080/auth",
        },
      });
      const result = await sab.verifySession("dummy_token", mockFetcher);
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/SESSION_INVALID_OR_REDIRECT_MISMATCH");
    });

    it("ERROR/INTERNAL_VERIFICATION", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.reject("NetworkError")) as any
      );
      const result = await sab.verifySession("token");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/INTERNAL_VERIFICATION");
      vi.restoreAllMocks();
    });

    it("ERROR/INTERNAL_TOKEN_GENERATION", async () => {
      const mockFetcher = vi.fn().mockResolvedValue({
        data: {
          valid: true,
          username: "scratchteam",
          redirect: "http://localhost:3000/auth",
        },
      });

      vi.spyOn(sab, "generateEncryptedToken").mockImplementation(async () => {
        return {
          success: false,
          status: 500,
          code: "ERROR/INTERNAL_TOKEN_GENERATION",
          message: "Token generation failed",
        };
      });

      const result = await sab.verifySession("valid_token", mockFetcher);
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/INTERNAL_TOKEN_GENERATION");

      // 追加: codeがundefinedのケース
      vi.spyOn(sab, "generateEncryptedToken").mockImplementation(async () => {
        return {
          success: false,
          status: 500,
          code: undefined as any,
          message: "Token generation failed without code",
        };
      });

      const fallbackCodeResult = await sab.verifySession(
        "valid_token",
        mockFetcher
      );
      expect(fallbackCodeResult.success).toBe(false);
      expect(fallbackCodeResult.code).toBe("ERROR/INTERNAL_TOKEN_GENERATION");

      vi.restoreAllMocks();
    });
  });

  describe("extractUserWithVerify", () => {
    it("SUCCESS", async () => {
      const encrypted = await sab.generateEncryptedToken("scratchteam");
      if (encrypted.success) {
        const result = await sab.extractUserWithVerify(encrypted.data);
        expect(result.success).toBe(true);
        expect(result.success && result.data).toBe("scratchteam");
      }
    });
    it("ERROR/ARGUMENT_REQUIRED_TOKEN", async () => {
      const result = await sab.extractUserWithVerify();
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/ARGUMENT_REQUIRED_TOKEN");
    });
    it("ERROR/DECRYPTION_FAILURE", async () => {
      const tampered = "abc:def:ghi"; // 無効な形式
      const result = await sab.extractUserWithVerify(tampered);
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/DECRYPTION_FAILURE");
    });

    it("ERROR/INTERNAL_HMAC_ERROR", async () => {
      // 正常なトークンを生成してから、calculateHmac を失敗させる
      const encrypted = await sab.generateEncryptedToken("scratchteam");

      vi.spyOn(sab, "calculateHmac").mockImplementation(() => {
        return {
          success: false,
          status: 500,
          code: "ERROR/INTERNAL_HMAC_CALCULATION",
          message: "故障テスト",
        };
      });

      if (encrypted.success) {
        const result = await sab.extractUserWithVerify(encrypted.data);
        expect(result.success).toBe(false);
        expect(result.code).toBe("ERROR/INTERNAL_HMAC_ERROR");
      }

      vi.restoreAllMocks();
    });

    it("ERROR/HMAC_MISMATCH", async () => {
      const encrypted = await sab.generateEncryptedToken("scratchteam");

      vi.spyOn(sab, "calculateHmac").mockImplementation(() => {
        return {
          success: true,
          code: "SUCCESS",
          data: "invalidhmacvalue",
        };
      });

      if (encrypted.success) {
        const result = await sab.extractUserWithVerify(encrypted.data);
        expect(result.success).toBe(false);
        expect(result.code).toBe("ERROR/HMAC_MISMATCH");
      }

      vi.restoreAllMocks();
    });
  });

  describe("extractUserUnsafe", () => {
    it("SUCCESS", async () => {
      const encrypted = await sab.generateEncryptedToken("scratchteam");
      if (encrypted.success) {
        const result = sab.extractUserUnsafe(encrypted.data);
        expect(result.success).toBe(true);
        expect(result.success && result.data).toBe("scratchteam");
      }
    });
    it("ERROR/DECRYPTION_FAILURE", async () => {
      const result = sab.extractUserUnsafe("a|b");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/DECRYPTION_FAILURE");
    });
    it("ERROR/ARGUMENT_REQUIRED_TOKEN", () => {
      const result = sab.extractUserUnsafe();
      expect(result.success).toBe(false);
    });
  });

  describe("getUser", () => {
    it("SUCCESS", async () => {
      const result = await sab.getUser("scratchteam");
      expect(result.success).toBe(true);
    });
    it("ERROR/USER_NOT_FOUND", async () => {
      const result = await sab.getUser("a");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/USER_NOT_FOUND");
    });
    it("ERROR/REQUEST_FAILED_SCRATCH_API", async () => {
      const result = await sab.getUser("/");
      expect(result.success).toBe(false);
      expect(result.code).toBe("ERROR/REQUEST_FAILED_SCRATCH_API");
    });
  });
});
