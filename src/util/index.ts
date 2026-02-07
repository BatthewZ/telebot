/** Shared utility exports for telebot. */

/**
 * Reads all of stdin as a string using Bun's built-in text() method.
 * Returns null if stdin is a TTY (no piped input).
 */
export async function readStdin(): Promise<string | null> {
  // In a TTY, there's no piped data — return null immediately
  const file = Bun.file("/dev/stdin");
  const size = file.size;
  if (size === 0) return null;

  const text = (await Bun.stdin.text()).trim();
  return text.length > 0 ? text : null;
}
