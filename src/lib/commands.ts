type CommandResult = {
  value: string;
  cursor: number;
};

const INLINE_COMMANDS: Record<
  string,
  (content: string) => { text: string; cursorOffset: number }
> = {
  "/h1": (content) => ({
    text: `# ${content}`,
    cursorOffset: `# ${content}`.length + 1,
  }),
  "/h2": (content) => ({
    text: `## ${content}`,
    cursorOffset: `## ${content}`.length + 1,
  }),
  "/quote": (content) => ({
    text: `> ${content}`,
    cursorOffset: `> ${content}`.length + 1,
  }),
};

export function applySlashCommand(
  value: string,
  cursor: number
): CommandResult | null {
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  const lines = before.split("\n");
  const rawLine = lines[lines.length - 1];

  // separa comando e conteúdo
  const [command, ...rest] = rawLine.trim().split(" ");
  const content = rest.join(" ");

  const handler = INLINE_COMMANDS[command];
  if (!handler) return null;

  const { text, cursorOffset } = handler(content);

  // substitui linha inteira
  lines[lines.length - 1] = text;

  const newBefore = lines.join("\n");
  const newValue = newBefore + "\n" + after;

  return {
    value: newValue,
    cursor: newBefore.length + 1,
  };
}
