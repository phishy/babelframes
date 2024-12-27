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

interface TranscriptionTableProps {
  subtitles: Subtitle[];
  onSubtitlesChange?: (subtitles: Subtitle[], startTime?: string) => void;
}

export default function TranscriptionTable({
  subtitles, 
  onSubtitlesChange 
}: TranscriptionTableProps) {
  const updateSubtitle = useSubtitleStore((state) => state.updateSubtitle);
  const [lastEditedIndex, setLastEditedIndex] = useState<number | null>(null);
  
  const debouncedSeek = useDebounceCallback((index: number) => {
    const currentSubtitles = useSubtitleStore.getState().present;
    if (currentSubtitles[index]) {
      onSubtitlesChange?.(currentSubtitles, currentSubtitles[index].startTime);
    }
  }, 250);
  
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
            <TableHead className="w-[100px]">Start Time</TableHead>
            <TableHead className="w-[100px]">End Time</TableHead>
            <TableHead>Text</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subtitles?.map((subtitle, index) => (
            <TableRow key={index}>
              <TableCell>{subtitle.startTime}</TableCell>
              <TableCell>{subtitle.endTime}</TableCell>
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