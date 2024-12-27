import type { Subtitle } from "@/lib/types/subtitle";

export function convertToASS(subtitles: Subtitle[]): string {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 384
PlayResY: 288
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

  const events = subtitles.map(subtitle => {
    const start = convertTimeToASS(subtitle.startTime);
    const end = convertTimeToASS(subtitle.endTime);
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${subtitle.text}`;
  });

  return [header, ...events].join('\n');
}

function convertTimeToASS(time: string): string {
  return time.replace(',', '.').replace(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/, '$1:$2:$3.$4');
}