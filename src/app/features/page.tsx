
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb, BookText, Edit3, Target, Smile, HeartPulse, MessageSquareHeart, HandCoins, Users2, BarChart3, Brain, ShieldCheck, Award, TrendingUp, Sparkles, Mic, Camera, Palette, Users, HelpCircle, MessageCircleQuestion, ListChecks, Tags, Eye } from 'lucide-react';

const features = [
  {
    icon: Edit3,
    title: 'Daily Karma Logging & Journaling',
    description: 'Record your daily activities, thoughts, and reflections. Your journal entries can also be analyzed by AI to automatically suggest karma activities.',
    instructions: [
      { q: 'How to log activities?', a: 'Navigate to the "Record" page. Select your activities from the categorized lists or use the favorite acts. Log habits with quantity and triggers if applicable. Upload media for relevant activities.' },
      { q: 'How to use text journaling?', a: 'On the "Record" page, find the "Daily Journal & Intentions" section. Type your reflections into the provided prompts. Click "Analyze Full Journal" to let AI suggest activities based on your text.' },
      { q: 'How to use voice journaling?', a: 'On the "Record" page, use the "Voice Journal" section. Click "Start Recording", speak your thoughts, then "Stop Recording". Click "Analyze Voice Note" to transcribe and auto-select activities.' },
      { q: 'How to add a daily selfie?', a: 'In the "Quick Capture" section on the "Record" page, enable your camera or upload an image. This links to the "Daily Selfie" activity.'}
    ],
    link: '/home'
  },
  {
    icon: Palette,
    title: 'Mood Tracking',
    description: 'Log your daily mood to gain insights into your emotional patterns over time.',
    instructions: [
      { q: 'How to track mood?', a: 'On the "Record" page, at the top, select a mood icon that best represents how you felt on the selected day. This is saved with your daily journal entry.' },
      { q: 'Where can I see mood history?', a: 'The "Reflections" page calendar visually represents your mood for each day. Detailed mood information is part of your daily summary.' }
    ],
    link: '/home'
  },
  {
    icon: Target,
    title: 'Goal Setting & AI Coaching',
    description: 'Define personal goals, track your progress, and get feedback from Aura, your AI wellness coach, to stay motivated.',
    instructions: [
      { q: 'How to set goals?', a: 'Go to the "Goals" page. Click "Add New Goal", give it a name, and save. Currently, binary (did it/didn_t do it) goals are supported.' },
      { q: 'How to mark goals complete?', a: 'On the "Goals" page, check the box next to a goal to mark it complete for the day. This updates your streak. Completing a goal also logs an "Achieved a Daily Goal" activity.' },
      { q: 'How to get AI Coach feedback?', a: 'On the "Goals" page, scroll down to the "Aura - Your AI Wellness Coach" section and click "Ask Aura for Feedback". Aura analyzes your recent karma activities and goal progress.' }
    ],
    link: '/goals'
  },
  {
    icon: HeartPulse,
    title: 'Habit & Addiction Management',
    description: 'Access resources, programs, and AI Counsellor "Ela" for support in managing various habits and addictions.',
    instructions: [
      { q: 'How to find resources?', a: 'Go to the "Habits" page. Search or select an addiction type. You\'ll find articles, counsellor lists, and program details.' },
      { q: 'How to chat with Ela?', a: 'On the "Habits" page, after selecting an addiction type, use the chat interface to type your questions or concerns for Ela. She provides general guidance and support.' },
      { q: 'How to register for programs?', a: 'On the "Habits" page, browse available programs for the selected addiction. Click "Register" and follow the steps. This logs a "Self-Improvement Initiative" in your Karma Journal.' }
    ],
    link: '/habits-manager'
  },
  {
    icon: MessageSquareHeart,
    title: 'Luma - AI Grief Counsellor',
    description: 'Luma offers a compassionate space for users experiencing grief and loss, providing comfort and general coping strategies.',
    instructions: [
      { q: 'How to talk to Luma?', a: 'Navigate to the "Luma" page. Luma will greet you. Type your feelings or questions into the chat box to start a conversation.' },
      { q: 'What can Luma help with?', a: 'Luma provides empathetic support, validation of feelings, and general guidance for various types of grief. Luma is not a replacement for professional therapy but can be a comforting companion.' }
    ],
    link: '/luma-grief-counsellor'
  },
  {
    icon: Users2,
    title: 'Make an Impact: Donate & Volunteer',
    description: 'Find opportunities to donate to charitable institutions or volunteer for various causes, directly logging these positive actions.',
    instructions: [
      { q: 'How to donate?', a: 'Go to the "Impact" page, select the "Make a Donation" tab. Choose a category, institution, and amount. Completing a donation automatically logs a "Donate" activity with points in your Karma Journal.' },
      { q: 'How to find volunteer opportunities?', a: 'On the "Impact" page, select the "Volunteer" tab. Choose your country, city, and category of interest to see listed opportunities. Registering for an opportunity logs a "Committed to Volunteer" activity.' }
    ],
    link: '/impact'
  },
  {
    icon: BarChart3,
    title: 'Reflections Dashboard',
    description: 'Visualize your karma scores, habit trends, mood patterns, earned badges, and neuro-wellness insights over time.',
    instructions: [
      { q: 'What can I see here?', a: 'The "Reflections" page shows your daily karma score trends, habit/addiction quantity charts, a calendar view of daily summaries & moods, your journaling "Recovery Tree", "Weekly Mood Meter", and "Neuro-Wellness Dashboard".' },
      { q: 'How to view daily summaries?', a: 'On the "Reflections" calendar, click any date to see a pop-up summary of logged activities, completed goals, and reflection text for that day.' },
      { q: 'What is the Neuro-Wellness Dashboard?', a: 'It tracks your "Happy Chemical" levels (Dopamine, Serotonin, Oxytocin, Endorphins) based on logged activities, providing daily scores and weekly trends.'}
    ],
    link: '/reflections'
  },
  {
    icon: Sparkles,
    title: 'Affirmations Hub',
    description: 'Access categorized affirmations to strengthen your mindset. Includes a timer for focused reflection sessions.',
    instructions: [
      { q: 'How to use affirmations?', a: 'On the "Reflections" page, switch to the "Affirmations Hub" tab. Browse categories, select one to view affirmations. You can favorite affirmations and use the built-in timer for focused sessions.' },
      { q: 'Can I create my own?', a: 'Yes, the "My Own Affirmations" category provides templates to help you craft personal statements.' }
    ],
    link: '/reflections?tab=affirmations' // Example of linking to a specific tab
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Karma Journal Features
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how Karma Journal can help you cultivate balance, inspire growth, and build a more mindful, positive life.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center space-x-3 mb-2">
                  <IconComponent className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl font-semibold text-primary">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-sm h-16">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">How to Use</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
                        {feature.instructions.map((instr, i) => (
                          <li key={i}>
                            <strong>{instr.q}</strong> {instr.a}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="mt-16 py-12 bg-secondary/30 rounded-xl shadow-inner">
        <div className="container mx-auto px-6 text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-primary mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start recording your day, setting goals, and reflecting on your progress.
                Small, consistent steps lead to significant transformations.
            </p>
            <a
              href="/home"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                Go to My Journal
            </a>
        </div>
      </section>
    </div>
  );
}

    