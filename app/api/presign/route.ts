import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { s3Url } = await request.json();
    
    // Parse S3 URL to get bucket and key
    const s3UrlPattern = /s3:\/\/([^/]+)\/(.+)/;
    const match = s3Url.match(s3UrlPattern);
    
    if (!match) {
      return NextResponse.json(
        { error: "Invalid S3 URL format" },
        { status: 400 }
      );
    }

    const [, bucket, key] = match;
    console.log({ Bucket: bucket, Key: key });
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return NextResponse.json({ presignedUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}