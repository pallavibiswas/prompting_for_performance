// Shared markdown parsing utilities

/** Strips HTML-style comments used as editor instructions */
export function stripComments(md: string): string {
  return md
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Splits content by horizontal rules.
 * Supports whitespace around "---".
 */
export function splitBlocks(md: string): string[] {
  return stripComments(md)
    .split(/^\s*---\s*$/gm)
    .map(block => block.trim())
    .filter(Boolean);
}

/**
 * Gets a named field from the Markdown.
 *
 * Supports:
 *
 * body_left: A one-line value
 *
 * body_left:
 * A multiline value that continues until the next field.
 */
export function getField(block: string, key: string): string {
  const cleaned = stripComments(block);

  // Escapes special regex characters in the field name.
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `^\\s*${escapedKey}:\\s*([\\s\\S]*?)(?=^\\s*[A-Za-z0-9_]+:\\s*|\\s*$)`,
    "m"
  );

  const match = cleaned.match(regex);

  if (!match) {
    console.warn(`Markdown field not found: "${key}"`);
    return "";
  }

  return match[1]
    .trim()
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ");
}