#!/usr/bin/env bun
import { loadEnv } from "./config/env.ts";
import { TelegramClient } from "./telegram/client.ts";
import type { ParseMode } from "./telegram/types.ts";
import { readStdin } from "./util/index.ts";

/**
 * CLI entry point: sends a message to a Telegram channel.
 *
 * Usage:
 *   bun run src/index.ts "Hello, channel!"
 *   bun run src/index.ts --parse-mode markdown "**Bold** message"
 *   echo "Hello" | bun run src/index.ts
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  let parseMode: ParseMode;
  let messageArgs: string[] = [];

  // Parse CLI flags
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--parse-mode" || args[i] === "-p") {
      const mode = args[++i]?.toLowerCase();
      if (mode === "markdown" || mode === "markdownv2") {
        parseMode = "MarkdownV2";
      } else if (mode === "html") {
        parseMode = "HTML";
      } else {
        console.error(
          `Unknown parse mode: "${mode}". Use "markdown" or "html".`,
        );
        process.exit(1);
      }
    } else if (args[i] === "--help" || args[i] === "-h") {
      printUsage();
      process.exit(0);
    } else {
      messageArgs.push(args[i]!);
    }
  }

  // Get message from args or stdin
  let message = messageArgs.join(" ");
  if (!message) {
    const stdinText = await readStdin();
    if (stdinText) {
      message = stdinText;
    }
  }

  if (!message) {
    console.error("No message provided. Pass as argument or pipe via stdin.");
    printUsage();
    process.exit(1);
  }

  const env = loadEnv();
  const client = new TelegramClient(env.botToken);

  const result = await client.sendMessage(env.channelId, message, parseMode);
  console.log(
    `Message sent to ${result.chat.title ?? result.chat.username ?? env.channelId} (message_id: ${result.message_id})`,
  );
}

function printUsage(): void {
  console.log(
    `
Usage: bun run src/index.ts [options] <message>

Options:
  --parse-mode, -p <mode>  Set parse mode: "markdown" or "html"
  --help, -h               Show this help

Examples:
  bun run src/index.ts "Hello, channel!"
  bun run src/index.ts -p markdown "**Bold** message"
  echo "Hello" | bun run src/index.ts
  `.trim(),
  );
}

main().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
