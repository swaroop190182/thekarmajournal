import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export type KarmaActivity = {
    name: string;
    shortName?: string;
    type: string;
    points: number;
    icon?: LucideIcon;
    keywords?: string[];
    requiresPhoto?: boolean;
    quantificationUnit?: string;
    commonTriggers?: string[];
    chemicalRelease?: 'endorphins' | 'serotonin' | 'dopamine' | 'oxytocin' | 'none';
};

// Represents a KarmaActivity that has been selected by the user, potentially with media and quantity.
export interface SelectedKarmaActivity extends KarmaActivity {
  mediaDataUri?: string | null;
  mediaType?: 'image' | 'video' | null;
  quantity?: number | null;
  triggers?: string;
}

export type Goal = {
  id: string;
  name: string;
  type: 'binary';
  createdAt: string; // ISO date string
  lastCompletedDate?: string | null; // ISO date string of the last day it was marked complete
  streak: number;
  isCompletedToday: boolean;
};

export type DailyReflection = {
  date: string; // YYYY-MM-DD
  text: string;
  mood?: string;
};

// Renamed from DailyKarmaLog to better reflect its use in the AI flow
export type AiFlowDailyKarmaLog = {
  date: string;
  activities: SelectedKarmaActivity[];
  score: number;
};

export type DailyLog = {
  date: string; // YYYY-MM-DD
  karmaActivities: SelectedKarmaActivity[];
  goalsCompleted: Goal[];
  reflection?: { text: string; mood?: string };
  karmaScore: number;
  mood?: string;
};


export type MoodOption = {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
};

// Schema for simplified activity details passed to AI flow
export const FlowActivitySchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()).optional(),
  quantificationUnit: z.string().optional(),
});
export type FlowActivity = z.infer<typeof FlowActivitySchema>;

// Type for storing individual journal prompt entries
export type JournalPromptEntry = {
  text: string;
  audioDataUrl?: string | null;
  imageDataUrl?: string | null;
  transcript?: string | null;
};

// Type for storing journal entries for a day (promptId: JournalPromptEntry)
export type JournalEntries = Record<string, JournalPromptEntry>;


// Gamification types
export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon; 
  achievedDate?: string; // ISO date string
  criteriaCount?: number; // e.g., 3 for "3 reflections"
  criteriaType: 'reflections' | 'moodsTrackedWeek' | 'favoriteAffirmations' | 'journalStreak';
};

export type StreakData = {
  type: 'dailyJournaling';
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // ISO date string
};

// Affirmation types
export type AffirmationCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  affirmations: string[] | null; // null for 'My Own Affirmations'
  type: 'standard' | 'customizable' | 'favorites';
  recommendedDuration: string;
  recommendedFrequency: string;
  baseBgClass: string;
  borderClass: string;
  headerBgClass: string;
  footerBgClass: string;
};

// Individual affirmation (simple string for now)
export type Affirmation = string;
