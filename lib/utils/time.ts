export function parseTimestamp(timecode: string): number {
  // Replace comma with period for standard decimal format
  timecode = timecode.replace(',', '.');
  
  // Split into hours, minutes, seconds
  const [hours, minutes, seconds] = timecode.split(':').map(Number);
  
  // Calculate total seconds
  return (hours * 3600) + (minutes * 60) + seconds;
}

export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`.replace('.', ',');
}