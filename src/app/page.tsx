
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Edit, LineChart, Heart, Users, Moon, Sun, TreePine, Repeat, ShieldCheck, MessageSquareHeart, HelpCircle, Award, Users2, Sparkles, Eye, Brain } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen landing-page-dark-red-theme">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 xl:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                  Karma Journal: Cultivate Balance, Inspire Growth.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl lg:text-lg xl:text-xl mx-auto lg:mx-0">
                  Discover a new path to personal well-being. Track your actions, understand their impact, and build a more mindful, positive life, one day at a time.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform hover:scale-105">
                  <Link href="/home">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="shadow-md border-primary text-primary hover:bg-primary/10 transition-transform hover:scale-105">
                  <Link href="/features">Explore Features</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-xl flex items-center justify-center bg-muted/50">
            <Image
              alt="Karma Journal Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-xl"
              height={360}
              src="/kjmain.png"
              width={640}
            />
            </div>
          </div>
        </div>
      </section>

      {/* Not Just a Tracker Section */}
      <section className="w-full py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">Not Just a Tracker. A Life Companion.</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Karma Journal is designed to be more than just a log. It&apos;s a tool for self-discovery, helping you understand your patterns, celebrate your progress, and gently guide you towards healthier habits and a more positive outlook.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <div className="grid gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors shadow-sm border border-border/50">
              <Eye className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Mindful Reflection</h3>
              <p className="text-sm text-muted-foreground">Log daily activities and see their karmic impact. Understand your choices better.</p>
            </div>
            <div className="grid gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors shadow-sm border border-border/50">
              <Target className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Goal Setting & Streaks</h3>
              <p className="text-sm text-muted-foreground">Set personal goals, track your streaks, and stay motivated on your journey.</p>
            </div>
            <div className="p-4 rounded-lg hover:bg-accent/10 transition-colors shadow-sm border border-border/50 flex items-start">
              <div className="flex-grow mr-3">
                <div className="flex items-center mb-1">
                  <Brain className="h-8 w-8 text-accent mr-2 flex-shrink-0" />
                  <h3 className="text-lg font-bold text-foreground">AI-Powered Insights</h3>
                </div>
                <p className="text-sm text-muted-foreground">Receive personalized feedback and suggestions from our AI coach to help you grow.</p>
              </div>
              <Image 
                src="/luma.png" 
                alt="Luma AI Assistant" 
                width={40} 
                height={40} 
                className="rounded-full flex-shrink-0" 
              />
            </div>
            <div className="grid gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors shadow-sm border border-border/50">
              <LineChart className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Progress Visualization</h3>
              <p className="text-sm text-muted-foreground">Track your karma score and habit trends over time with clear, insightful charts.</p>
            </div>
            <div className="grid gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors shadow-sm border border-border/50">
              <Heart className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Healthy Habit Formation</h3>
              <p className="text-sm text-muted-foreground">Access resources and programs to understand and manage habits effectively.</p>
            </div>
            <div className="grid gap-2 p-4 rounded-lg hover:bg-accent/10 transition-colors shadow-sm border border-border/50">
              <Users className="h-8 w-8 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Community Support (Future)</h3>
              <p className="text-sm text-muted-foreground">Connect with others, share experiences, and find encouragement (coming soon).</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-secondary/30">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 mx-auto">
          <div className="space-y-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-foreground">Simple. Personal. Powerful.</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Getting started with Karma Journal is easy. Follow these simple steps to begin your journey towards self-improvement.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-background shadow-md border border-border/50">
              <Edit className="h-10 w-10 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">1. Record Daily</h3>
              <p className="text-sm text-muted-foreground">Log your actions, thoughts, and journal entries easily.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-background shadow-md border border-border/50">
              <Repeat className="h-10 w-10 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">2. Track Habits</h3>
              <p className="text-sm text-muted-foreground">Monitor habits you want to cultivate or reduce.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-background shadow-md border border-border/50">
              <LineChart className="h-10 w-10 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">3. View Progress</h3>
              <p className="text-sm text-muted-foreground">See your karma score and trends on your dashboard.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 rounded-lg bg-background shadow-md border border-border/50">
              <Target className="h-10 w-10 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">4. Set Goals</h3>
              <p className="text-sm text-muted-foreground">Define personal goals and track your achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-20 lg:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-6 text-center p-8 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-xl shadow-xl border border-primary/20">
            <Sparkles className="h-12 w-12 text-primary" />
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
              Begin Your Journey to a More Mindful Life
            </h2>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Ready to take control of your personal growth? Karma Journal provides the tools and insights you need to build a more positive and fulfilling life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform hover:scale-105">
                <Link href="/home">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between mx-auto">
          <p className="text-xs text-muted-foreground">
            &copy; ${new Date().getFullYear()} Karma Journal. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link href="/features" className="text-xs text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/home" className="text-xs text-muted-foreground hover:text-foreground">
              Record
            </Link>
            <Link href="/reflections" className="text-xs text-muted-foreground hover:text-foreground">
              Reflections
            </Link>
            <Link href="/goals" className="text-xs text-muted-foreground hover:text-foreground">
              Goals
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
