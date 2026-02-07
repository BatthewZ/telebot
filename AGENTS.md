# Telebot - Agent Notes

## Build & Run

- **Runtime**: Bun 1.1.12+
- **Install deps**: `bun install`
- **Run**: `bun run src/index.ts "message"` or `echo "message" | bun run src/index.ts`
- **Typecheck**: `bun run typecheck` or `tsc --noEmit`
- **Test all**: `bun test`
- **Test specific**: `bun test src/telegram/client.test.ts`

## Environment

Requires `.env` file (see `.env.example`):
- `TELEGRAM_BOT_TOKEN` - from @BotFather
- `TELEGRAM_CHANNEL_ID` - @username or numeric ID

## Project Structure

- `src/index.ts` - CLI entry point
- `src/config/env.ts` - env var loading/validation
- `src/telegram/client.ts` - Telegram Bot API HTTP client
- `src/telegram/types.ts` - Telegram API type definitions
- `src/util/index.ts` - shared utilities
- Tests are co-located next to source files (e.g., `client.test.ts`)
