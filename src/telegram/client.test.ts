import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import { TelegramClient } from "./client.ts";

/**
 * Integration-style tests for TelegramClient.
 * Mocks only the network boundary (fetch) to verify real request construction,
 * response parsing, and error handling without hitting the actual Telegram API.
 */

const FAKE_TOKEN = "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11";
const FAKE_CHANNEL = "@testchannel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockFn = ReturnType<typeof mock<(...args: any[]) => any>>;

function mockFetchResponse(data: unknown, _ok = true): void {
  globalThis.fetch = mock(() =>
    Promise.resolve(new Response(JSON.stringify(data), {
      status: _ok ? 200 : 400,
      headers: { "Content-Type": "application/json" },
    }))
  ) as unknown as typeof fetch;
}

function fetchMock(): MockFn {
  return globalThis.fetch as unknown as MockFn;
}

describe("TelegramClient", () => {
  let client: TelegramClient;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    client = new TelegramClient(FAKE_TOKEN);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("getMe", () => {
    it("should return bot user info on valid token", async () => {
      const botUser = {
        id: 123456,
        is_bot: true,
        first_name: "TestBot",
        username: "test_bot",
      };
      mockFetchResponse({ ok: true, result: botUser });

      const result = await client.getMe();

      expect(result).toEqual(botUser);
      expect(fetchMock()).toHaveBeenCalledTimes(1);

      const call = fetchMock().mock.calls[0];
      const url = call![0] as string;
      expect(url).toBe(
        `https://api.telegram.org/bot${FAKE_TOKEN}/getMe`
      );
    });

    it("should throw on invalid token (401)", async () => {
      mockFetchResponse(
        { ok: false, error_code: 401, description: "Unauthorized" },
        false
      );

      await expect(client.getMe()).rejects.toThrow("Invalid bot token");
    });
  });

  describe("sendMessage", () => {
    it("should send a text message and return the result", async () => {
      const sentMessage = {
        message_id: 42,
        date: 1700000000,
        chat: { id: -1001234567890, type: "channel", title: "Test Channel" },
        text: "Hello, channel!",
      };
      mockFetchResponse({ ok: true, result: sentMessage });

      const result = await client.sendMessage(FAKE_CHANNEL, "Hello, channel!");

      expect(result).toEqual(sentMessage);
      expect(result.message_id).toBe(42);
      expect(result.chat.title).toBe("Test Channel");

      const call = fetchMock().mock.calls[0];
      const url = call![0] as string;
      const options = call![1] as RequestInit;
      expect(url).toBe(
        `https://api.telegram.org/bot${FAKE_TOKEN}/sendMessage`
      );
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body as string)).toEqual({
        chat_id: FAKE_CHANNEL,
        text: "Hello, channel!",
      });
    });

    it("should include parse_mode when specified", async () => {
      mockFetchResponse({
        ok: true,
        result: {
          message_id: 43,
          date: 1700000000,
          chat: { id: -1001234567890, type: "channel" },
          text: "Bold",
        },
      });

      await client.sendMessage(FAKE_CHANNEL, "**Bold**", "MarkdownV2");

      const call = fetchMock().mock.calls[0];
      const body = JSON.parse((call![1] as RequestInit).body as string);
      expect(body.parse_mode).toBe("MarkdownV2");
    });

    it("should not include parse_mode when undefined", async () => {
      mockFetchResponse({
        ok: true,
        result: {
          message_id: 44,
          date: 1700000000,
          chat: { id: -1001234567890, type: "channel" },
          text: "Plain",
        },
      });

      await client.sendMessage(FAKE_CHANNEL, "Plain");

      const call = fetchMock().mock.calls[0];
      const body = JSON.parse((call![1] as RequestInit).body as string);
      expect(body.parse_mode).toBeUndefined();
    });

    it("should throw on chat not found (400)", async () => {
      mockFetchResponse(
        {
          ok: false,
          error_code: 400,
          description: "Bad Request: chat not found",
        },
        false
      );

      await expect(
        client.sendMessage("@nonexistent", "hello")
      ).rejects.toThrow("Channel not found");
    });

    it("should throw on permission denied (403)", async () => {
      mockFetchResponse(
        {
          ok: false,
          error_code: 403,
          description: "Forbidden: bot is not a member",
        },
        false
      );

      await expect(
        client.sendMessage(FAKE_CHANNEL, "hello")
      ).rejects.toThrow("Bot lacks permission");
    });

    it("should throw descriptive error on network failure", async () => {
      globalThis.fetch = mock(() =>
        Promise.reject(new Error("fetch failed"))
      ) as unknown as typeof fetch;

      await expect(
        client.sendMessage(FAKE_CHANNEL, "hello")
      ).rejects.toThrow("Network error");
    });
  });
});
