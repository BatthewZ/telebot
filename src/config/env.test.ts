import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { loadEnv } from "./env.ts";

/**
 * Tests for environment configuration loading.
 * Verifies that missing env vars produce clear error messages
 * and valid env vars are properly returned.
 */
describe("loadEnv", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
  });

  it("should return bot token and channel id when both are set", () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHANNEL_ID = "@testchan";

    const env = loadEnv();

    expect(env.botToken).toBe("test-token");
    expect(env.channelId).toBe("@testchan");
  });

  it("should throw when TELEGRAM_BOT_TOKEN is missing", () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    process.env.TELEGRAM_CHANNEL_ID = "@testchan";

    expect(() => loadEnv()).toThrow("TELEGRAM_BOT_TOKEN");
  });

  it("should throw when TELEGRAM_CHANNEL_ID is missing", () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    delete process.env.TELEGRAM_CHANNEL_ID;

    expect(() => loadEnv()).toThrow("TELEGRAM_CHANNEL_ID");
  });

  it("should throw listing both vars when both are missing", () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHANNEL_ID;

    expect(() => loadEnv()).toThrow("TELEGRAM_BOT_TOKEN");
    try {
      loadEnv();
    } catch (e) {
      expect((e as Error).message).toContain("TELEGRAM_CHANNEL_ID");
    }
  });
});
