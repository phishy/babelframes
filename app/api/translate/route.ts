import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { Subtitle } from "@/lib/types/subtitle";
import type { SupportedLanguage } from "@/lib/constants/languages";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { subtitles, targetLanguage } = await request.json();
    
    const prompt = `You are a professional subtitle translator. Translate the following subtitles to ${targetLanguage}. 
Keep the same meaning and tone, but make it natural in the target language. Only return the translated text for each subtitle, maintaining the exact same JSON structure.

Input subtitles:
${JSON.stringify(subtitles, null, 2)}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const translatedSubtitles = JSON.parse(completion.choices[0].message.content || "[]");
    return NextResponse.json({ subtitles: translatedSubtitles });
  } catch (error) {
    console.error("Error translating subtitles:", error);
    return NextResponse.json(
      { error: "Failed to translate subtitles" },
      { status: 500 }
    );
  }
}