# Telebot

Send messages to a Telegram channel from the command line using the [Telegram Bot API](https://core.telegram.org/bots/api).

While this script does not require an account to send messages, you will need a telegram account to set up a bot and a channel.

## Setup

1. Create a bot via [@BotFather](https://t.me/BotFather) and copy the token.
2. Add the bot as an **admin** to your target channel.
3. Create a `.env` file from the template:

```bash
cp .env.example .env
```

Fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID` (either `@channelname` or a numeric ID). If numeric id, include the hyphen as required.

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

### Global CLI install

To use `telebot` as a global command:

```bash
bun link
```

Then you can run:

```bash
telebot "Hello, channel!"
telebot -p html '<b>Bold</b> message'
echo "piped message" | telebot
```

## Usage Notes

### Shell quoting

Use **single quotes** for messages containing `!`, `$`, or backticks — double quotes in bash will interpret these as special characters:

```bash
# Good
telebot '<b>Hello!</b>'

# Bad — bash will error on "!"
telebot "<b>Hello!</b>"
```

### HTML mode

Telegram only supports a subset of HTML tags:

| Tag | Effect |
| --- | --- |
| `<b>`, `<strong>` | bold |
| `<i>`, `<em>` | italic |
| `<u>`, `<ins>` | underline |
| `<s>`, `<strike>`, `<del>` | strikethrough |
| `<code>` | inline code |
| `<pre>` | code block |
| `<a href="...">` | link |
| `<blockquote>` | block quote |
| `<tg-spoiler>` | spoiler |

Standard tags like `<h1>`, `<p>`, `<div>`, etc. are **not supported** and will cause an error.

### Markdown mode (MarkdownV2)

Telegram uses its own MarkdownV2 syntax, not standard Markdown. Supported formatting:

- `*bold*`, `_italic_`, `__underline__`, `~strikethrough~`
- `||spoiler||`, `` `inline code` ``, ` ```code block``` `
- `[link text](url)`, `>blockquote`

Headings, lists, tables, and images are **not supported**.

Special characters must be escaped with `\` when not part of formatting:

```
_ * [ ] ( ) ~ ` > # + - = | { } . !
```

For example, `3.5 + 2 = 5.5!` must be sent as `3\.5 \+ 2 \= 5\.5\!`.

For casual use, HTML mode is generally easier since plain text doesn't need escaping.

## Testing

```bash
bun test
```

## Tech

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript (strict)
- **API**: Telegram Bot API over HTTP — no SDK dependencies
