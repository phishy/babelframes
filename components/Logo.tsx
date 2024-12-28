"use client";

import { Outfit } from 'next/font/google';
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ['latin'] });

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn(
      "font-bold text-2xl tracking-tight",
      outfit.className,
      className
    )}>
      <span className="text-foreground tracking-wider">LOCAL</span>
      <span className="text-primary tracking-wider">FRAMES.AI</span>
    </div>
  );
}