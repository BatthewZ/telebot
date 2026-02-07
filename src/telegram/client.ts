import type {
  TelegramApiResponse,
  TelegramMessage,
  TelegramUser,
  ParseMode,
} from "./types.ts";

const TELEGRAM_API_BASE = "https://api.telegram.org";

/**
 * Telegram Bot API client that communicates via HTTP.
 * Does not require a Telegram account — only a bot token from @BotFather.
 */
export class TelegramClient {
  private readonly baseUrl: string;

  constructor(private readonly botToken: string) {
    this.baseUrl = `${TELEGRAM_API_BASE}/bot${botToken}`;
  }

  /**
   * Verifies the bot token is valid by calling the getMe endpoint.
   * @returns Bot user info if token is valid.
   */
  async getMe(): Promise<TelegramUser> {
    return this.request<TelegramUser>("getMe");
  }

  /**
   * Sends a text message to a chat or channel.
   * The bot must be an admin in the target channel.
   *
   * @param chatId - Channel ID (@username or numeric ID)
   * @param text - Message text to send
   * @param parseMode - Optional formatting: "MarkdownV2" or "HTML"
   * @returns The sent message details
   */
  async sendMessage(
    chatId: string | number,
    text: string,
    parseMode?: ParseMode
  ): Promise<TelegramMessage> {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text,
    };
    if (parseMode) {
      body.parse_mode = parseMode;
    }
    return this.request<TelegramMessage>("sendMessage", body);
  }

  /**
   * Makes an authenticated request to the Telegram Bot API.
   * Maps Telegram API errors to descriptive Error messages.
   */
  private async request<T>(
    method: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.baseUrl}/${method}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      throw new Error(
        `Network error calling Telegram API (${method}): ${err instanceof Error ? err.message : String(err)}. Check your internet connection.`
      );
    }

    const data = (await response.json()) as TelegramApiResponse<T>;

    if (!data.ok) {
      throw new Error(
        this.mapApiError(method, data.error_code, data.description)
      );
    }

    return data.result as T;
  }

  /** Maps Telegram API error codes to human-readable messages. */
  private mapApiError(
    method: string,
    code?: number,
    description?: string
  ): string {
    const desc = description ?? "Unknown error";

    switch (code) {
      case 401:
        return `Invalid bot token. Check TELEGRAM_BOT_TOKEN. (${desc})`;
      case 400:
        if (desc.includes("chat not found")) {
          return `Channel not found. Check TELEGRAM_CHANNEL_ID. (${desc})`;
        }
        return `Bad request to ${method}: ${desc}`;
      case 403:
        return `Bot lacks permission. Ensure it is an admin in the target channel. (${desc})`;
      default:
        return `Telegram API error [${code}] in ${method}: ${desc}`;
    }
  }
}
