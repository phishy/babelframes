import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { TranscriptionResult } from "@/lib/types/subtitle";

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function startTranscriptionJob(s3Url: string, jobName: string) {
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    Media: { MediaFileUri: s3Url },
    LanguageCode: "en-US",
    OutputBucketName: process.env.AWS_OUTPUT_BUCKET,
    OutputKey: `${jobName}`,
    Subtitles: {
      Formats: ["srt"],
    },
  });

  return transcribeClient.send(command);
}

export async function pollTranscriptionJob(jobName: string): Promise<TranscriptionResult> {
  while (true) {
    const command = new GetTranscriptionJobCommand({
      TranscriptionJobName: jobName,
    });
    const response = await transcribeClient.send(command);
    const status = response.TranscriptionJob?.TranscriptionJobStatus;

    if (status === "COMPLETED") {
      return {
        bucket: process.env.AWS_OUTPUT_BUCKET || "",
        key: `${jobName}.srt`,
      };
    } else if (status === "FAILED") {
      throw new Error("Transcription job failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

export async function downloadSRTFromS3(bucket: string, key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);
  
  if (!response.Body) {
    throw new Error("No SRT content found");
  }

  return response.Body.transformToString();
}