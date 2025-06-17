
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb } from 'lucide-react';

const guidance = [
  {
    source: "Bhagavad Gita 2.47",
    text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    theme: "Focus on Action, Not Results"
  },
  {
    source: "Yoga Vasistha (Teachings)",
    text: "The world is as you see it. Your thoughts and efforts shape your reality. Strive with wisdom, for true liberation comes from understanding the nature of the self and the universe.",
    theme: "Power of Mind & Self-Effort"
  },
  {
    source: "Bhagavad Gita 3.27",
    text: "All actions are performed by the modes of material nature. The fool, whose mind is deluded by false ego, thinks, 'I am the doer.'",
    theme: "Understanding Agency & Humility"
  },
  {
    source: "Ashtavakra Gita 1.6",
    text: "You are not the body, nor is the body yours. You are not the doer nor the enjoyer. You are pure consciousness, the witness of all.",
    theme: "The Nature of the True Self"
  }
];

const ScriptureGuidance = () => {
  return (
    <Card className="mt-10 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-3 p-6 bg-muted/30 border-b">
        <Lightbulb className="h-8 w-8 text-yellow-500" />
        <div>
          <CardTitle className="text-2xl font-bold text-primary">Wisdom for Your Journey</CardTitle>
          <CardDescription className="text-muted-foreground">
            Insights from sacred texts to inspire your path.
          </CardDescription>
        </div>
      </CardHeader>
      <ScrollArea className="h-[350px] w-full">
        <CardContent className="p-6 space-y-6">
          {guidance.map((item, index) => (
            <Card key={index} className="bg-background/70 shadow-sm hover:shadow-md transition-shadow rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-accent">{item.theme}</CardTitle>
                <CardDescription className="text-xs pt-1 font-medium">{item.source}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90 italic">
                  "{item.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default ScriptureGuidance;
