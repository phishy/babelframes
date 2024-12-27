import type { Subtitle } from "@/lib/types/subtitle";

export function parseSRT(srtContent: string): Subtitle[] {
  const subtitles: Subtitle[] = [];
  const blocks = srtContent.trim().split("\n\n");

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.length >= 3) {
      const [, timing, ...textLines] = lines;
      const [startTime, endTime] = timing.split(" --> ");
      subtitles.push({
        startTime,
        endTime,
        text: textLines.join(" "),
      });
    }
  }

  return subtitles;
}

export function convertToSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((subtitle, index) => {
      return `${index + 1}\n${subtitle.startTime} --> ${subtitle.endTime}\n${subtitle.text}\n`;
    })
    .join('\n');
}