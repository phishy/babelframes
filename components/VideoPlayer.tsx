"use client";

import { forwardRef, useEffect } from "react";
import type { Subtitle } from "@/lib/types/subtitle";
import { convertToWebVTT, createBlobURL } from "@/lib/utils/vtt";
import { parseTimestamp } from "@/lib/utils/time";

interface VideoPlayerProps {
  url: string;
  subtitles?: Subtitle[];
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ url, subtitles }, ref) => {
    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current && url) {
        videoElement.current.preload = "auto";
        videoElement.current.load();
        
        // Ensure metadata is loaded before seeking
        videoElement.current.addEventListener('loadedmetadata', () => {
          videoElement.current.currentTime = 0;
        });
      }
    }, [url, ref]);

    useEffect(() => {
      const videoElement = ref as React.MutableRefObject<HTMLVideoElement>;
      if (videoElement?.current && subtitles?.length) {
        // Remove existing tracks
        while (videoElement.current.textTracks.length > 0) {
          const track = videoElement.current.textTracks[0];
          if (track.mode) track.mode = 'disabled';
          videoElement.current.removeChild(videoElement.current.getElementsByTagName('track')[0]);
        }

        // Create new track
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.srcLang = 'en';
        track.label = 'English';
        track.default = true;

        const vttContent = convertToWebVTT(subtitles);
        const blobUrl = createBlobURL(vttContent);
        track.src = blobUrl;

        videoElement.current.appendChild(track);
        videoElement.current.textTracks[0].mode = 'showing';

        return () => {
          URL.revokeObjectURL(blobUrl);
        };
      }
    }, [subtitles, ref]);

    return (
      <video
        ref={ref}
        controls
        playsInline
        className="w-full aspect-video rounded-lg"
        preload="auto"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;