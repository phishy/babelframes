export function parseTimestamp(timestamp: string): number {
  const [minutes, seconds, milliseconds] = timestamp.split(/[:.]/);
  return parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds);
}