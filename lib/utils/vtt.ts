import type { Subtitle } from "@/lib/types/subtitle";

function formatTime(timeStr: string): string {
  // SRT uses comma for milliseconds, WebVTT uses dot
  return timeStr.replace(",", ".");
}

export function convertToWebVTT(subtitles: Subtitle[]): string {
  const vttContent = ["WEBVTT", ""];
  
  subtitles.forEach((subtitle, index) => {
    vttContent.push(
      `${index + 1}`,
      `${formatTime(subtitle.startTime)} --> ${formatTime(subtitle.endTime)}`,
      subtitle.text,
      ""
    );
  });

  return vttContent.join("\n");
}

export function createBlobURL(vttContent: string): string {
  const blob = new Blob([vttContent], { type: "text/vtt" });
  return URL.createObjectURL(blob);
}