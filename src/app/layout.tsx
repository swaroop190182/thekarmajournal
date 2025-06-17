
import type {Metadata} from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Karma Journal',
  description: 'Track your daily activities and their impact on your karma.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80">
              Karma Journal
            </Link>
            <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
              <Link href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Features
              </Link>
              <Link href="/home" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Record
              </Link>
              <Link href="/reflections" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Reflections
              </Link>
              <Link href="/goals" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Goals
              </Link>
              <Link href="/habits-manager" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Habits
              </Link>
              <Link href="/luma-grief-counsellor" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Luma
              </Link>
              <Link href="/impact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Impact
              </Link>
            </nav>
            {/* "Get Started" button removed from here */}
          </div>
        </header>
        <main>{children}</main>
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
