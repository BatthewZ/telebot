/** Subset of Telegram Bot API types used by this project. */

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  date: number;
  chat: TelegramChat;
  text?: string;
}

export interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export type ParseMode = "MarkdownV2" | "HTML" | undefined;

export interface SendMessageParams {
  chat_id: string | number;
  text: string;
  parse_mode?: ParseMode;
}
