# Telebot - Telegram Channel Messenger

## Overview

A backend CLI script built with TypeScript and Bun that sends messages to a Telegram channel using the Telegram Bot API. No Telegram account is required — only a bot token (from BotFather) and a channel ID.

## Architecture

- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **API**: Telegram Bot API (HTTP REST)
- **Configuration**: Environment variables via `.env` file

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `TELEGRAM_CHANNEL_ID` | Target channel ID or @username | `@mychannel` or `-1001234567890` |

## Features

### Send Message to Channel

- Accepts text input via CLI argument or stdin
- Sends the message to the configured Telegram channel via `sendMessage` API
- Supports Markdown and HTML parse modes
- Returns the sent message details on success
- Provides clear error messages on failure (invalid token, channel not found, bot not admin, etc.)

## API Endpoints Used

- `POST https://api.telegram.org/bot{token}/sendMessage` — Send a text message
- `POST https://api.telegram.org/bot{token}/getMe` — Verify bot token validity

## Usage

```bash
# Via CLI argument
bun run src/index.ts "Hello, channel!"

# Via stdin pipe
echo "Hello, channel!" | bun run src/index.ts

# With parse mode
bun run src/index.ts --parse-mode markdown "**Bold** message"
bun run src/index.ts --parse-mode html "<b>Bold</b> message"
```

## Error Handling

- Missing env vars: clear message indicating which variable is missing
- Invalid bot token: report authentication failure
- Channel not found: report invalid channel ID
- Bot not admin: report permission issue
- Network errors: report connectivity issues with retry suggestion
