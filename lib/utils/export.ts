import { convertToSRT } from "./srt";
import { convertToASS } from "./ass";
import { convertToTTML } from "./ttml";
import { convertToWebVTT } from "./vtt";
import type { Subtitle } from "@/lib/types/subtitle";

export type SubtitleFormat = "srt" | "ass" | "vtt" | "ttml";

interface FormatConfig {
  convert: (subtitles: Subtitle[]) => string;
  mimeType: string;
  extension: string;
}

const formatConfigs: Record<SubtitleFormat, FormatConfig> = {
  srt: {
    convert: convertToSRT,
    mimeType: "text/plain",
    extension: "srt"
  },
  ass: {
    convert: convertToASS,
    mimeType: "text/plain",
    extension: "ass"
  },
  vtt: {
    convert: convertToWebVTT,
    mimeType: "text/vtt",
    extension: "vtt"
  },
  ttml: {
    convert: convertToTTML,
    mimeType: "application/ttml+xml",
    extension: "ttml"
  }
};

export function exportSubtitles(subtitles: Subtitle[], format: SubtitleFormat, filename: string): void {
  const config = formatConfigs[format];
  const content = config.convert(subtitles);
  const blob = new Blob([content], { type: config.mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.${config.extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}