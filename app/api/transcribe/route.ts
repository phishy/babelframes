import { NextResponse } from "next/server";
import { startTranscriptionJob, pollTranscriptionJob, downloadSRTFromS3 } from "@/lib/services/aws";
import { correctSubtitles } from "@/lib/services/openai";
import { parseSRT } from "@/lib/utils/srt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { s3Url } = await request.json();
    const timestamp = Date.now();
    const jobName = `transcription-job-${timestamp}`;

    await startTranscriptionJob(s3Url, jobName);
    const { bucket, key } = await pollTranscriptionJob(jobName);
    
    const srtContent = await downloadSRTFromS3(bucket, key);
    const subtitles = parseSRT(srtContent);
    const correctedSubtitles = await correctSubtitles(subtitles);

    return NextResponse.json({ subtitles: correctedSubtitles });
  } catch (error) {
    console.error("Error in transcription:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}