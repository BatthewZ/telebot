/** Environment configuration for Telegram bot credentials. */
export interface TelebotEnv {
  botToken: string;
  channelId: string;
}

/**
 * Loads and validates required environment variables.
 * Throws with a descriptive message if any are missing.
 */
export function loadEnv(): TelebotEnv {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  const missing: string[] = [];
  if (!botToken) missing.push("TELEGRAM_BOT_TOKEN");
  if (!channelId) missing.push("TELEGRAM_CHANNEL_ID");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        `See .env.example for reference.`
    );
  }

  return { botToken: botToken!, channelId: channelId! };
}
