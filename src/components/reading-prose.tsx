import { cn } from "@/lib/utils";

type ReadingProseProps = {
  content: string;
  className?: string;
};

const READING_FONT_FAMILY = 'Georgia, "Times New Roman", serif';

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string };

/**
 * Splits raw content into readable blocks.
 * - Prefers blank-line separated paragraphs.
 * - Falls back to single newlines when the author didn't use blank lines,
 *   so long verses/text never render as one giant block.
 * - Recognizes markdown-style headings (#, ##, ###).
 */
function parseBlocks(content: string): Block[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const hasBlankLines = /\n\s*\n/.test(trimmed);
  const rawChunks = hasBlankLines
    ? trimmed.split(/\n\s*\n+/)
    : trimmed.split(/\n+/);

  return rawChunks
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      if (chunk.startsWith("### ")) return { type: "h3", text: chunk.slice(4).trim() };
      if (chunk.startsWith("## ")) return { type: "h2", text: chunk.slice(3).trim() };
      if (chunk.startsWith("# ")) return { type: "h1", text: chunk.slice(2).trim() };
      return { type: "p", text: chunk };
    });
}

/**
 * Long-form reading body for articles & ceremonies.
 * Typography is applied via inline styles directly on each element so it
 * cannot be overridden by inherited/utility classes.
 */
export function ReadingProse({ content, className }: ReadingProseProps) {
  const blocks = parseBlocks(content);

  if (blocks.length === 0) {
    return <p className="text-base text-muted-foreground">No content available.</p>;
  }

  return (
    <div
      className={cn("text-foreground/85", className)}
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: READING_FONT_FAMILY,
        textAlign: "left",
      }}
    >
      {blocks.map((block, index) => {
        if (block.type === "h1") {
          return (
            <h2
              key={index}
              style={{
                fontFamily: READING_FONT_FAMILY,
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: 1.3,
                margin: "32px 0 12px",
              }}
              className="text-foreground first:mt-0"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "h2") {
          return (
            <h3
              key={index}
              style={{
                fontFamily: READING_FONT_FAMILY,
                fontSize: "23px",
                fontWeight: 700,
                lineHeight: 1.35,
                margin: "28px 0 10px",
              }}
              className="text-foreground first:mt-0"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "h3") {
          return (
            <h4
              key={index}
              style={{
                fontFamily: READING_FONT_FAMILY,
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.4,
                margin: "24px 0 8px",
              }}
              className="text-foreground first:mt-0"
            >
              {block.text}
            </h4>
          );
        }

        return (
          <p
            key={index}
            style={{
              fontFamily: READING_FONT_FAMILY,
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.8,
              textAlign: "left",
              marginBottom: "20px",
              whiteSpace: "pre-wrap",
            }}
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
