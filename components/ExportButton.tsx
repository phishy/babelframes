"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportSubtitles, type SubtitleFormat } from "@/lib/utils/export";
import type { Subtitle } from "@/lib/types/subtitle";

interface ExportButtonProps {
  subtitles: Subtitle[];
  disabled?: boolean;
}

export default function ExportButton({ subtitles, disabled }: ExportButtonProps) {
  const handleExport = (format: SubtitleFormat) => {
    exportSubtitles(subtitles, format, `subtitles-${Date.now()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("srt")}>
          SubRip (.srt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("ass")}>
          Advanced SubStation Alpha (.ass)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("vtt")}>
          WebVTT (.vtt)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("ttml")}>
          TTML (.ttml)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}