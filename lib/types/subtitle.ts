export interface Subtitle {
  startTime: string;
  endTime: string;
  text: string;
}

export interface TranscriptionResult {
  bucket: string;
  key: string;
}