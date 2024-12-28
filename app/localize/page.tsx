"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileVideo } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import TranscriptionTable from "@/components/TranscriptionTable";
import ExportButton from "@/components/ExportButton";
import TranslateButton from "@/components/TranslateButton";
import UndoRedoButtons from "@/components/UndoRedoButtons";
import { useSubtitleStore } from "@/lib/store/subtitles";
import { parseTimestamp } from "@/lib/utils/time";
import type { Subtitle } from "@/lib/types/subtitle";

export default function LocalizePage() {
  const [s3Url, setS3Url] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { present: transcription, setSubtitles } = useSubtitleStore((state) => ({
    present: state.present,
    setSubtitles: state.setSubtitles,
  }));

  const handleSeek = (timeInSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      
      // Only play if the video is loaded
      if (videoRef.current.readyState >= 2) {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  const handleGetPresignedUrl = async () => {
    if (!s3Url) return;
    
    try {
      const response = await fetch("/api/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Url }),
      });
      const data = await response.json();
      setVideoUrl(data.presignedUrl);
    } catch (error) {
      console.error("Error getting presigned URL:", error);
    }
  };

  const handleTranscribe = async () => {
    if (!s3Url) return;

    setIsTranscribing(true);
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Url }),
      });
      const data = await response.json();
      if (data.subtitles) {
        setSubtitles(data.subtitles);
      }
    } catch (error) {
      console.error("Error transcribing video:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSubtitlesChange = (updatedSubtitles: Subtitle[]) => {
    if (!updatedSubtitles) return;
    
    setSubtitles(updatedSubtitles);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter S3 URL (s3://...)"
              value={s3Url}
              onChange={(e) => setS3Url(e.target.value)}
              onBlur={handleGetPresignedUrl}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleTranscribe}
            disabled={!videoUrl || isTranscribing}
            className="min-w-[120px]"
          >
            {isTranscribing ? (
              "Transcribing..."
            ) : (
              <>
                <FileVideo className="mr-2 h-4 w-4" />
                Transcribe
              </>
            )}
          </Button>
          <UndoRedoButtons onTimeChange={handleSeek} />
          <TranslateButton 
            subtitles={transcription}
            onTranslate={setSubtitles}
            disabled={!transcription || transcription.length === 0}
          />
          <ExportButton 
            subtitles={transcription} 
            disabled={!transcription || transcription.length === 0} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-4">
            {videoUrl ? (
              <VideoPlayer 
                ref={videoRef}
                url={videoUrl} 
                subtitles={transcription} 
              />
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
                <FileVideo className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="bg-card rounded-lg p-4">
            <TranscriptionTable 
              subtitles={transcription} 
              onSubtitlesChange={handleSubtitlesChange}
              onTimeClick={handleSeek}
            />
          </div>
        </div>
      </div>
    </div>
  );
}