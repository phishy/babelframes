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
import { useCallback, useState, useEffect, useRef } from "react";
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
  const lastModifiedIndex = useSubtitleStore((state) => state.lastModifiedIndex);
  const previousSubtitles = useRef<Subtitle[]>([]);
  const [changedIndices, setChangedIndices] = useState<number[]>([]);
  
  // Reset changed indices after animation
  useEffect(() => {
    if (changedIndices.length > 0) {
      const timer = setTimeout(() => {
        setChangedIndices([]);
      }, 1000); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [changedIndices]);
  
  useEffect(() => {
    if (subtitles && previousSubtitles.current) {
      const indices = subtitles.reduce((acc: number[], subtitle, index) => {
        if (subtitle.text !== previousSubtitles.current[index]?.text) {
          acc.push(index);
        }
        return acc;
      }, []);
      
      if (indices.length > 0) setChangedIndices(indices);
      previousSubtitles.current = [...subtitles];
    }
  }, [subtitles]);
  
  const debouncedSeek = useDebounceCallback((index: number) => {
    const currentSubtitles = useSubtitleStore.getState().present;
    if (currentSubtitles[index]) {
      const timeInSeconds = parseTimestamp(currentSubtitles[index].startTime);
      onSubtitlesChange?.(currentSubtitles);
      onTimeClick?.(timeInSeconds);
    }
  }, 250);

  const handleTimeClick = useCallback((time: string) => {
    const timeInSeconds = parseTimestamp(time);
    onTimeClick?.(timeInSeconds);
  }, [onTimeClick]);
  
  const handleTextChange = useCallback((index: number, newText: string) => {
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
                  className={cn(
                    "w-full transition-all duration-1000",
                    (changedIndices.includes(index) || index === lastModifiedIndex) && "border-primary animate-highlight"
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}