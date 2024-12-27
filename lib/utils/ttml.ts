import type { Subtitle } from "@/lib/types/subtitle";

export function convertToTTML(subtitles: Subtitle[]): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml"
    xmlns:ttp="http://www.w3.org/ns/ttml#parameter"
    xmlns:tts="http://www.w3.org/ns/ttml#styling"
    ttp:timeBase="media"
    ttp:frameRate="24">
  <head>
    <styling>
      <style xml:id="defaultStyle"
        tts:fontFamily="Arial"
        tts:fontSize="100%"
        tts:textAlign="center"/>
    </styling>
    <layout>
      <region xml:id="bottom" tts:origin="10% 80%" tts:extent="80% 20%" tts:textAlign="center"/>
    </layout>
  </head>
  <body>
    <div>`;

  const footer = `    </div>
  </body>
</tt>`;

  const content = subtitles.map(subtitle => {
    const start = subtitle.startTime.replace(',', '.');
    const end = subtitle.endTime.replace(',', '.');
    return `      <p begin="${start}" end="${end}">${escapeXml(subtitle.text)}</p>`;
  }).join('\n');

  return [header, content, footer].join('\n');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}