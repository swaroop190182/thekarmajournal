
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lightbulb, MessageSquareText, AlertCircle, Loader2 } from 'lucide-react';
import { getGoalCoachFeedback, type GoalCoachInput, type GoalCoachOutput } from '@/ai/flows/goal-coach-flow';
import type { SelectedKarmaActivity, Goal } from '@/app/types';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isValid } from 'date-fns';

const AiCoachFeedback = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAndAnalyzeData = async () => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const karmaHistory: {date: string; activities: SelectedKarmaActivity[]; score: number}[] = [];
      const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regex to check for YYYY-MM-DD format

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('karma-')) {
          const dateStr = key.replace('karma-', '');
          // Ensure dateStr is a valid date and not other karma-prefixed keys
          if (datePattern.test(dateStr) && isValid(parseISO(dateStr))) {
            try {
              const activities: SelectedKarmaActivity[] = JSON.parse(localStorage.getItem(key) || '[]');
              const score = activities.reduce((sum, activity) => {
                   let pointsToAward = activity.points;
                    if (activity.requiresPhoto && !activity.mediaDataUri) { // Check mediaDataUri
                      pointsToAward = Math.round(activity.points * 0.7);
                    }
                    return sum + pointsToAward;
              }, 0);
              
              const mappedActivities = activities.map(act => ({
                  name: act.name,
                  type: act.type, // This should now always exist for valid karma activities
                  points: act.points,
                  keywords: act.keywords || [],
                  requiresPhoto: !!act.requiresPhoto,
                  quantificationUnit: act.quantificationUnit || undefined,
                  mediaDataUri: act.mediaDataUri || null,
                  mediaType: act.mediaType || null,
                  quantity: act.quantity === undefined ? null : act.quantity,
                  triggers: act.triggers || '',
              }));
              karmaHistory.push({ date: dateStr, activities: mappedActivities as any, score });
            } catch (e) {
              console.warn(`Could not parse karma data for ${dateStr}:`, e);
            }
          }
        }
      }
      
      karmaHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const recentKarmaHistory = karmaHistory.slice(-30); 

      let goalStatus: Goal[] = [];
      const storedGoals = localStorage.getItem('karma-journal-goals');
      if (storedGoals) {
        try {
          const parsedGoals: Goal[] = JSON.parse(storedGoals);
           const todayStr = format(new Date(), 'yyyy-MM-dd');
           goalStatus = parsedGoals.map(goal => ({
            ...goal,
            isCompletedToday: goal.lastCompletedDate === todayStr, 
          }));
        } catch (e) {
          console.warn('Could not parse goals data:', e);
        }
      }

      const input: GoalCoachInput = {
        karmaHistory: recentKarmaHistory.map(kh => ({
            ...kh,
             activities: kh.activities.map(act => ({
                name: act.name,
                type: act.type, 
                points: act.points, 
                keywords: act.keywords || [],
                requiresPhoto: !!act.requiresPhoto,
                quantificationUnit: act.quantificationUnit || undefined,
                mediaDataUri: act.mediaDataUri || null,
                mediaType: act.mediaType || null,
                quantity: act.quantity === undefined ? null : act.quantity,
                triggers: act.triggers || '',
            }))
        })),
        goalStatus,
        currentDate: format(new Date(), 'yyyy-MM-dd'),
      };

      const result: GoalCoachOutput = await getGoalCoachFeedback(input);
      setFeedback(result.feedbackText);

    } catch (err) {
      console.error('Error getting AI feedback:', err);
      let errorMessage = 'Aura is taking a quick break. Please try again in a moment!';
      if (err instanceof Error) {
        if (err.message.includes('API key not valid')) {
            errorMessage = 'There seems to be an issue with the AI service configuration. Please check the API key.'
        } else if (err.message.includes('Schema validation failed')) {
            errorMessage = 'Aura had trouble understanding some of the data. Please ensure recent journal entries are consistent.';
            console.error('Schema validation error details:', err);
        }
      }
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Could not fetch AI feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 p-6 bg-muted/30 border-b">
        <Avatar className="h-16 w-16 border-2 border-primary shadow-md">
          <AvatarImage src="https://placehold.co/100x100.png" alt="Aura AI Coach" data-ai-hint="female cartoon avatar" />
          <AvatarFallback className="text-primary font-semibold">AU</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl font-bold text-primary">Aura - Your AI Wellness Coach</CardTitle>
          <CardDescription className="text-muted-foreground">
            Get personalized insights and suggestions based on your progress.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
            Aura is analyzing your progress... This might take a moment.
          </div>
        )}
        {error && !isLoading && (
          <div className="p-4 my-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive flex items-start">
            <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 mt-1" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {feedback && !isLoading && !error && (
          <div className="p-4 my-4 bg-secondary/30 rounded-md prose prose-sm dark:prose-invert max-w-none">
            <div className="flex items-start">
                <MessageSquareText className="inline-block h-6 w-6 mr-3 text-primary flex-shrink-0 mt-1" />
                <p className="whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                  {feedback.split('\\n\\n').map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {paragraph}
                      {index < feedback.split('\\n\\n').length - 1 && <><br /><br /></>}
                    </React.Fragment>
                  ))}
                </p>
            </div>
          </div>
        )}
        {!isLoading && !feedback && !error && (
          <div className="text-center text-muted-foreground py-6">
            <Lightbulb className="mx-auto h-12 w-12 mb-3 text-yellow-400" />
            <p className="text-lg">Ready for some insights?</p>
            <p>Click the button below to let Aura analyze your journey!</p>
          </div>
        )}
        <Button
          onClick={fetchAndAnalyzeData}
          disabled={isLoading}
          className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base rounded-lg shadow-md transition-transform hover:scale-105"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Getting Feedback...
            </>
          ) : (
            'Ask Aura for Feedback'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AiCoachFeedback;
