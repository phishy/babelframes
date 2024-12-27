"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; 
import { Undo2, Redo2 } from "lucide-react";
import { useSubtitleStore } from "@/lib/store/subtitles";

export default function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useSubtitleStore();
  const [mounted, setMounted] = useState(false);

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
        onClick={undo}
        disabled={!canUndo()}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={redo}
        disabled={!canRedo()}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
}