import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates an excerpt from HTML content by stripping HTML tags and limiting length
 * @param content HTML content string
 * @param maxLength Maximum length of the excerpt (default: 180)
 * @returns Plain text excerpt
 */
export function makeExcerpt(
  content: string | null | undefined,
  maxLength: number = 180
): string {
  if (!content) return "";

  // Strip HTML tags
  let text = content.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const entityMap: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&hellip;": "...",
    "&mdash;": "—",
    "&ndash;": "–",
  };

  // Replace named entities
  for (const [entity, char] of Object.entries(entityMap)) {
    text = text.replace(new RegExp(entity, "gi"), char);
  }

  // Decode numeric entities (e.g., &#123; or &#x1F;)
  text = text.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Replace multiple spaces/newlines with single space
  text = text.replace(/\s+/g, " ");

  // Trim whitespace
  const trimmed = text.trim();

  // Limit length
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  // Truncate at word boundary if possible
  const truncated = trimmed.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}
