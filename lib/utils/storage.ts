import type { Subtitle } from "@/lib/types/subtitle";

const CACHE_PREFIX = 'subtitle-cache:';

export function getCachedTranscription(s3Url: string): Subtitle[] | null {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + s3Url);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

export function cacheTranscription(s3Url: string, subtitles: Subtitle[]): void {
  try {
    localStorage.setItem(CACHE_PREFIX + s3Url, JSON.stringify(subtitles));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}