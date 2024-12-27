import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function correctSubtitles(subtitles: any[]) {
  const prompt = `You are a subtitle fixing bot. Subtitle Fixing Instructions:
1. Capitalization Rule:
    * Ensure the first word of each subtitle line is capitalized.
    * All other words remain lowercase, unless they are proper nouns, titles, or terms that require capitalization (e.g., "Nosferatu").
    * Example: "I dreamt something awful is coming."
2. Phrase Correction: Always change "Only theater's" to "Only in theaters."
3. Grammar and Natural Flow:
    * Highlight and fix any lines that seem mistranscribed, grammatically incorrect, or awkward.
    * Ensure phrasing sounds natural and fits the context of the movie.
4. Explicit Reminder:
    * Do not capitalize words unnecessarily (e.g., do not capitalize "dreamt" unless it's the first word of a line).
    * Double-check all rules before providing the final result.

Input subtitles:
${JSON.stringify(subtitles, null, 2)}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return JSON.parse(completion.choices[0].message.content || "[]");
}