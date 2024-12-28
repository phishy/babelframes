"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn("font-bold text-2xl tracking-tight", className)}>
      <span className="text-foreground">LOCAL</span>
      <span className="text-primary">FRAMES.AI</span>
    </div>
  );
}