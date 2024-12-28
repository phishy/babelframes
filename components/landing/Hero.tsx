import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
        Video Translation
        <span className="text-primary block">made easy</span>
      </h1>
      <Badge variant="secondary" className="px-4 py-1 text-base">
        Rated #1 in Video Editing
      </Badge>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Transform your videos into searchable, multilingual content instantly. Our AI-powered platform delivers industry-leading accuracy in transcription and translation, helping you reach global audiences effortlessly.
      </p>
    </div>
  );
}