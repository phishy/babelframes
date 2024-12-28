"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";
import { Input } from "@/components/ui/input";
import type { Subtitle } from "@/lib/types/subtitle";
import type { SupportedLanguage } from "@/lib/constants/languages";
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranslateButtonProps {
  subtitles: Subtitle[];
  onTranslate: (subtitles: Subtitle[]) => void;
  disabled?: boolean;
}

export default function TranslateButton({ subtitles, onTranslate, disabled }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter(lang =>
      lang.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleTranslate = async (language: SupportedLanguage) => {
    setSelectedLanguage(language);
    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subtitles,
          targetLanguage: language
        }),
      });
      const data = await response.json();
      if (data.subtitles) {
        onTranslate(data.subtitles);
      }
    } catch (error) {
      console.error("Error translating subtitles:", error);
    } finally {
      setIsTranslating(false);
      setSelectedLanguage("");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled || isTranslating} variant="outline" size="sm">
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating to {selectedLanguage}...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Translate
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <div className="p-2">
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>
        <ScrollArea className="h-[300px]">
        {filteredLanguages.map((language) => (
          <DropdownMenuItem 
            key={language}
            onClick={() => handleTranslate(language)}
            disabled={isTranslating}
          >
            {language}
          </DropdownMenuItem>
        ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}