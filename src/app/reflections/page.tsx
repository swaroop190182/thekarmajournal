
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {ScrollArea} from '@/components/ui/scroll-area';
import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import Image from 'next/image';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip, 
  XAxis,
  YAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from 'recharts';
import type { SelectedKarmaActivity, DailyReflection, DailyLog, MoodOption as AppMoodOption, Goal, KarmaActivity, AffirmationCategory as AppAffirmationCategory, Badge, StreakData, DailyNeuroWellnessData, ChemicalName, ChemicalInfo } from '@/app/types';
import type { LucideIcon } from 'lucide-react';
import { ActivityList, chemicalLegend as appChemicalLegend, affirmationsList, badgeDefinitions, moodOptions, chemicalInfos } from '@/app/constants';
import { Calendar } from '@/components/ui/calendar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, startOfDay, isToday, subDays, startOfWeek, endOfWeek, isWithinInterval, getDay, eachDayOfInterval, formatISO, addDays, isValid } from 'date-fns';
import { cn } from "@/lib/utils";
import { 
    Award, TrendingUp, Loader2, Smile, Meh, Frown, Laugh, Angry, BookOpen, CheckCircle2, ListChecks, Palette, CalendarDays, Gift, 
    Activity as DefaultActivityIcon,
    Sunrise, Brain as BrainIconReflections, Repeat as RepeatIconReflections, HeartHandshake as HeartHandshakeIconReflections, 
    Zap as ZapIconReflections, Sparkles as SparklesIconReflections, Edit3 as Edit3IconReflections, Lightbulb, Menu, BookHeart, Palette as PaletteIcon, SmilePlus, TrendingUp as TrendingUpIcon, Coffee, Heart as HeartIcon, Star, Notebook, Target, MessageSquareHeart, HelpCircle, Users2, AlertTriangle, Play, Pause, RotateCcw, TimerIcon,
    Trophy, Sprout, Leaf as LeafIcon, TreePine, Trees as TreesIcon, Wind,
    Brain as BrainDashboardIcon, CheckCheck, BarChartBig
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';


const motivationalSuggestions = [
  "Help someone in need today.",
  "Practice gratitude and appreciate the good in your life.",
  "Take a moment to meditate and clear your mind.",
  "Engage in a random act of kindness.",
  "Spend quality time with loved ones.",
  "Focus on your goals and take steps to achieve them.",
  "Reflect on your progress and celebrate your achievements.",
];

const inspirationalQuotes = [
  "The best way to find yourself is to lose yourself in the service of others. - Mahatma Gandhi",
  "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well. - Ralph Waldo Emerson",
  "Do what you can, with what you have, where you are. - Theodore Roosevelt",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Strive not to be a success, but rather to be of value. - Albert Einstein",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
  "The journey of a thousand miles begins with one step. - Lao Tzu",
  "Our lives begin to end the day we become silent about things that matter. - Martin Luther King Jr.",
];

const quantifiableHabits = ActivityList.filter(
  act => act.type === 'Habit / Addiction' && act.quantificationUnit
);
const trackedItemNames = quantifiableHabits.map(act => act.name);

const REFLECTION_STORAGE_KEY_PREFIX = 'karma-journal-reflection-';
const FAVORITES_STORAGE_KEY = 'karma-journal-favorite-affirmations';
const GOALS_STORAGE_KEY = 'karma-journal-goals';
const JOURNAL_STREAK_STORAGE_KEY = 'karma-journaling-streak';
const ACHIEVED_BADGES_STORAGE_KEY = 'karma-journal-achieved-badges';
const MOOD_CHALLENGE_REWARD_PREFIX = 'mood-challenge-reward-'; 
const NEURO_WELLNESS_STORAGE_KEY_PREFIX = 'neuro-wellness-';


const NUM_HYPOTHETICAL_USERS = 1000;


const affirmationCategoriesData: AppAffirmationCategory[] = [
  {
    id: 'myFavorite', title: 'My Favorites', icon: Star, description: 'Your most cherished affirmations.',
    affirmations: [], type: 'favorites', recommendedDuration: 'As preferred', recommendedFrequency: 'Frequently',
    baseBgClass: 'bg-amber-50 dark:bg-amber-950/40', borderClass: 'border-amber-300 dark:border-amber-700', 
    headerBgClass: 'bg-amber-100 dark:bg-amber-900/60', footerBgClass: 'bg-amber-100 dark:bg-amber-900/60'
  },
  {
    id: 'morningStart', title: 'Morning Start', icon: Sunrise, description: 'Set a purposeful tone for your day.',
    affirmations: [
      "Today, I act with clarity and calm.", "My thoughts are aligned with my highest good.",
      "I welcome this day with gratitude and confidence.", "Every choice I make today moves me closer to balance.",
      "My energy is kind, focused, and unstoppable."
    ],
    type: 'standard', recommendedDuration: '1-3 mins', recommendedFrequency: 'Daily Morning', 
    baseBgClass: 'bg-yellow-50 dark:bg-yellow-950/40', borderClass: 'border-yellow-300 dark:border-yellow-700', 
    headerBgClass: 'bg-yellow-100 dark:bg-yellow-900/60', footerBgClass: 'bg-yellow-100 dark:bg-yellow-900/60'
  },
  {
    id: 'mindfulMoments', title: 'Mindfulness & Presence', icon: BrainIconReflections, description: 'Ground yourself in the now.',
    affirmations: [
      "I am fully present in this moment.", "I observe my thoughts without judgment.",
      "Stillness is my strength.", "I am centered, calm, and in control.",
      "I let go of what I can’t control and breathe deeply."
    ],
    type: 'standard', recommendedDuration: '2-5 mins', recommendedFrequency: 'As Needed',
    baseBgClass: 'bg-blue-50 dark:bg-blue-950/40', borderClass: 'border-blue-300 dark:border-blue-700',
    headerBgClass: 'bg-blue-100 dark:bg-blue-900/60', footerBgClass: 'bg-blue-100 dark:bg-blue-900/60'
  },
  {
    id: 'habitTransformation', title: 'Habit Transformation', icon: RepeatIconReflections, description: 'Reinforce positive routines.',
    affirmations: [
      "Each small habit builds the person I’m becoming.", "Discipline is my daily devotion to growth.",
      "I am consistent, and consistency creates change.", "My habits reflect my values.",
      "I don’t have to be perfect — only committed."
    ],
    type: 'standard', recommendedDuration: '1-2 mins per habit', recommendedFrequency: 'Daily with Habit',
    baseBgClass: 'bg-purple-50 dark:bg-purple-950/40', borderClass: 'border-purple-300 dark:border-purple-700',
    headerBgClass: 'bg-purple-100 dark:bg-purple-900/60', footerBgClass: 'bg-purple-100 dark:bg-purple-900/60'
  },
  {
    id: 'kindnessKarma', title: 'Compassion & Karma', icon: HeartHandshakeIconReflections, description: 'Connect actions with intention.',
    affirmations: [
      "I give without expecting — and receive with humility.", "My karma is built through love, honesty, and service.",
      "I release resentment and choose forgiveness.", "I plant seeds of kindness and water them daily.",
      "I forgive myself for past missteps and move forward in peace."
    ],
    type: 'standard', recommendedDuration: '2-3 mins', recommendedFrequency: 'Daily Reflection',
    baseBgClass: 'bg-pink-50 dark:bg-pink-950/40', borderClass: 'border-pink-300 dark:border-pink-700',
    headerBgClass: 'bg-pink-100 dark:bg-pink-900/60', footerBgClass: 'bg-pink-100 dark:bg-pink-900/60'
  },
  {
    id: 'actionMotivation', title: 'Action & Motivation', icon: ZapIconReflections, description: 'Push through inertia.',
    affirmations: [
      "I am capable of more than I imagine.", "I move from intention to action with ease.",
      "My purpose fuels my progress.", "I don’t wait for motivation — I create it.",
      "I take responsibility for my energy."
    ],
    type: 'standard', recommendedDuration: '1-2 mins', recommendedFrequency: 'When Feeling Stuck',
    baseBgClass: 'bg-red-50 dark:bg-red-950/40', borderClass: 'border-red-300 dark:border-red-700',
    headerBgClass: 'bg-red-100 dark:bg-red-900/60', footerBgClass: 'bg-red-100 dark:bg-red-900/60'
  },
  {
    id: 'gratitudePositivity', title: 'Gratitude & Positivity', icon: Gift, description: 'Elevate your perspective.',
    affirmations: [
      "Gratitude turns my challenges into gifts.", "There is beauty in this moment.",
      "I attract goodness because I radiate it.", "Joy flows through me effortlessly.",
      "I choose to see the light in every situation."
    ],
    type: 'standard', recommendedDuration: '2-3 mins', recommendedFrequency: 'Daily or Evening',
    baseBgClass: 'bg-green-50 dark:bg-green-950/40', borderClass: 'border-green-300 dark:border-green-700',
    headerBgClass: 'bg-green-100 dark:bg-green-900/60', footerBgClass: 'bg-green-100 dark:bg-green-900/60'
  },
  {
    id: 'selfCare', title: 'Self Care & Peace', icon: HeartIcon, description: 'Nourish your body and mind.',
    affirmations: [
      "I nourish my body, mind, and spirit.", "I deserve rest and rejuvenation.",
      "I am worthy of love and care, especially from myself.", "I listen to my body's needs and honor them.",
      "Taking care of myself is productive and necessary.", "I choose peace over worry."
    ],
    type: 'standard', recommendedDuration: '3-5 mins', recommendedFrequency: 'Daily As Needed',
    baseBgClass: 'bg-teal-50 dark:bg-teal-950/40', borderClass: 'border-teal-300 dark:border-teal-700',
    headerBgClass: 'bg-teal-100 dark:bg-teal-900/60', footerBgClass: 'bg-teal-100 dark:bg-teal-900/60'
  },
  {
    id: 'bodyPositivity', title: 'Body Positivity', icon: SmilePlus, description: 'Appreciate your unique self.',
    affirmations: [
      "My body is a vessel of strength and resilience.", "I appreciate my body for all it allows me to do.",
      "I am beautiful and unique, exactly as I am.", "I treat my body with kindness and respect.",
      "I am at peace with my body."
    ],
    type: 'standard', recommendedDuration: '1-3 mins', recommendedFrequency: 'Daily',
    baseBgClass: 'bg-indigo-50 dark:bg-indigo-950/40', borderClass: 'border-indigo-300 dark:border-indigo-700',
    headerBgClass: 'bg-indigo-100 dark:bg-indigo-900/60', footerBgClass: 'bg-indigo-100 dark:bg-indigo-900/60'
  },
  {
    id: 'personalGrowth', title: 'Personal Growth', icon: TrendingUpIcon, description: 'Embrace your journey of evolution.',
    affirmations: [
      "I am constantly evolving and growing.", "Every experience is a lesson.",
      "I embrace challenges as opportunities for growth.", "I am capable of achieving my dreams.",
      "I am committed to becoming the best version of myself."
    ],
    type: 'standard', recommendedDuration: '2-4 mins', recommendedFrequency: 'Weekly Reflection',
    baseBgClass: 'bg-sky-50 dark:bg-sky-950/40', borderClass: 'border-sky-300 dark:border-sky-700',
    headerBgClass: 'bg-sky-100 dark:bg-sky-900/60', footerBgClass: 'bg-sky-100 dark:bg-sky-900/60'
  },
   {
    id: 'successAffirmations', title: 'Success & Achievement', icon: Award, description: 'Cultivate a mindset of success and accomplishment.',
    affirmations: [
      "I am capable of achieving great things.", "Success flows to me easily and effortlessly.",
      "I attract opportunities that align with my goals.", "Every step I take brings me closer to my definition of success.",
      "I celebrate my achievements, big and small."
    ],
    type: 'standard', recommendedDuration: '2-4 mins', recommendedFrequency: 'Daily or Before Important Tasks',
    baseBgClass: 'bg-orange-50 dark:bg-orange-950/40', borderClass: 'border-orange-300 dark:border-orange-700',
    headerBgClass: 'bg-orange-100 dark:bg-orange-900/60', footerBgClass: 'bg-orange-100 dark:bg-orange-900/60'
  },
  {
    id: 'myOwn', title: 'My Own Affirmations', icon: Edit3IconReflections, description: 'Craft your personal statements.',
    affirmations: null, type: 'customizable', recommendedDuration: 'As needed', recommendedFrequency: 'User-defined',
    baseBgClass: 'bg-gray-50 dark:bg-gray-800/40', borderClass: 'border-gray-300 dark:border-gray-600',
    headerBgClass: 'bg-gray-100 dark:bg-gray-700/60', footerBgClass: 'bg-gray-100 dark:bg-gray-700/60'
  },
];

const customizableTemplates = [
  { template: "I am __________.", example: "e.g., I am confident and capable." },
  { template: "I choose to __________.", example: "e.g., I choose to see the good in every situation." },
  { template: "I release __________ and welcome __________.", example: "e.g., I release fear and welcome courage." },
  { template: "My __________ is/are __________.", example: "e.g., My mind is calm and focused." },
  { template: "I am grateful for __________.", example: "e.g., I am grateful for the love in my life." },
  { template: "Today, I will __________.", example: "e.g., Today, I will take one step towards my goal." },
];

const chemicalCalendarBgClasses: Record<NonNullable<KarmaActivity['chemicalRelease']>, string> = {
    endorphins: "bg-orange-500/20 dark:bg-orange-700/30",
    serotonin: "bg-green-500/20 dark:bg-green-700/30",
    dopamine: "bg-purple-500/20 dark:bg-purple-700/30",
    oxytocin: "bg-pink-500/20 dark:bg-pink-700/30",
    none: "", 
};


const ReflectionsPage = () => {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month'>('week');
  const [karmaData, setKarmaData] = useState<{date: string; score: number}[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [quote, setQuote] = useState('');

  const [selectedTrackedItems, setSelectedTrackedItems] = useState<string[]>([]);
  const [trackedItemChartData, setTrackedItemChartData] = useState<any[]>([]);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(new Date());
  const [reflectionText, setReflectionText] = useState('');
  const [isReflectionDialogOpen, setIsReflectionDialogOpen] = useState(false);
  const [reflectionLog, setReflectionLog] = useState<{[date: string]: {text: string, mood?: string}}>({});
  
  const { toast } = useToast();

  const [hypotheticalScores, setHypotheticalScores] = useState<number[]>([]);
  const [userWeeklyScore, setUserWeeklyScore] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [rankMessage, setRankMessage] = useState<string>('');
  const [isLoadingRank, setIsLoadingRank] = useState<boolean>(true);

  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<DailyLog | null>(null);

  const [isAffirmationDialogVisible, setIsAffirmationDialogVisible] = useState(false);
  const [currentAffirmationCategory, setCurrentAffirmationCategory] = useState<AppAffirmationCategory | null>(null);
  const [isCustomDialogVisible, setIsCustomDialogVisible] = useState(false);

  const [favoriteAffirmations, setFavoriteAffirmations] = useState<string[]>([]);

  const timerDuration = 15; 
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [affirmationTimerCategory, setAffirmationTimerCategory] = useState<AppAffirmationCategory | null>(null);

  const [achievedBadges, setAchievedBadges] = useState<Badge[]>([]);
  const [journalEntryCount, setJournalEntryCount] = useState(0);
  const [moodsTrackedThisWeek, setMoodsTrackedThisWeek] = useState(0);
  const [moodChallengeRewardUnlocked, setMoodChallengeRewardUnlocked] = useState(false);
  const [journalingStreak, setJournalingStreak] = useState<StreakData | null>(null);
  const [isBadgeDetailsDialogOpen, setIsBadgeDetailsDialogOpen] = useState(false);
  const [selectedBadgeForDetails, setSelectedBadgeForDetails] = useState<Badge | null>(null);

  // Neuro-Wellness States
  const [dailyNeuroWellness, setDailyNeuroWellness] = useState<DailyNeuroWellnessData | null>(null);
  const [weeklyNeuroData, setWeeklyNeuroData] = useState<DailyNeuroWellnessData[]>([]);
  const [isNeuroWellnessLoading, setIsNeuroWellnessLoading] = useState(false);
  const [isChemicalDetailDialogOpen, setIsChemicalDetailDialogOpen] = useState(false);
  const [selectedChemicalForDialog, setSelectedChemicalForDialog] = useState<ChemicalInfo | null>(null);


  const calculateDailyNeuroWellnessScores = useCallback((targetDate: Date) => {
    if (typeof window === 'undefined') return;
    setIsNeuroWellnessLoading(true);
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    const neuroStorageKey = `${NEURO_WELLNESS_STORAGE_KEY_PREFIX}${dateStr}`;
    
    // Always calculate fresh scores from karma activities
    const activitiesString = localStorage.getItem(`karma-${dateStr}`);
    let dailyActivities: SelectedKarmaActivity[] = [];
    if (activitiesString) {
      try {
        dailyActivities = JSON.parse(activitiesString);
      } catch (e) {
        console.error("Error parsing activities for neuro wellness calculation", e);
      }
    }

    const newScores: DailyNeuroWellnessData = {
      date: dateStr,
      dopamine: { score: 0, activityCount: 0 },
      serotonin: { score: 0, activityCount: 0 },
      oxytocin: { score: 0, activityCount: 0 },
      endorphins: { score: 0, activityCount: 0 },
    };

    dailyActivities.forEach(activity => {
      const activityDef = ActivityList.find(a => a.name === activity.name);
      if (activityDef && activityDef.chemicalRelease && activityDef.chemicalRelease !== 'none') {
        const chemical = activityDef.chemicalRelease;
        if (newScores[chemical].score < 100) {
          newScores[chemical].score = Math.min(100, newScores[chemical].score + 20); 
        }
        newScores[chemical].activityCount += 1;
      }
    });
    
    localStorage.setItem(neuroStorageKey, JSON.stringify(newScores)); // Save the newly calculated scores
    setDailyNeuroWellness(newScores);
    setIsNeuroWellnessLoading(false);
  }, []);

  const fetchWeeklyNeuroData = useCallback((endDate: Date) => {
    if (typeof window === 'undefined') return;
    const data: DailyNeuroWellnessData[] = [];
    for (let i = 6; i >= 0; i--) {
        const targetDate = subDays(endDate, i);
        const dateStr = format(targetDate, 'yyyy-MM-dd');
        const neuroStorageKey = `${NEURO_WELLNESS_STORAGE_KEY_PREFIX}${dateStr}`;
        const storedData = localStorage.getItem(neuroStorageKey);
        if (storedData) {
            try {
                data.push(JSON.parse(storedData));
            } catch (e) {
                console.warn("Could not parse stored neuro data for weekly trend for date:", dateStr);
                 data.push({ date: dateStr, dopamine: {score:0, activityCount:0}, serotonin: {score:0, activityCount:0}, oxytocin: {score:0, activityCount:0}, endorphins: {score:0, activityCount:0} });
            }
        } else {
            data.push({ date: dateStr, dopamine: {score:0, activityCount:0}, serotonin: {score:0, activityCount:0}, oxytocin: {score:0, activityCount:0}, endorphins: {score:0, activityCount:0} });
        }
    }
    setWeeklyNeuroData(data);
  }, []);

  useEffect(() => {
    if (selectedCalendarDate) {
        calculateDailyNeuroWellnessScores(selectedCalendarDate);
        fetchWeeklyNeuroData(selectedCalendarDate);
    }
  }, [selectedCalendarDate, reflectionLog, calculateDailyNeuroWellnessScores, fetchWeeklyNeuroData]);


  const checkAndAwardBadges = useCallback(() => {
    if (typeof window === 'undefined') return;
    let newBadgesEarnedThisCheck = false;
    const currentBadgesFullObjects = [...achievedBadges]; 
    const currentAchievedBadgeIds = new Set(currentBadgesFullObjects.map(b => b.id));

    const totalReflections = Object.keys(reflectionLog).length;
    const currentJournalStreak = journalingStreak?.currentStreak ?? 0;

    badgeDefinitions.forEach(badgeDef => {
      if (currentAchievedBadgeIds.has(badgeDef.id)) return; 

      let earned = false;
      switch (badgeDef.criteriaType) {
        case 'reflections':
          if (badgeDef.criteriaCount && totalReflections >= badgeDef.criteriaCount) earned = true;
          break;
        case 'moodsTrackedWeek':
          if (badgeDef.criteriaCount && moodsTrackedThisWeek >= badgeDef.criteriaCount) earned = true;
          break;
        case 'favoriteAffirmations':
          if (badgeDef.criteriaCount && favoriteAffirmations.length >= badgeDef.criteriaCount) earned = true;
          break;
        case 'journalStreak':
          if (badgeDef.criteriaCount && currentJournalStreak >= badgeDef.criteriaCount) earned = true;
          break;
        case 'neuroBalanceDay':
          if (dailyNeuroWellness &&
              dailyNeuroWellness.dopamine.score >= 70 &&
              dailyNeuroWellness.serotonin.score >= 70 &&
              dailyNeuroWellness.oxytocin.score >= 70 &&
              dailyNeuroWellness.endorphins.score >= 70) {
            earned = true;
          }
          break;
        case 'serotoninSustainerWeek':
            let serotoninDays = 0;
            const today = selectedCalendarDate ? selectedCalendarDate : new Date();
            for (let i = 0; i < 7; i++) {
                const dayToCheck = subDays(today, i);
                const dateStr = format(dayToCheck, 'yyyy-MM-dd');
                const neuroDataStr = localStorage.getItem(`${NEURO_WELLNESS_STORAGE_KEY_PREFIX}${dateStr}`);
                if (neuroDataStr) {
                    try {
                        const neuroData: DailyNeuroWellnessData = JSON.parse(neuroDataStr);
                        if (neuroData.serotonin.activityCount > 0) { 
                            serotoninDays++;
                        }
                    } catch(e) { console.warn("Error parsing neuro data for serotonin badge check", e); }
                }
            }
            if (serotoninDays >= 5) earned = true;
            break;
      }

      if (earned) {
        const newBadge: Badge = { ...badgeDef, achievedDate: new Date().toISOString() };
        currentBadgesFullObjects.push(newBadge);
        newBadgesEarnedThisCheck = true;
        toast({
          title: "✨ Badge Unlocked! ✨",
          description: `You've earned the "${newBadge.name}" badge!`,
        });
      }
    });

    if (newBadgesEarnedThisCheck) {
      setAchievedBadges(currentBadgesFullObjects);
      const lightBadgesToStore = currentBadgesFullObjects.map(b => ({ id: b.id, achievedDate: b.achievedDate! }));
      localStorage.setItem(ACHIEVED_BADGES_STORAGE_KEY, JSON.stringify(lightBadgesToStore));
    }
  }, [achievedBadges, reflectionLog, favoriteAffirmations.length, moodsTrackedThisWeek, toast, journalingStreak, dailyNeuroWellness, selectedCalendarDate]);

  const calculateMoodsTrackedThisWeek = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    const today = selectedCalendarDate || new Date(); 
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    let count = 0;
    Object.keys(reflectionLog).forEach(dateStr => {
      const reflectionDate = parseISO(dateStr);
      if (isWithinInterval(reflectionDate, { start: weekStart, end: weekEnd }) && reflectionLog[dateStr]?.mood) {
        count++;
      }
    });
    return count;
  }, [reflectionLog, selectedCalendarDate]);

  useEffect(() => {
    const count = calculateMoodsTrackedThisWeek();
    setMoodsTrackedThisWeek(count);
    
    const currentWeekNumber = format(selectedCalendarDate || new Date(), 'w');
    const rewardKey = `${MOOD_CHALLENGE_REWARD_PREFIX}${currentWeekNumber}`;
    const alreadyUnlockedThisWeek = localStorage.getItem(rewardKey) === 'true';

    if (count >= 5 && !alreadyUnlockedThisWeek) {
      setMoodChallengeRewardUnlocked(true);
      localStorage.setItem(rewardKey, 'true');
      toast({
        title: "Mood Challenge Reward!",
        description: "You've tracked your mood 5+ days this week! Unlocked: Guided Breathing Exercise (Conceptual)."
      });
    } else if (alreadyUnlockedThisWeek) {
      setMoodChallengeRewardUnlocked(true);
    } else {
      setMoodChallengeRewardUnlocked(false);
    }
  }, [reflectionLog, toast, calculateMoodsTrackedThisWeek, selectedCalendarDate]);


  useEffect(() => {
    const storedKarma: {date: string; score: number}[] = [];
    const loadedReflections: {[date: string]: {text: string, mood?: string}} = {};
    let loadedJournalingStreak: StreakData | null = null;
    let loadedAchievedBadgesFromStorage: Badge[] = [];
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavoriteAffirmations(JSON.parse(storedFavorites));
      }

      const storedStreak = localStorage.getItem(JOURNAL_STREAK_STORAGE_KEY);
      if (storedStreak) loadedJournalingStreak = JSON.parse(storedStreak);
      setJournalingStreak(loadedJournalingStreak);

      const storedAchievedBadgesData = localStorage.getItem(ACHIEVED_BADGES_STORAGE_KEY);
        if (storedAchievedBadgesData) {
            try {
                const lightBadges: { id: string, achievedDate: string }[] = JSON.parse(storedAchievedBadgesData);
                loadedAchievedBadgesFromStorage = lightBadges.map(lb => {
                    const fullBadgeDef = badgeDefinitions.find(bd => bd.id === lb.id);
                    const achievedDate = lb.achievedDate || new Date().toISOString();
                    return fullBadgeDef ? { ...fullBadgeDef, achievedDate } : null;
                }).filter(Boolean) as Badge[];
            } catch (e) {
                console.error("Error parsing achieved badges from localStorage", e);
                loadedAchievedBadgesFromStorage = [];
            }
        }
      setAchievedBadges(loadedAchievedBadgesFromStorage);


      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('karma-')) {
          const dateStr = key.replace('karma-', '');
          if (datePattern.test(dateStr) && 
              !key.startsWith(REFLECTION_STORAGE_KEY_PREFIX) && 
              !key.startsWith(NEURO_WELLNESS_STORAGE_KEY_PREFIX) &&
              !key.startsWith('karma-journal-goals') && 
              !key.startsWith('karma-journal-text-') && 
              !key.startsWith('karma-journal-favorite-affirmations') && 
              !key.startsWith('karma-journaling-streak') && 
              !key.startsWith('karma-journal-achieved-badges')) {
              
              if (datePattern.test(dateStr) && isValid(parseISO(dateStr))) {
                try {
                  const activitiesString = localStorage.getItem(key);
                  const activitiesData = activitiesString ? JSON.parse(activitiesString) : [];
                  
                  if (Array.isArray(activitiesData)) {
                    const activities: SelectedKarmaActivity[] = activitiesData;
                    const score = activities.reduce((sum: number, activity: SelectedKarmaActivity) => {
                        let pointsToAward = activity.points;
                        if (activity.requiresPhoto && !activity.mediaDataUri) {
                            pointsToAward = Math.round(activity.points * 0.7);
                        }
                        return sum + pointsToAward;
                    }, 0);
                    storedKarma.push({date: dateStr, score});
                  } else {
                     console.warn(`Data for key ${key} (date: ${dateStr}) is not an array. Skipping score calculation.`);
                  }
                } catch (error) {
                  console.error('Error parsing karma data for date', dateStr, error);
                }
              }
          }
        }
        if (key && key.startsWith(REFLECTION_STORAGE_KEY_PREFIX)) {
          const dateStr = key.replace(REFLECTION_STORAGE_KEY_PREFIX, '');
          if (datePattern.test(dateStr) && isValid(parseISO(dateStr))) {
            try {
                const storedReflection = localStorage.getItem(key);
                if (storedReflection) {
                loadedReflections[dateStr] = JSON.parse(storedReflection);
                }
            } catch (e) {
                const text = localStorage.getItem(key);
                if (text) loadedReflections[dateStr] = { text };
                console.warn('Could not parse reflection as JSON for', dateStr, 'treating as text-only if possible.');
            }
          }
        }
      }
    }
    storedKarma.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setKarmaData(storedKarma);
    setReflectionLog(loadedReflections);
    setJournalEntryCount(Object.keys(loadedReflections).length);

    setSuggestion(motivationalSuggestions[Math.floor(Math.random() * motivationalSuggestions.length)]);
    setQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);

  }, []); 

  useEffect(() => {
    checkAndAwardBadges();
  }, [reflectionLog, moodsTrackedThisWeek, favoriteAffirmations, journalingStreak, dailyNeuroWellness, checkAndAwardBadges]);


  useEffect(() => {
    setSuggestion(motivationalSuggestions[Math.floor(Math.random() * motivationalSuggestions.length)]);
    setQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
  }, [timePeriod]);


   useEffect(() => {
    if (typeof window === 'undefined' || selectedTrackedItems.length === 0) {
      setTrackedItemChartData([]);
      return;
    }
    const data: {[date: string]: any} = {}; 
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('karma-')) {
        const date = key.replace('karma-', '');
         if (datePattern.test(date) && 
             !key.startsWith(REFLECTION_STORAGE_KEY_PREFIX) &&
             !key.startsWith(NEURO_WELLNESS_STORAGE_KEY_PREFIX) &&
             !key.startsWith('karma-journal-goals') && 
             !key.startsWith('karma-journal-text-') && 
             !key.startsWith('karma-journal-favorite-affirmations')) {
            try {
            const activities: SelectedKarmaActivity[] = JSON.parse(localStorage.getItem(key) || '[]');
            activities.forEach(activity => {
                if (selectedTrackedItems.includes(activity.name) && activity.quantity !== null && activity.quantity !== undefined) {
                if (!data[date]) {
                    data[date] = { date };
                    selectedTrackedItems.forEach(sa => { data[date][sa] = undefined; });
                }
                data[date][activity.name] = activity.quantity;
                }
            });
            } catch (error) { console.error('Error parsing karma data for habit/addiction chart', date, error); }
        }
      }
    }
    const processedData = Object.values(data)
      .map(d => { 
        selectedTrackedItems.forEach(sa => { if (!(sa in d)) { d[sa] = undefined; } });
        return d;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setTrackedItemChartData(processedData);
  }, [selectedTrackedItems]);

  useEffect(() => {
    const scores = Array.from({ length: NUM_HYPOTHETICAL_USERS }, () => Math.floor(Math.random() * 301) - 50);
    setHypotheticalScores(scores);
  }, []);

  useEffect(() => {
    if (karmaData.length === 0 && hypotheticalScores.length === 0) { setIsLoadingRank(false); return; }
    setIsLoadingRank(true);
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); 
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const currentWeekKarmaData = karmaData.filter(item => {
      const itemDate = parseISO(item.date);
      return isWithinInterval(itemDate, { start: weekStart, end: weekEnd });
    });
    const weeklyScore = currentWeekKarmaData.reduce((sum, item) => sum + item.score, 0);
    setUserWeeklyScore(weeklyScore);

    if (hypotheticalScores.length > 0) {
      const allScores = [...hypotheticalScores, weeklyScore].sort((a, b) => b - a);
      const rank = allScores.indexOf(weeklyScore) + 1;
      setUserRank(rank);
      const totalParticipants = NUM_HYPOTHETICAL_USERS + 1;
      const percentile = (rank / totalParticipants) * 100;
      if (percentile <= 1) { setRankMessage(`You're a Karma Champion! Ranked #${rank} (Top 1%)`); }
      else if (percentile <= 10) { setRankMessage(`Amazing Effort! Ranked #${rank} (Top 10%)`); }
      else if (percentile <= 25) { setRankMessage(`Great Work! Ranked #${rank} (Top 25%)`); }
      else if (percentile <= 50) { setRankMessage(`You're Doing Well! Ranked #${rank} (Top 50%)`); }
      else { setRankMessage(`Keep Building Your Karma! Ranked #${rank}`); }
    }
    setIsLoadingRank(false);
  }, [karmaData, hypotheticalScores]);

  const karmaChartConfig = {
    score: { label: 'Karma Score', color: 'hsl(var(--primary))' },
    date: { label: 'Date' },
  } satisfies ChartConfig;

  const chartData = timePeriod === 'week' ? karmaData.slice(-7) : karmaData;

  const handleTrackedItemSelectionChange = (itemName: string, checked: boolean) => {
    setSelectedTrackedItems(prev => checked ? [...prev, itemName] : prev.filter(name => name !== itemName));
  };

  const trackedItemChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    selectedTrackedItems.forEach((itemName, index) => {
        const itemDetails = quantifiableHabits.find(a => a.name === itemName);
        config[itemName] = {
            label: `${itemName} (${itemDetails?.quantificationUnit || ''})`,
            color: `hsl(var(--chart-${(index % 10) + 1}))` as `hsl(${string})`,
        };
    });
    return config;
  }, [selectedTrackedItems]);

  const handleDateSelectForSummary = useCallback((date: Date | undefined) => {
    if (!date || typeof window === 'undefined') return;
    setSelectedCalendarDate(date); 
    const formattedDate = format(date, 'yyyy-MM-dd');

    let dailyActivities: SelectedKarmaActivity[] = [];
    let dailyScore = 0;
    const activitiesString = localStorage.getItem(`karma-${formattedDate}`);
    if (activitiesString) {
      try {
        dailyActivities = JSON.parse(activitiesString);
        dailyScore = dailyActivities.reduce((sum, activity) => {
            let pointsToAward = activity.points;
            if (activity.requiresPhoto && !activity.mediaDataUri) {
                pointsToAward = Math.round(activity.points * 0.7);
            }
            return sum + pointsToAward;
        }, 0);
      } catch (e) { console.error("Error parsing activities for summary", e); }
    }
    
    let dailyReflectionEntry: {text: string, mood?: string} | undefined = undefined;
    const reflectionString = localStorage.getItem(`${REFLECTION_STORAGE_KEY_PREFIX}${formattedDate}`);
    if (reflectionString) {
        try { dailyReflectionEntry = JSON.parse(reflectionString); }
        catch (e) { dailyReflectionEntry = {text: reflectionString}; } 
    }

    let dailyGoalsCompleted: Goal[] = [];
    const goalsString = localStorage.getItem(GOALS_STORAGE_KEY);
    if (goalsString) {
        try {
            const allGoals: Goal[] = JSON.parse(goalsString);
            dailyGoalsCompleted = allGoals.filter(goal => goal.lastCompletedDate === formattedDate);
        } catch (e) { console.error("Error parsing goals for summary", e); }
    }
    
    setSummaryData({
        date: formattedDate,
        karmaActivities: dailyActivities,
        goalsCompleted: dailyGoalsCompleted,
        reflection: dailyReflectionEntry,
        karmaScore: dailyScore,
        mood: dailyReflectionEntry?.mood,
    });
    setIsSummaryDialogOpen(true);
  }, []);

  const handleOpenReflectionDialogFromSummary = () => {
    if (summaryData) {
      setReflectionText(summaryData.reflection?.text || '');
      
      setIsReflectionDialogOpen(true);
    }
  };

  const handleSaveReflection = () => {
    if (selectedCalendarDate && typeof window !== 'undefined') {
      const dateStr = format(selectedCalendarDate, 'yyyy-MM-dd');
      const existingReflectionData = reflectionLog[dateStr] || {};
      const reflectionData = { 
        text: reflectionText, 
        mood: existingReflectionData.mood 
      };
      const updatedReflections = { ...reflectionLog, [dateStr]: reflectionData };
      
      localStorage.setItem(REFLECTION_STORAGE_KEY_PREFIX + dateStr, JSON.stringify(reflectionData));
      setReflectionLog(updatedReflections);
      setJournalEntryCount(Object.keys(updatedReflections).length);

      if (summaryData && summaryData.date === dateStr) {
        setSummaryData(prev => prev ? {...prev, reflection: reflectionData } : null);
      }

      toast({ title: 'Reflection Saved', description: `Your reflection for ${dateStr} has been saved.` });
      setIsReflectionDialogOpen(false);
      setReflectionText('');
      calculateDailyNeuroWellnessScores(selectedCalendarDate); 
    }
  };
  
  const getMoodForDay = (date: Date): AppMoodOption | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const reflection = reflectionLog[dateStr];
    return reflection?.mood ? moodOptions.find(m => m.id === reflection.mood) : undefined;
  };

  const dayOfWeekBackgrounds = [
    "bg-red-50 dark:bg-red-950/70",      
    "bg-orange-50 dark:bg-orange-950/70", 
    "bg-amber-50 dark:bg-amber-950/70",  
    "bg-yellow-50 dark:bg-yellow-950/70",
    "bg-lime-50 dark:bg-lime-950/70",    
    "bg-green-50 dark:bg-green-950/70",  
    "bg-emerald-50 dark:bg-emerald-950/70"
  ];

  const CustomDayCell = ({ date, displayMonth }: { date: Date; displayMonth: Date }) => {
    const isOutside = date.getMonth() !== displayMonth.getMonth();
    const formattedDate = format(date, 'yyyy-MM-dd');
  
    const [cellData, setCellData] = useState<{
      activities: SelectedKarmaActivity[];
      score: number;
      selfie: SelectedKarmaActivity | undefined;
      predominantChemical: string | null;
      loaded: boolean;
    }>({ activities: [], score: 0, selfie: undefined, predominantChemical: null, loaded: false });
  
    useEffect(() => {
      if (isOutside || typeof window === 'undefined') {
        setCellData({ activities: [], score: 0, selfie: undefined, predominantChemical: null, loaded: true });
        return;
      }
  
      const activitiesString = localStorage.getItem(`karma-${formattedDate}`);
      let dailyActivities: SelectedKarmaActivity[] = [];
      let dailyScoreValue = 0;
      let selfieActivityValue: SelectedKarmaActivity | undefined = undefined;

      if (activitiesString) {
        try {
          dailyActivities = JSON.parse(activitiesString) as SelectedKarmaActivity[];
          dailyScoreValue = dailyActivities.reduce((sum, activity) => {
            let pointsToAward = activity.points;
            if (activity.requiresPhoto && !activity.mediaDataUri) {
              pointsToAward = Math.round(activity.points * 0.7);
            }
            return sum + pointsToAward;
          }, 0);
          selfieActivityValue = dailyActivities.find(act => act.name === "Daily Selfie" && act.mediaDataUri && act.mediaType === 'image');
        } catch (e) { console.error("Error parsing activities for cell", e); }
      }
      
      const neuroDataStr = localStorage.getItem(`${NEURO_WELLNESS_STORAGE_KEY_PREFIX}${formattedDate}`);
      let predominantChemicalValue: string | null = null;
      if (neuroDataStr) {
        try {
            const neuroData: DailyNeuroWellnessData = JSON.parse(neuroDataStr);
            let maxScore = -1;
            let contenders: ChemicalName[] = [];
            (Object.keys(neuroData) as ChemicalName[]).filter(key => key !== 'date').forEach(chem => {
                if (neuroData[chem].score > maxScore) {
                    maxScore = neuroData[chem].score;
                    contenders = [chem];
                } else if (neuroData[chem].score === maxScore && maxScore > 0) {
                    contenders.push(chem);
                }
            });
            if (maxScore > 0 && contenders.length === 1) {
                 predominantChemicalValue = contenders[0];
            }
        } catch (e) { console.warn("Error parsing neuro data for cell", e); }
      }
      
      setCellData({ activities: dailyActivities, score: dailyScoreValue, selfie: selfieActivityValue, predominantChemical: predominantChemicalValue, loaded: true });
  
    }, [formattedDate, isOutside, reflectionLog]); 
    
    let baseBgClass = dayOfWeekBackgrounds[getDay(date)];

    if (cellData.loaded && cellData.predominantChemical && cellData.predominantChemical !== 'none' && !isOutside) {
        baseBgClass = chemicalCalendarBgClasses[cellData.predominantChemical as NonNullable<KarmaActivity['chemicalRelease']>] || baseBgClass;
    }
  
    let finalCellBgClass = baseBgClass;
    if (isToday(date) && !isOutside) {
        finalCellBgClass = cn('bg-accent/20 border-2 border-primary/50 dark:bg-accent/40', baseBgClass);
    } else if (isOutside) {
        finalCellBgClass = 'bg-muted/20 text-muted-foreground/40 pointer-events-none';
    }
  
    if (!cellData.loaded && !isOutside) {
      return (
        <div className={cn("h-32 text-left p-1.5 border border-border/60 overflow-hidden relative flex flex-col items-start justify-start cursor-pointer", finalCellBgClass)}>
          <div className="flex justify-between w-full items-start mb-0.5">
            <span className={cn("text-xs font-semibold", isToday(date) && !isOutside ? "text-primary dark:text-primary-foreground" : "text-muted-foreground")}>
              {format(date, 'd')}
            </span>
          </div>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground m-auto" />
        </div>
      );
    }

    return (
      <div 
        className={cn(
          "h-32 text-left p-1.5 border border-border/60 overflow-hidden relative flex flex-col items-start justify-start cursor-pointer",
          finalCellBgClass,
          !isOutside && "hover:brightness-95 dark:hover:brightness-110 transition-all duration-150" 
        )}
        onClick={() => !isOutside && handleDateSelectForSummary(date)}
      >
        <div className="flex justify-between w-full items-start mb-0.5">
          <span className={cn("text-xs font-semibold", isToday(date) && !isOutside ? "text-primary dark:text-primary-foreground" : "text-muted-foreground")}>
            {format(date, 'd')}
          </span>
          {cellData.score !== 0 && !isOutside && (
              <span className={cn("text-xs font-bold", cellData.score > 0 ? "text-green-600 dark:text-green-400" : cellData.score < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                {cellData.score > 0 ? `+${cellData.score}` : cellData.score}
              </span>
            )}
        </div>
        
        <div className="flex items-center flex-wrap space-x-1 mt-1 min-h-[20px] flex-grow">
          {cellData.activities.slice(0, 3).map((activity, index) => {
            const activityDetails = ActivityList.find(a => a.name === activity.name);
            const IconComponent = activityDetails?.icon || DefaultActivityIcon;
            const iconColor = activity.points > 0 ? 'text-green-500 dark:text-green-400' : activity.points < 0 ? 'text-red-500 dark:text-red-400' : 'text-muted-foreground';
            return (
              <Tooltip key={`act-icon-${index}-${activity.name}`} delayDuration={100}>
                <TooltipTrigger asChild>
                  <div><IconComponent className={cn("h-4 w-4", iconColor)} /></div>
                </TooltipTrigger>
                <TooltipContent side="top"><p>{activity.name}</p></TooltipContent>
              </Tooltip>
            );
          })}
          {cellData.activities.length > 3 && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <span className="text-xs text-muted-foreground self-center pt-0.5">+{cellData.activities.length - 3}</span>
              </TooltipTrigger>
              <TooltipContent side="top"><p>{cellData.activities.length - 3} more activities</p></TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="mt-auto w-full flex justify-between items-end min-h-[44px]">
            <div className="flex-grow self-end">
                {!isOutside && cellData.activities.length === 0 && !cellData.selfie && reflectionLog[formattedDate]?.text && (
                    <div className="flex items-center text-xs text-muted-foreground/80 italic">
                        <BookOpen className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                        <span className="truncate">Reflection</span>
                    </div>
                )}
                {!isOutside && cellData.activities.length === 0 && !cellData.selfie && !reflectionLog[formattedDate]?.text && (
                    <p className="text-xs text-muted-foreground/60 italic">No entries</p>
                )}
            </div>
            <div className="flex-shrink-0">
                {cellData.selfie && cellData.selfie.mediaDataUri && (
                    <Image src={cellData.selfie.mediaDataUri} alt="Logged Selfie" width={40} height={40} className="h-10 w-10 rounded-md object-cover border-2 border-border shadow-sm" />
                )}
            </div>
        </div>
      </div>
    );
  };

  const toggleFavoriteAffirmation = (affirmation: string) => {
    if (typeof window === 'undefined') return;
    setFavoriteAffirmations(prevFavorites => {
      const isFavorited = prevFavorites.includes(affirmation);
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = prevFavorites.filter(fav => fav !== affirmation);
        toast({ title: "Removed from Favorites", description: `"${affirmation.substring(0, 30)}..."` });
      } else {
        updatedFavorites = [...prevFavorites, affirmation];
        toast({ title: "Added to Favorites!", description: `"${affirmation.substring(0, 30)}..."` });
      }
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const handleAffirmationCategoryClick = (category: AppAffirmationCategory) => {
    setCurrentAffirmationCategory(category);
    if (category.type === 'customizable') {
      setIsCustomDialogVisible(true);
    } else if (category.type === 'standard' || category.type === 'favorites') {
      setIsAffirmationDialogVisible(true);
      if (affirmationTimerCategory?.id !== category.id) {
          handleResetTimer(true); 
          setAffirmationTimerCategory(category); 
      }
    }
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      if (typeof window !== 'undefined') {
        const audio = new Audio('/sounds/timer-end.mp3'); 
        audio.play().catch(error => console.warn("Error playing timer sound:", error));
      }

      toast({ title: "Reflection Time Complete!", description: "Great job focusing on your affirmations." });
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timeLeft, toast]);


  const handleStartTimer = (category: AppAffirmationCategory) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setAffirmationTimerCategory(category);
    setTimeLeft(timerDuration);
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
  };

  const handleResumeTimer = () => {
    if (timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleResetTimer = (isCategorySwitch = false) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setTimeLeft(timerDuration);
    if (!isCategorySwitch) {
        setAffirmationTimerCategory(null); 
    }
  };
  
  useEffect(() => {
    if (!isAffirmationDialogVisible && affirmationTimerCategory) {
        handleResetTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAffirmationDialogVisible, affirmationTimerCategory]);

  const getRecoveryTreeStage = () => {
    if (journalEntryCount >= 15) return { icon: TreesIcon, stageName: "Flourishing Grove", color: "text-emerald-600 dark:text-emerald-400" };
    if (journalEntryCount >= 7) return { icon: TreePine, stageName: "Strong Sapling", color: "text-green-600 dark:text-green-400" };
    if (journalEntryCount >= 3) return { icon: LeafIcon, stageName: "Growing Leaf", color: "text-lime-600 dark:text-lime-400" };
    if (journalEntryCount >= 1) return { icon: Sprout, stageName: "New Sprout", color: "text-yellow-600 dark:text-yellow-400" };
    return { icon: Wind, stageName: "Awaiting First Entry", color: "text-muted-foreground" }; 
  };

  const RecoveryTreeDisplay = () => {
    const { icon: TreeComponent, stageName, color } = getRecoveryTreeStage();
    return (
      <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-primary">
            <TreesIcon className="mr-2 h-6 w-6" /> Your Recovery Tree
          </CardTitle>
          <CardDescription>Visualizing your journaling progress.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <TreeComponent className={cn("h-24 w-24 mb-3 transition-all duration-500 ease-in-out", color)} />
          <p className={cn("text-lg font-semibold", color)}>{stageName}</p>
          <p className="text-sm text-muted-foreground">{journalEntryCount} reflection entries logged.</p>
        </CardContent>
      </Card>
    );
  };

  const MoodMeterChallengeDisplay = () => {
    const today = selectedCalendarDate || new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: endOfWeek(today, { weekStartsOn: 1 }) });

    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <CheckCircle2 className="mr-2 h-6 w-6" /> Weekly Mood Meter
          </CardTitle>
          <CardDescription>Track your mood daily to unlock insights.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-around items-center mb-4 border-b pb-3">
            {daysOfWeek.map(day => {
              const mood = getMoodForDay(day);
              return (
                <Tooltip key={format(day, 'E')}>
                  <TooltipTrigger asChild>
                    <div className={cn("flex flex-col items-center space-y-1 p-1 rounded-md", isToday(day) ? "bg-accent/50" : "")}>
                      <span className="text-xs text-muted-foreground">{format(day, 'E')}</span>
                      {mood ? <mood.icon className={cn("h-6 w-6", mood.color)} /> : <div className="h-6 w-6 rounded-full bg-muted/50 border border-dashed"></div>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent><p>{format(day, 'MMM d')}{mood ? `: ${mood.label}` : ': Not logged'}</p></TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              Moods Tracked This Week: <span className="text-primary">{moodsTrackedThisWeek} / 7</span>
            </p>
            <Progress value={(moodsTrackedThisWeek / 7) * 100} className="w-full h-2 my-2" />
            {moodChallengeRewardUnlocked ? (
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-2">
                🎉 Reward Unlocked: Guided Breathing Exercise (Conceptual)!
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Track mood on {5 - moodsTrackedThisWeek > 0 ? 5 - moodsTrackedThisWeek : 0} more day(s) to unlock a reward!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const openBadgeDetails = (badge: Badge) => {
    setSelectedBadgeForDetails(badge);
    setIsBadgeDetailsDialogOpen(true);
  };

  const NeuroWellnessDashboard = () => {
    const [activeTab, setActiveTab] = useState<'summary' | 'trends'>('summary');

    const wellnessSummary = useMemo(() => {
      if (!dailyNeuroWellness) return "Log activities to see your neuro-wellness summary.";
      const scores = [
        { name: 'Dopamine', score: dailyNeuroWellness.dopamine.score },
        { name: 'Serotonin', score: dailyNeuroWellness.serotonin.score },
        { name: 'Oxytocin', score: dailyNeuroWellness.oxytocin.score },
        { name: 'Endorphins', score: dailyNeuroWellness.endorphins.score },
      ].filter(s => s.score > 0);

      if (scores.length === 0) return "No significant neurochemical activity logged for today.";
      scores.sort((a, b) => b.score - a.score);
      if (scores[0].score < 30) return "Gentle day for neurochemicals. Consider activities to boost well-being.";
      return `Today, ${scores[0].name} is your leading happy chemical!`;
    }, [dailyNeuroWellness]);

    const balancePercentages = useMemo(() => {
      if (!dailyNeuroWellness) return null;
      const totalScore = dailyNeuroWellness.dopamine.score + dailyNeuroWellness.serotonin.score + dailyNeuroWellness.oxytocin.score + dailyNeuroWellness.endorphins.score;
      if (totalScore === 0) return "No activity to calculate balance.";
      return (Object.keys(chemicalInfos) as ChemicalName[]).map(key => ({
        name: chemicalInfos[key].displayName,
        percentage: Math.round((dailyNeuroWellness[key].score / totalScore) * 100),
        color: chemicalInfos[key].progressColorClass || 'bg-primary'
      }));
    }, [dailyNeuroWellness]);

    const balanceInsight = useMemo(() => {
        if (!dailyNeuroWellness || !balancePercentages || typeof balancePercentages === 'string') return "Log more activities for a detailed balance insight.";
        const sortedChemicals = [...balancePercentages].sort((a,b) => b.percentage - a.percentage);
        if (sortedChemicals[0].percentage === 0) return "Feeling balanced? Log activities to see neurochemical insights.";
        if (sortedChemicals[0].percentage > 50) {
            const dominantChem = chemicalInfos[sortedChemicals[0].name.toLowerCase() as ChemicalName];
            return `${dominantChem.displayName} is prominent today, suggesting ${dominantChem.focusArea}.`;
        }
        if (sortedChemicals[0].percentage > 35 && sortedChemicals[1].percentage > 25) {
            const chem1 = chemicalInfos[sortedChemicals[0].name.toLowerCase() as ChemicalName];
            const chem2 = chemicalInfos[sortedChemicals[1].name.toLowerCase() as ChemicalName];
            return `A good blend of ${chem1.displayName} and ${chem2.displayName} today, indicating ${chem1.focusArea} and ${chem2.focusArea}.`;
        }
        return "A mix of neurochemicals active today. Keep up the varied activities!";
    }, [dailyNeuroWellness, balancePercentages]);


    const weeklyNeuroChartData = useMemo(() => {
      return weeklyNeuroData.map(dayData => ({
          date: format(parseISO(dayData.date), 'EEE'), 
          Dopamine: dayData.dopamine.score,
          Serotonin: dayData.serotonin.score,
          Oxytocin: dayData.oxytocin.score,
          Endorphins: dayData.endorphins.score,
      }));
    }, [weeklyNeuroData]);
    
    const weeklyNeuroChartConfig = {
        date: { label: "Day" },
        Dopamine: { label: "Dopamine", color: chemicalInfos.dopamine.lineChartColor },
        Serotonin: { label: "Serotonin", color: chemicalInfos.serotonin.lineChartColor },
        Oxytocin: { label: "Oxytocin", color: chemicalInfos.oxytocin.lineChartColor },
        Endorphins: { label: "Endorphins", color: chemicalInfos.endorphins.lineChartColor },
    } satisfies ChartConfig;

    const weeklyInsightMessage = useMemo(() => {
      if (weeklyNeuroData.length < 7) return "Not enough data for a full weekly insight. Keep logging!";
      
      const avgScores: Record<ChemicalName, number> = { dopamine: 0, serotonin: 0, oxytocin: 0, endorphins: 0 };
      const chemicalCounts: Record<ChemicalName, number> = { dopamine: 0, serotonin: 0, oxytocin: 0, endorphins: 0 };

      weeklyNeuroData.forEach(day => {
        (Object.keys(avgScores) as ChemicalName[]).forEach(chem => {
          avgScores[chem] += day[chem].score;
          if (day[chem].score > 0) chemicalCounts[chem]++;
        });
      });

      const dominantChemicals = (Object.keys(avgScores) as ChemicalName[])
        .map(chem => ({ name: chemicalInfos[chem].displayName, score: avgScores[chem] / 7, count: chemicalCounts[chem] }))
        .sort((a,b) => b.score - a.score);

      if (dominantChemicals[0].score < 20) return "This week was gentle on neurochemical activity. Consider diversifying your actions.";
      
      let insight = `This week, ${dominantChemicals[0].name} was a key neurochemical for you`;
      if (dominantChemicals[1] && dominantChemicals[1].score > dominantChemicals[0].score * 0.6) {
        insight += ` along with ${dominantChemicals[1].name}`;
      }
      insight += `. This suggests a period focused on ${chemicalInfos[dominantChemicals[0].name.toLowerCase() as ChemicalName].focusArea}.`;
      if (dominantChemicals.some(chem => chem.count < 3 && chem.score > 10)) {
          insight += " Try to incorporate more consistent activities for overall balance.";
      }
      return insight;
    }, [weeklyNeuroData]);


    if (isNeuroWellnessLoading && !dailyNeuroWellness) {
      return (
        <Card className="w-full mx-auto shadow-xl rounded-lg mt-8">
          <CardHeader><CardTitle>Neuro-Wellness Dashboard</CardTitle></CardHeader>
          <CardContent className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /><p className="mt-2 text-muted-foreground">Loading neuro-wellness data...</p></CardContent>
        </Card>
      );
    }
    if (!dailyNeuroWellness) {
       return (
        <Card className="w-full mx-auto shadow-xl rounded-lg mt-8">
          <CardHeader>
             <CardTitle className="text-2xl font-bold text-primary flex items-center">
                <BrainDashboardIcon className="mr-3 h-7 w-7" /> Neuro-Wellness Dashboard
            </CardTitle>
            <CardDescription>Track your "Happy Chemical" levels based on daily activities.</CardDescription>
          </CardHeader>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">No neuro-wellness data available for {selectedCalendarDate ? format(selectedCalendarDate, 'MMMM d, yyyy') : 'this day'}. Log activities to see your dashboard.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="w-full mx-auto shadow-xl rounded-lg mt-8">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary flex items-center">
                <BrainDashboardIcon className="mr-3 h-7 w-7" /> Neuro-Wellness Dashboard
            </CardTitle>
            <CardDescription>Track your "Happy Chemical" levels for {selectedCalendarDate ? format(selectedCalendarDate, 'MMMM d, yyyy') : 'the selected day'}.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-6">
            <Alert className={cn("border-primary/30", chemicalInfos[ (Object.keys(dailyNeuroWellness) as ChemicalName[]).filter(k => k !== 'date').sort((a,b) => dailyNeuroWellness[b].score - dailyNeuroWellness[a].score)[0] as ChemicalName ]?.baseBgClass || 'bg-primary/5' )}>
                <SparklesIconReflections className={cn("h-5 w-5", chemicalInfos[ (Object.keys(dailyNeuroWellness) as ChemicalName[]).filter(k => k !== 'date').sort((a,b) => dailyNeuroWellness[b].score - dailyNeuroWellness[a].score)[0] as ChemicalName ]?.textColor || 'text-primary')} />
                <AlertTitle className={cn("font-semibold", chemicalInfos[ (Object.keys(dailyNeuroWellness) as ChemicalName[]).filter(k => k !== 'date').sort((a,b) => dailyNeuroWellness[b].score - dailyNeuroWellness[a].score)[0] as ChemicalName ]?.textColor || 'text-primary')}>Emotional Wellness Summary</AlertTitle>
                <AlertDescription className="text-sm">{wellnessSummary}</AlertDescription>
            </Alert>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'summary' | 'trends')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Daily Summary</TabsTrigger>
                    <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(Object.keys(chemicalInfos) as ChemicalName[]).map(key => {
                            const chemInfo = chemicalInfos[key];
                            const Icon = chemInfo.icon;
                            const wellnessData = dailyNeuroWellness[key];
                            return (
                                <Card 
                                    key={key} 
                                    className={cn("shadow-md hover:shadow-lg transition-shadow cursor-pointer", chemInfo.baseBgClass, chemInfo.borderClass)}
                                    onClick={() => {setSelectedChemicalForDialog(chemInfo); setIsChemicalDetailDialogOpen(true);}}
                                >
                                    <CardHeader className={cn("pb-2", chemInfo.headerBgClass)}>
                                        <CardTitle className={cn("text-lg flex items-center", chemInfo.textColor)}>
                                            <Icon className={cn("mr-2 h-5 w-5", chemInfo.iconColor)} /> {chemInfo.displayName}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Progress value={wellnessData.score} className={cn("h-3", chemInfo.progressColorClass)} />
                                        <p className={cn("text-right text-sm font-semibold mt-1", chemInfo.textColor)}>
                                            {wellnessData.score} / 100
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{wellnessData.activityCount} boosting activities logged.</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                    {balancePercentages && typeof balancePercentages !== 'string' && (
                        <Card className="bg-secondary/30 border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center text-primary"><BarChartBig className="mr-2 h-5 w-5"/>Daily Chemical Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-2">
                                    {balancePercentages.map(item => (
                                        <span key={item.name} className={cn("font-medium", chemicalInfos[item.name.toLowerCase() as ChemicalName]?.textColor || 'text-foreground')}>
                                            {item.name}: {item.percentage}%
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs italic text-muted-foreground">{balanceInsight}</p>
                            </CardContent>
                        </Card>
                    )}
                     <Card className="bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-600">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-md flex items-center text-amber-700 dark:text-amber-300"><Lightbulb className="mr-2 h-5 w-5"/>Quick Tip</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                Feeling low on Oxytocin? Try sending a thank-you note or calling a loved one today. Low on Dopamine? Complete a small task for a quick sense of achievement!
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="trends" className="mt-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">7-Day Neurochemical Trends</CardTitle>
                            <CardDescription>Levels leading up to {selectedCalendarDate ? format(selectedCalendarDate, 'MMMM d') : 'selected date'}.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2 pr-4">
                            {weeklyNeuroData.length > 0 ? (
                                <ChartContainer config={weeklyNeuroChartConfig} className="h-[300px] w-full">
                                    <LineChart data={weeklyNeuroChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                        <RechartsTooltip content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        {(Object.keys(chemicalInfos) as ChemicalName[]).map(chem => (
                                            <Line key={chem} type="monotone" dataKey={chemicalInfos[chem].displayName} stroke={chemicalInfos[chem].lineChartColor} strokeWidth={2} dot={{ r: 3 }} activeDot={{r: 5}} />
                                        ))}
                                    </LineChart>
                                </ChartContainer>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">Not enough data to display weekly trends.</p>
                            )}
                        </CardContent>
                    </Card>
                     <Card className="mt-4 bg-secondary/30 border-border/50">
                        <CardHeader className="pb-2">
                           <CardTitle className="text-md flex items-center text-primary"><TrendingUp className="mr-2 h-5 w-5"/>Weekly Insight</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground italic">{weeklyInsightMessage}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    );
  }


  return (
    <TooltipProvider>
    <div className="container mx-auto py-10 space-y-8">
      <Tabs defaultValue="reflections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reflections">
            <CalendarDays className="mr-2 h-4 w-4" /> Reflections & Dashboards
          </TabsTrigger>
          <TabsTrigger value="affirmations">
            <SparklesIconReflections className="mr-2 h-4 w-4" /> Affirmations Hub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reflections" className="mt-6 space-y-8">
          
           <Card className="w-full mx-auto shadow-xl rounded-lg">
              <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary flex items-center">
                      <Award className="mr-3 h-7 w-7" /> Gamification Central
                  </CardTitle>
                  <CardDescription>
                      Track your progress, earn badges, and nurture your well-being.
                  </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  <RecoveryTreeDisplay />
                  <MoodMeterChallengeDisplay />
                  <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                          <CardTitle className="flex items-center text-primary">
                              <Trophy className="mr-2 h-6 w-6" /> My Badges
                          </CardTitle>
                          <CardDescription>Milestones achieved on your journey.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                          {achievedBadges.length > 0 ? (
                              <ScrollArea className="h-48">
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
                                      {achievedBadges.map(badge => {
                                          const BadgeIcon = badge.icon; 
                                          return (
                                              <Tooltip key={badge.id}>
                                                  <TooltipTrigger asChild>
                                                      <Button
                                                          variant="outline"
                                                          className="flex flex-col items-center justify-center h-20 p-2 space-y-1 border-dashed border-primary/50 hover:bg-primary/10"
                                                          onClick={() => openBadgeDetails(badge)}
                                                      >
                                                          <BadgeIcon className="h-7 w-7 text-primary" />
                                                          <span className="text-xs text-center truncate w-full">{badge.name}</span>
                                                      </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                      <p>{badge.name}: {badge.description}</p>
                                                      {badge.achievedDate && <p className="text-xs">Earned: {format(parseISO(badge.achievedDate), 'MMM d, yyyy')}</p>}
                                                  </TooltipContent>
                                              </Tooltip>
                                          );
                                      })}
                                  </div>
                              </ScrollArea>
                          ) : (
                              <p className="text-sm text-muted-foreground text-center py-6">No badges earned yet. Keep reflecting and growing!</p>
                          )}
                      </CardContent>
                  </Card>
              </CardContent>
          </Card>

          <NeuroWellnessDashboard />


          <Card className="w-full mx-auto shadow-xl rounded-lg">
            <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl font-bold text-primary">Daily Reflections Calendar</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground pt-1">
                Visualize your journey. Days are shaded by the predominant "happy chemical" from logged activities. Click a date for details.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-2 md:p-4">
              <div className="mb-6 p-3 border rounded-md bg-secondary/20 w-full max-w-2xl">
                  <h4 className="text-sm font-semibold mb-2 text-center text-primary">Calendar Legend - Predominant "Happy Chemical" Color Coding:</h4>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                      {appChemicalLegend.map(item => (
                      <Tooltip key={item.chemical}>
                          <TooltipTrigger asChild>
                              <div className="flex items-center space-x-1.5 cursor-default">
                                  <div className={cn("w-3 h-3 rounded-full", 
                                    item.chemical === 'endorphins' ? 'bg-orange-500/50' :
                                    item.chemical === 'serotonin' ? 'bg-green-500/50' :
                                    item.chemical === 'dopamine' ? 'bg-purple-500/50' :
                                    item.chemical === 'oxytocin' ? 'bg-pink-500/50' : ''
                                  )}></div>
                                  <span className="text-xs text-muted-foreground">{item.name}</span>
                              </div>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p className="text-xs max-w-xs">{item.description}</p>
                          </TooltipContent>
                      </Tooltip>
                      ))}
                  </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedCalendarDate}
                onSelect={(date) => { if(date) setSelectedCalendarDate(date); handleDateSelectForSummary(date); }}
                className="rounded-md border shadow-sm p-0 w-full"
                classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-0 w-full",
                    caption: "flex justify-center pt-2 pb-1 relative items-center text-lg font-semibold",
                    caption_label: "text-xl font-bold text-primary",
                    nav: "space-x-1 flex items-center",
                    nav_button: cn(
                      buttonVariants({ variant: "outline" }),
                      "h-9 w-9 bg-transparent p-0 opacity-70 hover:opacity-100"
                    ),
                    nav_button_previous: "absolute left-2",
                    nav_button_next: "absolute right-2",
                    table: "w-full border-collapse",
                    head_row: "flex w-full border-b",
                    head_cell: "text-muted-foreground font-medium flex-1 h-10 flex items-center justify-center text-sm p-1 capitalize",
                    row: "flex w-full", 
                    cell: "p-0 flex-1", 
                }}
                components={{
                    Day: CustomDayCell,
                }}
                formatters={{
                    formatWeekdayName: (day) => format(day, 'EEE') 
                }}
              />
            </CardContent>
          </Card>

          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Karma Score Dashboard</CardTitle>
              <CardDescription>
                View your karma scores over time to track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-4">
              <div className="flex justify-end mb-4">
                <Select value={timePeriod} onValueChange={value => setTimePeriod(value as 'week' | 'month')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ChartContainer config={karmaChartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <RechartsTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="score"
                    type="monotone"
                    fill="var(--color-score)" 
                    fillOpacity={0.3}
                    stroke="var(--color-score)"
                  />
                </AreaChart>
              </ChartContainer>
               <div className="mt-4 p-2 border rounded-md bg-secondary/30">
                <p className="text-sm italic text-center">"{quote}"</p>
                <p className="text-xs text-muted-foreground text-center mt-1">Suggestion: {suggestion}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center space-x-3">
              <Award className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Weekly Karma Ranking</CardTitle>
                <CardDescription>See how your Karma score stacks up against others this week!</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRank ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating your rank...
                </div>
              ) : userWeeklyScore !== null && userRank !== null ? (
                <div className="space-y-2">
                  <p className="text-lg">Your Weekly Karma Score: <span className="font-bold text-primary">{userWeeklyScore}</span></p>
                  <p className="text-lg">Your Rank: <span className="font-bold text-accent">#{userRank}</span> out of {NUM_HYPOTHETICAL_USERS + 1} users</p>
                  <p className="mt-1 text-sm text-muted-foreground">{rankMessage}</p>
                </div>
              ) : (
                 <p className="text-muted-foreground">Log some Karma activities to see your rank!</p>
              )}
            </CardContent>
          </Card>

          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Habit / Addiction Dashboard</CardTitle>
              <CardDescription>
                Track quantities for selected habits or addictions over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <h4 className="text-md font-semibold mb-2">Select Habits / Addictions to Track:</h4>
                <ScrollArea className="h-32 w-full rounded-md border p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                    {trackedItemNames.map(name => (
                      <div key={name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tracked-item-${name}`}
                          checked={selectedTrackedItems.includes(name)}
                          onCheckedChange={(checked) => handleTrackedItemSelectionChange(name, !!checked)}
                        />
                        <Label htmlFor={`tracked-item-${name}`} className="text-sm font-medium leading-none">
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {selectedTrackedItems.length > 0 ? (
                <ChartContainer config={trackedItemChartConfig} className="h-[350px] w-full">
                  <LineChart data={trackedItemChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} label={{ value: "Quantity", angle: -90, position: 'insideLeft', offset: 0 }} />
                    <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                    {selectedTrackedItems.map((itemName) => (
                      <Line
                        key={itemName}
                        type="monotone"
                        dataKey={itemName}
                        stroke={trackedItemChartConfig[itemName]?.color || '#8884d8'}
                        strokeWidth={2}
                        dot={false}
                        name={trackedItemChartConfig[itemName]?.label as string || itemName}
                        connectNulls={true}
                      />
                    ))}
                    <ChartLegend content={<ChartLegendContent />} />
                  </LineChart>
                </ChartContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Select one or more items to see the chart.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affirmations" className="mt-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Affirmation Categories</h2>
             <p className="mt-2 text-muted-foreground">Strengthen your mindset with positive statements.</p>
          </div>
          
          <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="font-semibold">Educational Tip</AlertTitle>
            <AlertDescription>
              Affirmations work best when repeated consistently. Just 15 seconds a day can rewire your mindset and reinforce your intentions.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {affirmationCategoriesData.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className={cn(
                    "group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between",
                    category.baseBgClass, category.borderClass
                  )}
                  onClick={() => handleAffirmationCategoryClick(category)}
                >
                  <CardHeader className={cn("p-4", category.headerBgClass)}>
                    <div className="flex items-center space-x-3 mb-2">
                      <IconComponent className="h-7 w-7 text-primary" />
                      <CardTitle className="text-lg font-semibold text-primary truncate">{category.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground h-10 line-clamp-2">{category.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className={cn("p-3 border-t text-xs text-muted-foreground", category.footerBgClass)}>
                    <div>
                      <p><strong>Duration:</strong> {category.recommendedDuration}</p>
                      <p><strong>Frequency:</strong> {category.recommendedFrequency}</p>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Daily Summary: {summaryData ? format(parseISO(summaryData.date), 'MMMM d, yyyy') : ''}</DialogTitle>
            <DialogDescription>
              A recap of your activities, goals, and reflections for this day.
            </DialogDescription>
          </DialogHeader>
          {summaryData ? (
            <ScrollArea className="max-h-[60vh] p-1">
              <div className="space-y-4 py-4 pr-4">
                 
                <Separator />
                <div>
                  <div className="flex items-center mb-2">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-semibold">Reflection</h3>
                  </div>
                  {summaryData.reflection?.text ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/50 p-3 rounded-md border">{summaryData.reflection.text}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No reflection logged for this day.</p>
                  )}
                </div>
                <Separator />
                <div>
                    <div className="flex items-center mb-2">
                        <ListChecks className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="text-md font-semibold">Karma Activities (Score: <span className={cn(summaryData.karmaScore >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>{summaryData.karmaScore}</span>)</h3>
                    </div>
                    {summaryData.karmaActivities && summaryData.karmaActivities.length > 0 ? (
                    <ul className="space-y-1 text-sm list-disc list-inside pl-2">
                        {summaryData.karmaActivities.map((act, idx) => (
                        <li key={idx}>
                            <span className={cn(act.points > 0 ? "text-green-600 dark:text-green-400" : act.points < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                                {act.name}
                            </span>
                            {act.quantity && ` - ${act.quantity} ${act.quantificationUnit || ''}`}
                            {act.mediaDataUri && <span className="text-xs italic"> (media attached)</span>}
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-sm text-muted-foreground">No karma activities logged.</p>
                    )}
                </div>
                <Separator />
                <div>
                  <div className="flex items-center mb-2">
                     <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                     <h3 className="text-md font-semibold">Goals Completed</h3>
                  </div>
                  {summaryData.goalsCompleted && summaryData.goalsCompleted.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside pl-2">
                      {summaryData.goalsCompleted.map(goal => <li key={goal.id}>{goal.name}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No goals marked as completed on this day.</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground py-4">No data available for this day.</p>
          )}
          <DialogFooter className="mt-2 sm:mt-0">
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsSummaryDialogOpen(false); handleOpenReflectionDialogFromSummary(); }}>
              Edit/Add Reflection Text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    <Dialog open={isReflectionDialogOpen} onOpenChange={setIsReflectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Reflection for {selectedCalendarDate ? format(selectedCalendarDate, 'MMMM d, yyyy') : ''}</DialogTitle>
            <DialogDescription>
                Add or edit your reflection for this day.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <Textarea
                id="reflection-text"
                placeholder="Type your reflection here..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                rows={6}
            />
            
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setIsReflectionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveReflection}>Save Reflection</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Dialog open={isChemicalDetailDialogOpen} onOpenChange={setIsChemicalDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center">
                    {selectedChemicalForDialog && React.createElement(selectedChemicalForDialog.icon, { className: cn("mr-2 h-6 w-6", selectedChemicalForDialog.iconColor) })}
                    {selectedChemicalForDialog?.displayName}
                </DialogTitle>
                <DialogDescription>
                    {selectedChemicalForDialog?.description}
                </DialogDescription>
            </DialogHeader>
            {selectedChemicalForDialog && (
                <div className="py-4 space-y-3">
                    <div>
                        <h4 className="text-sm font-semibold mb-1">Activities to boost {selectedChemicalForDialog.displayName}:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                            {selectedChemicalForDialog.boostingActivities.map(act => <li key={act}>{act}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-1">Reflection Prompt:</h4>
                        <p className="text-sm italic text-muted-foreground">"{selectedChemicalForDialog.reflectionPrompt}"</p>
                    </div>
                </div>
            )}
            <DialogFooter>
                <Button onClick={() => setIsChemicalDetailDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>


      <Dialog open={isAffirmationDialogVisible} onOpenChange={(isOpen) => {
            setIsAffirmationDialogVisible(isOpen);
            if (!isOpen) {
                handleResetTimer(); 
            }
        }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentAffirmationCategory?.title || 'Affirmations'}</DialogTitle>
            <DialogDescription>
              {currentAffirmationCategory?.type === 'favorites' 
                ? "Your curated list of powerful affirmations. Reflect on these regularly."
                : "Read and reflect on these affirmations. Use the timer below for a focused session."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[40vh] my-4">
            {currentAffirmationCategory?.type === 'favorites' ? (
              favoriteAffirmations.length > 0 ? (
                <ul className="space-y-3 pr-4">
                  {favoriteAffirmations.map((affirmation, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-md text-sm italic text-secondary-foreground">
                      <span>"{affirmation}"</span>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavoriteAffirmation(affirmation)} className="text-yellow-400 hover:text-yellow-500">
                        <Star className="h-5 w-5 fill-current" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">You haven't added any affirmations to your favorites yet. Click the star icon next to an affirmation to add it here!</p>
              )
            ) : (
              currentAffirmationCategory?.affirmations && currentAffirmationCategory.affirmations.length > 0 ? (
                <ul className="space-y-3 pr-4">
                  {currentAffirmationCategory.affirmations.map((affirmation, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-md text-sm italic text-secondary-foreground">
                      <span>"{affirmation}"</span>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavoriteAffirmation(affirmation)}>
                        <Star className={cn("h-5 w-5", favoriteAffirmations.includes(affirmation) ? "fill-current text-yellow-400" : "text-muted-foreground hover:text-yellow-400")} />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No affirmations in this category yet.</p>
              )
            )}
          </ScrollArea>
          
          {currentAffirmationCategory &&
            (
              (currentAffirmationCategory.type === 'standard' && currentAffirmationCategory.affirmations && currentAffirmationCategory.affirmations.length > 0) ||
              (currentAffirmationCategory.type === 'favorites' && favoriteAffirmations.length > 0)
            ) && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-md font-semibold mb-3 text-center flex items-center justify-center">
                <TimerIcon className="mr-2 h-5 w-5 text-primary" />
                Reflection Timer
              </h4>
              {(!affirmationTimerCategory || affirmationTimerCategory.id !== currentAffirmationCategory.id || (timeLeft === timerDuration && !isTimerRunning)) ? (
                <Button onClick={() => handleStartTimer(currentAffirmationCategory)} className="w-full">
                  <Play className="mr-2 h-4 w-4" /> Start {timerDuration}s Reflection
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-lg font-medium">
                    Time Remaining: <span className="text-primary">{timeLeft}s</span>
                  </p>
                  <Progress value={(timeLeft / timerDuration) * 100} className="w-full h-2" />
                  <div className="flex justify-center space-x-2">
                    {isTimerRunning ? (
                      <Button onClick={handlePauseTimer} variant="outline" size="sm">
                        <Pause className="mr-2 h-4 w-4" /> Pause
                      </Button>
                    ) : (
                      timeLeft > 0 && timeLeft < timerDuration && (
                        <Button onClick={handleResumeTimer} variant="outline" size="sm">
                          <Play className="mr-2 h-4 w-4" /> Resume
                        </Button>
                      )
                    )}
                    <Button onClick={() => handleResetTimer(false)} variant="ghost" size="sm">
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset & Hide Timer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => {
                setIsAffirmationDialogVisible(false);
                 handleResetTimer(); 
            }}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCustomDialogVisible} onOpenChange={setIsCustomDialogVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Own Affirmations</DialogTitle>
            <DialogDescription>
              Use these templates as a starting point for your personal affirmations.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4">
            <ul className="space-y-4 pr-4">
              {customizableTemplates.map((template, index) => (
                <li key={index} className="p-4 border rounded-md bg-secondary/50 shadow-sm">
                  <p className="font-semibold text-foreground">{template.template}</p>
                  <p className="text-xs text-muted-foreground italic mt-1">{template.example}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomDialogVisible(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBadgeDetailsDialogOpen} onOpenChange={setIsBadgeDetailsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle className="flex items-center">
                      {selectedBadgeForDetails?.icon && React.createElement(selectedBadgeForDetails.icon, { className: "mr-2 h-6 w-6 text-primary" })}
                      {selectedBadgeForDetails?.name}
                  </DialogTitle>
                  <DialogDescription>
                      {selectedBadgeForDetails?.description}
                  </DialogDescription>
              </DialogHeader>
              {selectedBadgeForDetails?.achievedDate && (
                  <p className="text-sm text-muted-foreground mt-2">
                      Earned on: {format(parseISO(selectedBadgeForDetails.achievedDate), 'MMMM d, yyyy')}
                  </p>
              )}
              <DialogFooter>
                  <Button onClick={() => setIsBadgeDetailsDialogOpen(false)}>Close</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
    </TooltipProvider>
  );
};

export default ReflectionsPage;

