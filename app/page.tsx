import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Features } from '@/components/landing/Features';
import { Hero } from '@/components/landing/Hero';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-16 space-y-24">
        <Hero />
         <div className="text-center">
          <Link href="/localize">
            <Button size="lg" className="font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
        <Features />
       
      </div>
    </div>
  );
}