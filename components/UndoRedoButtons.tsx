"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button"; 
import { Undo2, Redo2 } from "lucide-react";
import { useSubtitleStore } from "@/lib/store/subtitles";
import { parseTimestamp } from "@/lib/utils/time";

interface UndoRedoButtonsProps {
  onTimeChange?: (timeInSeconds: number) => void;
}

export default function UndoRedoButtons({ onTimeChange }: UndoRedoButtonsProps) {
  const { undo, redo, canUndo, canRedo, present, lastModifiedIndex } = useSubtitleStore();
  const [mounted, setMounted] = useState(false);

  const handleUndo = useCallback(() => {
    undo();
    if (lastModifiedIndex !== null && present[lastModifiedIndex]) {
      onTimeChange?.(parseTimestamp(present[lastModifiedIndex].startTime));
    }
  }, [undo, lastModifiedIndex, present, onTimeChange]);

  const handleRedo = useCallback(() => {
    redo();
    if (lastModifiedIndex !== null && present[lastModifiedIndex]) {
      onTimeChange?.(parseTimestamp(present[lastModifiedIndex].startTime));
    }
  }, [redo, lastModifiedIndex, present, onTimeChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleUndo}
        disabled={!canUndo()}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRedo}
        disabled={!canRedo()}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
}