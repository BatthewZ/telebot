# Telebot

Send messages to a Telegram channel from the command line using the [Telegram Bot API](https://core.telegram.org/bots/api). No Telegram account required — just a bot token.

## Setup

1. Create a bot via [@BotFather](https://t.me/BotFather) and copy the token.
2. Add the bot as an **admin** to your target channel.
3. Create a `.env` file from the template:

```bash
cp .env.example .env
```

Fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` (either `@channelname` or a numeric ID).

If you're not sure how to get your channel ID, send any message to your channel, then go to: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`

Look for

```json
"chat": {
  "id": -1001234567890,
  "title": "Your Channel Name",
  "type": "channel"
}
```

4. Install dependencies:

```bash
bun install
```

## Usage

```bash
# Send a message
bun run src/index.ts "Hello, channel!"

# With Markdown formatting
bun run src/index.ts --parse-mode markdown "**Bold** _italic_"

# With HTML formatting
bun run src/index.ts -p html "<b>Bold</b> <i>italic</i>"

# Pipe from stdin
echo "Hello from pipe" | bun run src/index.ts
```

## Testing

```bash
bun test
```

## Tech

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript (strict)
- **API**: Telegram Bot API over HTTP — no SDK dependencies
