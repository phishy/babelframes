import './globals.css';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from "@/components/theme-provider";
import Logo from "@/components/Logo";

const inter = Inter({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'localframes.ai',
  description: 'AI video transcription and localization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <header className="container mx-auto px-4 py-6">
            <Link href="/">
              <Logo />
            </Link>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}