import {
  FileVideo,
  Languages,
  Undo2,
  Download,
  Shield,
  Layout
} from 'lucide-react';

const features = [
  {
    title: 'Smart Speech Recognition',
    description: 'Converts spoken words to polished transcripts with AI-powered accuracy. Our dual-layer processing ensures clean, error-free transcripts every time.',
    icon: FileVideo
  },
  {
    title: 'Translation Support',
    description: 'Easily translate transcriptions into multiple languages with high accuracy and natural phrasing.',
    icon: Languages
  },
  {
    title: 'Interactive UI',
    description: 'User-friendly interface for managing and editing transcription timelines with real-time preview.',
    icon: Layout
  },
  {
    title: 'Version History',
    description: 'Never lose your work. Automatic saves track every change while you edit, letting you instantly restore any previous version with a single click.',
    icon: Undo2
  },
  {
    title: 'Secure Cloud',
    description: 'Your media and transcripts stay secure in enterprise-grade storage.',
    icon: Shield
  },
  {
    title: 'Export Options',
    description: 'Export transcription and translation data in various formats, including SRT, ASS, VTT, and TTML.',
    icon: Download
  }
];

export function Features() {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Powerful Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to localize your video content for global distribution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 space-y-4 rounded-lg border bg-card"
          >
            <div className="p-2 w-fit rounded-lg bg-primary/10">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}