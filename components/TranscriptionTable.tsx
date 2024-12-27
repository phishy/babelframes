"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useSubtitleStore } from "@/lib/store/subtitles";
import { useCallback, useState } from "react";
import { useDebounceCallback } from "@/lib/hooks/useDebounceCallback";
import type { Subtitle } from "@/lib/types/subtitle";
import { parseTimestamp } from "@/lib/utils/time";
import { cn } from "@/lib/utils";

interface TranscriptionTableProps {
  subtitles: Subtitle[];
  onSubtitlesChange?: (subtitles: Subtitle[]) => void;
  onTimeClick?: (timeInSeconds: number) => void;
}

export default function TranscriptionTable({
  subtitles, 
  onSubtitlesChange,
  onTimeClick
}: TranscriptionTableProps) {
  const updateSubtitle = useSubtitleStore((state) => state.updateSubtitle);
  const [lastEditedIndex, setLastEditedIndex] = useState<number | null>(null);
  
  const debouncedSeek = useDebounceCallback((index: number) => {
    const currentSubtitles = useSubtitleStore.getState().present;
    if (currentSubtitles[index]) {
      onSubtitlesChange?.(currentSubtitles);
    }
  }, 250);

  const handleTimeClick = useCallback((time: string) => {
    const timeInSeconds = parseTimestamp(time);
    onTimeClick?.(timeInSeconds);
  }, [onTimeClick]);
  
  const handleTextChange = useCallback((index: number, newText: string) => {
    setLastEditedIndex(index);
    updateSubtitle(index, newText);
    debouncedSeek(index);
  }, [updateSubtitle, onSubtitlesChange]);

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]" title="Click to seek">Start Time</TableHead>
            <TableHead className="w-[100px]" title="Click to seek">End Time</TableHead>
            <TableHead>Text</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtitles?.map((subtitle, index) => (
            <TableRow key={index}>
              <TableCell
                onClick={() => handleTimeClick(subtitle.startTime)}
                className={cn(
                  "cursor-pointer hover:text-primary transition-colors",
                  "select-none"
                )}
                title="Click to seek"
              >
                {subtitle.startTime}
              </TableCell>
              <TableCell
                onClick={() => handleTimeClick(subtitle.endTime)}
                className={cn(
                  "cursor-pointer hover:text-primary transition-colors",
                  "select-none"
                )}
                title="Click to seek"
              >
                {subtitle.endTime}
              </TableCell>
              <TableCell>
                <Input
                  value={subtitle.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="w-full"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}