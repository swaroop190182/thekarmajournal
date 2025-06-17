
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Goal, SelectedKarmaActivity } from '@/app/types';
import { ActivityList } from '@/app/constants';
import { PlusCircle, Trash2, Zap, Edit3, ArrowRight } from 'lucide-react';
import { format,differenceInCalendarDays, isToday, parseISO, startOfDay, subDays } from 'date-fns';
import AiCoachFeedback from '@/components/ai/goal-coach-feedback';
import ScriptureGuidance from '@/components/guidance/scripture-guidance';

const GOALS_STORAGE_KEY = 'karma-journal-goals';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
    if (storedGoals) {
      try {
        const parsedGoals: Goal[] = JSON.parse(storedGoals);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const updatedGoals = parsedGoals.map(goal => ({
          ...goal,
          isCompletedToday: goal.lastCompletedDate === todayStr,
        }));
        setGoals(updatedGoals);
      } catch (e) {
        console.error("Failed to parse goals from localStorage", e);
        setGoals([]);
      }
    }
  }, []);

  const saveGoals = useCallback((updatedGoals: Goal[]) => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  }, []);

  const handleAddOrUpdateGoal = () => {
    if (!newGoalName.trim()) {
      toast({ title: 'Error', description: 'Goal name cannot be empty.', variant: 'destructive' });
      return;
    }

    if (editingGoal) {
      const updatedGoals = goals.map(g => 
        g.id === editingGoal.id ? { ...g, name: newGoalName.trim() } : g
      );
      saveGoals(updatedGoals);
      toast({ title: 'Goal Updated', description: `Goal "${newGoalName.trim()}" has been updated.` });
    } else {
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        name: newGoalName.trim(),
        type: 'binary',
        createdAt: new Date().toISOString(),
        streak: 0,
        lastCompletedDate: null,
        isCompletedToday: false,
      };
      saveGoals([...goals, newGoal]);
      toast({ title: 'Goal Added', description: `Goal "${newGoal.name}" has been added.` });
    }
    
    setNewGoalName('');
    setIsGoalDialogOpen(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    if (goalToDelete) {
      const updatedGoals = goals.filter(g => g.id !== goalId);
      saveGoals(updatedGoals);
      toast({ title: 'Goal Deleted', description: `Goal "${goalToDelete.name}" has been deleted.` });
    }
  };
  
  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoalName(goal.name);
    setIsGoalDialogOpen(true);
  };

  const logGoalAchievementActivity = () => {
    const goalActivity = ActivityList.find(activity => activity.name === 'Achieved a Daily Goal');
    if (goalActivity) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const storageKey = `karma-${todayStr}`;
        const existingActivities: SelectedKarmaActivity[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Check if this specific activity isn't already logged for today to avoid duplicates from this source
        if (!existingActivities.some(act => act.name === goalActivity.name)) {
            const activityToLog: SelectedKarmaActivity = {
                ...goalActivity,
                mediaDataUri: null,
                mediaType: null,
                quantity: null, // This activity is not typically quantified
            };
            localStorage.setItem(storageKey, JSON.stringify([...existingActivities, activityToLog]));
            toast({ 
                title: 'Journal Updated', 
                description: `'${goalActivity.name}' (+${goalActivity.points} points) added to your journal for today.` 
            });
        }
    }
  };

  const handleToggleGoalCompletion = (goalId: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let goalAchievedToday = false;

    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const isCompleted = !g.isCompletedToday;
        let newStreak = g.streak;
        let newLastCompletedDate = g.lastCompletedDate;

        if (isCompleted) { 
          goalAchievedToday = true; // Mark that a goal was achieved in this toggle action
          newLastCompletedDate = todayStr;
          if (g.lastCompletedDate) {
            const lastCompletion = startOfDay(parseISO(g.lastCompletedDate));
            if (differenceInCalendarDays(startOfDay(new Date()), lastCompletion) === 1 || g.lastCompletedDate === todayStr) {
                if (g.lastCompletedDate !== todayStr) newStreak = g.streak + 1;
            } else if (g.lastCompletedDate !== todayStr) { 
              newStreak = 1; 
            }
          } else { 
            newStreak = 1;
          }
        } else { 
          if (g.lastCompletedDate === todayStr) {
            const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
            if (g.streak > 1) {
                newStreak = g.streak -1;
                newLastCompletedDate = yesterdayStr; 
            } else { // Streak was 1 (started today) or 0
                newStreak = 0;
                newLastCompletedDate = null;
            }
          }
        }
        return { ...g, isCompletedToday: isCompleted, streak: newStreak, lastCompletedDate: newLastCompletedDate };
      }
      return g;
    });
    saveGoals(updatedGoals);

    if(goalAchievedToday){
        logGoalAchievementActivity();
    }
  };


  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Goals</h1>
        <Dialog open={isGoalDialogOpen} onOpenChange={(isOpen) => {
          setIsGoalDialogOpen(isOpen);
          if (!isOpen) {
            setEditingGoal(null);
            setNewGoalName('');
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Update the name of your goal.' : 'Set a new personal goal to track. Currently, only "did it / didn_t do it" type goals are supported.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="goalName"
                placeholder="e.g., Drink 8 glasses of water"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setIsGoalDialogOpen(false); setEditingGoal(null); setNewGoalName('');}}>Cancel</Button>
              <Button onClick={handleAddOrUpdateGoal}>{editingGoal ? 'Update Goal' : 'Add Goal'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="text-center py-10">
          <CardHeader>
            <CardTitle className="text-2xl">No Goals Yet!</CardTitle>
            <CardDescription>Click "Add New Goal" to start tracking your progress.</CardDescription>
          </CardHeader>
          <CardContent>
             <Zap className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Setting goals is the first step towards achieving them.</p>
             <Button asChild className="mt-6">
                <Link href="/home">
                    Reflect in Journal First? <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <Card key={goal.id} className="flex flex-col rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-primary">{goal.name}</CardTitle>
                <CardDescription>
                  Created: {format(parseISO(goal.createdAt), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id={`goal-${goal.id}`}
                    checked={goal.isCompletedToday}
                    onCheckedChange={() => handleToggleGoalCompletion(goal.id)}
                    aria-label={`Mark goal ${goal.name} as completed for today`}
                  />
                  <label
                    htmlFor={`goal-${goal.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {goal.isCompletedToday ? "Completed today!" : "Mark as completed for today"}
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current Streak: <span className="font-semibold text-accent">{goal.streak} day{goal.streak === 1 ? '' : 's'}</span>
                </p>
                 <p className="text-xs text-muted-foreground mt-2">
                  {isToday(parseISO(goal.createdAt)) && !goal.lastCompletedDate && !goal.isCompletedToday ? "New goal! Complete it today to start your streak." : ""}
                  {goal.lastCompletedDate && format(parseISO(goal.lastCompletedDate), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd') && !goal.isCompletedToday && differenceInCalendarDays(new Date(), parseISO(goal.lastCompletedDate)) > 1 ? <span className="text-destructive">Streak broken. Complete today to restart.</span> : ""}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                <Button variant="outline" size="icon" onClick={() => openEditDialog(goal)} aria-label={`Edit goal ${goal.name}`}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteGoal(goal.id)} aria-label={`Delete goal ${goal.name}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <AiCoachFeedback />
      <ScriptureGuidance />
    </div>
  );
}


    