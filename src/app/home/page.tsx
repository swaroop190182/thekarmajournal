
"use client";

import Link from "next/link";
import { Calendar as CalendarIcon, Mic, Square, Wand2, Camera as CameraIconLucide, Upload, Trash2, Play, Video, VideoOff, Sparkles as SparklesIcon, Brain, Users, Coins, Award as GoalIcon, Handshake as VolunteerIcon, HeartPulse, BookText, Edit3, Loader2, Activity as ActivityIcon, Star, HelpCircle, ListChecks, Tags, HandCoins, Flame, ThumbsUp, MessageCircleQuestion, Smile as SmileIconLucide, Meh as MehIconLucide, Frown as FrownIconLucide, Laugh as LaughIconLucide, Angry as AngryIconLucide, Palette as PaletteIconMood } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect, useMemo, useRef } from "react";
import type { KarmaActivity, SelectedKarmaActivity, FlowActivity, JournalEntries, StreakData, MoodOption as AppMoodOption } from "../types";
import { ActivityList, affirmationsList, chemicalLegend as appChemicalLegend, moodOptions } from "../constants";
import { useToast } from "@/hooks/use-toast";
import { subDays, format as formatDate, parseISO, differenceInCalendarDays, isSameDay, startOfDay } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { analyzeJournalEntries, JournalAnalysisInput } from "@/ai/flows/journal-to-activities-flow";
import { transcribeAudio, TranscribeAudioInput } from "@/ai/flows/transcribe-audio-flow";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";


const JOURNAL_STORAGE_KEY_PREFIX = 'karma-journal-text-';
const REFLECTION_STORAGE_KEY_PREFIX = 'karma-journal-reflection-'; // For mood and text
const JOURNAL_STREAK_STORAGE_KEY = 'karma-journaling-streak';
const FAVORITE_ACTIVITIES_STORAGE_KEY = 'karma-journal-favorite-activities';
const FAVORITE_AFFIRMATIONS_STORAGE_KEY = 'karma-journal-favorite-affirmations';
const FIRST_REFLECTION_BADGE_KEY = 'badge-first-reflection-achieved';
const TRIGGERS_SEPARATOR = ";;OTHER;;";


const journalPrompts = [
  { id: "reflections_achievements", question: "Reflections & Achievements: Looking back, what positive actions, kind gestures, or progress on goals did you make? What are you grateful for?" },
  { id: "intentions_focus", question: "Intentions & Focus for Today/Tomorrow: What positive actions do you plan to take? Are there specific habits you're focusing on or challenges you want to address? (Mention quantity if relevant for habits like smoking or drinking)" },
  { id: "other_moments", question: "Other Notable Moments & Thoughts: Any other significant activities, insights, or feelings from your day or for the day ahead?" },
];

const parseTriggersString = (triggersStr: string | undefined): { predefined: string[], other: string } => {
  if (!triggersStr) return { predefined: [], other: "" };
  const parts = triggersStr.split(TRIGGERS_SEPARATOR);
  const predefined = parts[0] ? parts[0].split(",").map(t => t.trim()).filter(Boolean) : [];
  const other = parts[1] || "";
  return { predefined, other };
};

const buildTriggersString = (predefined: string[], other: string): string => {
  let str = predefined.join(", ");
  if (other.trim()) {
    if (str) str += ` ${TRIGGERS_SEPARATOR} `;
    else str = `${TRIGGERS_SEPARATOR} `;
    str += other.trim();
  }
  return str;
};

const chemicalColorClasses: Record<NonNullable<KarmaActivity['chemicalRelease']>, { border: string; icon: string; ring: string }> = {
    endorphins: { border: "border-orange-400", icon: "text-orange-500", ring: "ring-orange-500" },
    serotonin: { border: "border-green-400", icon: "text-green-500", ring: "ring-green-500" },
    dopamine: { border: "border-purple-400", icon: "text-purple-500", ring: "ring-purple-500" },
    oxytocin: { border: "border-pink-400", icon: "text-pink-500", ring: "ring-pink-500" },
    none: { border: "border-input", icon: "text-muted-foreground", ring: "ring-ring" },
};


export default function HomePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loggedActivities, setLoggedActivities] = useState<SelectedKarmaActivity[]>([]);
  const { toast } = useToast();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntries>({});
  const [isAnalyzingJournal, setIsAnalyzingJournal] = useState(false);
  const [favoriteActivities, setFavoriteActivities] = useState<string[]>([]);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);


  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioDataURL, setAudioDataURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceJournalStatus, setVoiceJournalStatus] = useState<string>("Ready to record your thoughts!");

  const [selfieDataURL, setSelfieDataURL] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);


  const [journalingStreak, setJournalingStreak] = useState<StreakData | null>(null);
  const [streakJustUpdated, setStreakJustUpdated] = useState(false);

  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState<string>("");
  const [favoriteAffirmations, setFavoriteAffirmations] = useState<string[]>([]);
  const [firstReflectionBadgeAchieved, setFirstReflectionBadgeAchieved] = useState(false);


  const categoryOrder = [
    "Wellbeing & Mindfulness", "Health", "Personal Growth", "Mindset",
    "Social Acts of Kindness", "Social & Relationships", "Community & Giving", "Environmental Actions",
    "Behaviour", "Personal Responsibility", "Ethical Violations",
    "Negative Environmental Impact", "Habit / Addiction",
  ];

  const activityTypes = useMemo(() => {
    const types = Array.from(new Set(ActivityList.map(act => act.type)));
    return types.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [categoryOrder]);

  const groupedGeneralActivities = useMemo(() => {
    return activityTypes
      .filter(type => type !== "Habit / Addiction")
      .map(type => ({
        type,
        activities: ActivityList.filter(activity => activity.type === type)
      }))
      .filter(group => group.activities.length > 0);
  }, [activityTypes]);

  const habitActivities = useMemo(() => {
    return ActivityList.filter(activity => activity.type === "Habit / Addiction");
  }, []);

  const accordionDefaultOpenValuesGeneral = useMemo(() => {
    return activityTypes.filter(type => type !== "Habit / Addiction");
  }, [activityTypes]);


  const totalScore = useMemo(() => {
    return loggedActivities.reduce((sum, activity) => {
      let pointsToAward = activity.points;
      if (activity.requiresPhoto && !activity.mediaDataUri) {
        pointsToAward = Math.round(activity.points * 0.7);
      }
      return sum + pointsToAward;
    }, 0);
  }, [loggedActivities]);

   useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedStreak = localStorage.getItem(JOURNAL_STREAK_STORAGE_KEY);
        if (storedStreak) {
            setJournalingStreak(JSON.parse(storedStreak));
        } else {
            setJournalingStreak({ type: 'dailyJournaling', currentStreak: 0, longestStreak: 0, lastCompletedDate: null });
        }

        const storedFavoriteActivities = localStorage.getItem(FAVORITE_ACTIVITIES_STORAGE_KEY);
        if (storedFavoriteActivities) {
            setFavoriteActivities(JSON.parse(storedFavoriteActivities));
        }

        const storedFavoriteAffirmations = localStorage.getItem(FAVORITE_AFFIRMATIONS_STORAGE_KEY);
        if (storedFavoriteAffirmations) {
            setFavoriteAffirmations(JSON.parse(storedFavoriteAffirmations));
        }

        const badgeAchieved = localStorage.getItem(FIRST_REFLECTION_BADGE_KEY);
        if (badgeAchieved === 'true') {
            setFirstReflectionBadgeAchieved(true);
        }
    }
  }, []);

  useEffect(() => {
    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-dd');
      const savedActivities = localStorage.getItem(`karma-${formattedDate}`);
      if (savedActivities) {
        try {
          setLoggedActivities(JSON.parse(savedActivities) as SelectedKarmaActivity[]);
        } catch (e) { console.error("Failed to parse saved activities:", e); setLoggedActivities([]); }
      } else { setLoggedActivities([]); }

      const savedJournalEntries = localStorage.getItem(`${JOURNAL_STORAGE_KEY_PREFIX}${formattedDate}`);
      if (savedJournalEntries) {
        try { setJournalEntries(JSON.parse(savedJournalEntries));}
        catch (e) { console.error("Failed to parse saved journal entries:", e); setJournalEntries({});}
      } else { setJournalEntries({});}

      const savedReflection = localStorage.getItem(`${REFLECTION_STORAGE_KEY_PREFIX}${formattedDate}`);
      if (savedReflection) {
        try {
          const reflectionData = JSON.parse(savedReflection);
          setSelectedMood(reflectionData.mood);
        } catch (e) { console.error("Failed to parse saved reflection/mood:", e); setSelectedMood(undefined); }
      } else {
        setSelectedMood(undefined);
      }

      setAudioDataURL(null);
      setTranscript(null);
      setVoiceJournalStatus("Ready to record your thoughts!");
      setExpandedHabit(null);
      setStreakJustUpdated(false);
      
      // Reset camera state when date changes, but don't stop global stream here
      setIsCameraOn(false);
      // setSelfieDataURL(null); // Keep selfie if it's for the new date from a previous interaction before save? Or clear? Clearing is safer.
      const dailySelfieActivity = ActivityList.find(act => act.name === "Daily Selfie");
      if (dailySelfieActivity) {
        const existingSelfie = loggedActivities.find(act => act.name === "Daily Selfie" && act.mediaDataUri);
        setSelfieDataURL(existingSelfie ? existingSelfie.mediaDataUri : null);
      } else {
        setSelfieDataURL(null);
      }


    }
  }, [date, toast]); // Added toast to dependencies

  // Camera Permission useEffect
  useEffect(() => {
    const getCameraPermission = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = mediaStream;
          setHasCameraPermission(true);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          // Toasting here might be too aggressive on initial load if user hasn't interacted yet.
          // Consider toasting only on explicit button click if permission is false.
        }
      } else {
        setHasCameraPermission(false);
        toast({ variant: "destructive", title: "Unsupported Browser", description: "Camera access not supported." });
      }
    };
    getCameraPermission();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [toast]);


  const analyzeTextAndLogActivitiesAI = async (textToAnalyze: string) => {
    if (!date) {
      toast({ title: "Error", description: "Please select a date.", variant: "destructive" });
      return false;
    }
     if (!textToAnalyze.trim()) {
      toast({ title: "Empty Content", description: "Nothing to analyze.", variant: "default" });
      return false;
    }

    setIsAnalyzingJournal(true);
    try {
      const flowActivityList: FlowActivity[] = ActivityList.map(act => ({
        name: act.name,
        keywords: act.keywords || [],
        quantificationUnit: act.quantificationUnit,
      }));

      const input: JournalAnalysisInput = {
        journalText: textToAnalyze,
        activityList: flowActivityList,
        currentDate: formatDate(date, 'yyyy-MM-dd'),
      };

      const result = await analyzeJournalEntries(input);

      if (result && result.identifiedActivities) {
        setLoggedActivities((prevLoggedActivities) => {
          let newLoggedActivities = [...prevLoggedActivities];
          let activitiesAddedCount = 0;
          let activitiesUpdatedCount = 0;

          result.identifiedActivities.forEach(identifiedAct => {
            const fullActivity = ActivityList.find(act => act.name === identifiedAct.name);
            if (fullActivity) {
              const existingActivityIndex = newLoggedActivities.findIndex(a => a.name === fullActivity.name);
              if (existingActivityIndex > -1) {
                if (identifiedAct.quantity !== null && identifiedAct.quantity !== undefined && newLoggedActivities[existingActivityIndex].quantity !== identifiedAct.quantity) {
                  newLoggedActivities[existingActivityIndex] = {
                    ...newLoggedActivities[existingActivityIndex],
                    quantity: identifiedAct.quantity,
                  };
                  activitiesUpdatedCount++;
                }
              } else {
                const activityToAdd: SelectedKarmaActivity = {
                  ...fullActivity,
                  quantity: identifiedAct.quantity !== undefined ? identifiedAct.quantity : (fullActivity.quantificationUnit ? null : undefined),
                  mediaDataUri: null,
                  mediaType: null,
                  triggers: '',
                };
                newLoggedActivities.push(activityToAdd);
                activitiesAddedCount++;
              }
            }
          });

          if (activitiesAddedCount > 0 && activitiesUpdatedCount > 0) {
            toast({ title: "AI Analysis Complete", description: `${activitiesAddedCount} new activities auto-selected and ${activitiesUpdatedCount} updated. Review and save.` });
          } else if (activitiesAddedCount > 0) {
            toast({ title: "AI Analysis Complete", description: `${activitiesAddedCount} new activities auto-selected. Review and save.` });
          } else if (activitiesUpdatedCount > 0) {
            toast({ title: "AI Analysis Complete", description: `${activitiesUpdatedCount} activities updated. Review and save.` });
          } else if (result.identifiedActivities.length > 0) {
             toast({ title: "AI Analysis Complete", description: "Activities confirmed based on your content. Review and save." });
          } else {
             toast({ title: "AI Analysis Complete", description: "No new activities identified from your content. You can still add manually." });
          }
          return newLoggedActivities;
        });
        return true;
      } else {
        toast({ title: "AI Analysis Failed", description: "Could not get suggestions from AI. The response might be empty or malformed. Please try again.", variant: "destructive" });
        return false;
      }
    } catch (error) {
      console.error("Error analyzing content with AI:", error);
      let description = "An unexpected error occurred during AI analysis.";
      if (error instanceof Error) {
        description = `AI Analysis Error: ${error.message.substring(0,100)}`;
      }
      toast({ title: "AI Analysis Error", description, variant: "destructive" });
      return false;
    } finally {
      setIsAnalyzingJournal(false);
    }
  };

  const handleJournalInputChange = (promptId: string, text: string) => {
    const newEntries = { ...journalEntries, [promptId]: text };
    setJournalEntries(newEntries);
    if (date) {
      localStorage.setItem(`${JOURNAL_STORAGE_KEY_PREFIX}${formatDate(date, 'yyyy-MM-dd')}`, JSON.stringify(newEntries));
    }
  };

  const handleTextJournalAnalysis = async () => {
     const fullJournalText = journalPrompts.map(p => journalEntries[p.id] || "").join("\n\n").trim();

    if (!fullJournalText) {
      toast({ title: "Empty Journal", description: "Nothing to analyze in your journal entries.", variant: "default" });
      return;
    }
    setIsAnalyzingJournal(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const identifiedActivityNamesFromLocalSearch: string[] = [];
    const lowerCaseJournalText = fullJournalText.toLowerCase();

    ActivityList.forEach(activity => {
      const searchTerms = [activity.name.toLowerCase(), ...(activity.keywords?.map(k => k.toLowerCase()) || [])];
      if (searchTerms.some(term => lowerCaseJournalText.includes(term))) {
        identifiedActivityNamesFromLocalSearch.push(activity.name);
      }
    });

    if (identifiedActivityNamesFromLocalSearch.length > 0) {
      setLoggedActivities(prevLoggedActivities => {
        let newActivitiesAddedCount = 0;
        const currentSelectedNames = new Set(prevLoggedActivities.map(a => a.name));
        const activitiesToUpdate = [...prevLoggedActivities];

        identifiedActivityNamesFromLocalSearch.forEach(activityName => {
          if (!currentSelectedNames.has(activityName)) {
            const fullActivity = ActivityList.find(act => act.name === activityName);
            if (fullActivity) {
              const activityToAdd: SelectedKarmaActivity = {
                ...fullActivity,
                mediaDataUri: null, mediaType: null,
                quantity: fullActivity.quantificationUnit ? null : undefined,
                triggers: '',
              };
              activitiesToUpdate.push(activityToAdd);
              newActivitiesAddedCount++;
            }
          }
        });
        if (newActivitiesAddedCount > 0) {
          toast({ title: "Local Analysis Complete", description: `${newActivitiesAddedCount} new activities auto-selected based on your journal. Review and save.` });
        } else {
          toast({ title: "Local Analysis Complete", description: "No new activities identified from your journal. Activities already selected were confirmed." });
        }
        return activitiesToUpdate;
      });
    } else {
      toast({ title: "Local Analysis Complete", description: "No specific activities identified from your journal entries through keyword matching." });
    }
    setIsAnalyzingJournal(false);
  };

  const handleStartRecording = async () => {
    setAudioDataURL(null); setTranscript(null); setVoiceJournalStatus("Starting...");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newMediaRecorder = new MediaRecorder(stream); setMediaRecorder(newMediaRecorder);
        newMediaRecorder.ondataavailable = (event) => setAudioChunks((prev) => [...prev, event.data]);
        newMediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const reader = new FileReader();
          reader.onloadend = () => setAudioDataURL(reader.result as string);
          reader.readAsDataURL(audioBlob);
          setAudioChunks([]); stream.getTracks().forEach(track => track.stop());
          setVoiceJournalStatus("Recording finished. Ready to analyze or re-record.");
        };
        newMediaRecorder.start(); setIsRecording(true);
        setVoiceJournalStatus("Recording... Tap Stop when done.");
      } catch (err) { console.error("Error accessing microphone:", err); toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please enable microphone permissions." }); setVoiceJournalStatus("Error: Could not access microphone."); }
    } else { toast({ variant: "destructive", title: "Unsupported Browser", description: "Audio recording not supported." }); setVoiceJournalStatus("Error: Audio recording not supported."); }
  };
  const handleStopRecording = () => { if (mediaRecorder) { mediaRecorder.stop(); setIsRecording(false); } };
  const handleAnalyzeVoiceNote = async () => {
    if (!audioDataURL) { toast({ title: "No Audio", description: "Record voice note first." }); return; }
    setIsTranscribing(true); setTranscript(null); setVoiceJournalStatus("Transcribing audio...");
    try {
      const input: TranscribeAudioInput = { audioDataUri: audioDataURL };
      const result = await transcribeAudio(input);
      if (result && result.transcript) {
        setTranscript(result.transcript); setVoiceJournalStatus("Transcription complete! Analyzing for activities...");
        await analyzeTextAndLogActivitiesAI(result.transcript);
      } else { toast({ title: "Transcription Failed", variant: "destructive" }); setVoiceJournalStatus("Transcription failed."); }
    } catch (error) { console.error("Error transcribing audio:", error); toast({ title: "Transcription Error", variant: "destructive" }); setVoiceJournalStatus("Error during transcription."); }
    finally { setIsTranscribing(false); if (!transcript) setVoiceJournalStatus(prev => prev.includes("failed") || prev.includes("Error") ? prev : "Ready for new recording or analysis.");}
  };

  const handleEnableCamera = () => {
    if (hasCameraPermission === true && streamRef.current) {
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(err => console.warn("Video play failed:", err));
      }
      setIsCameraOn(true);
    } else if (hasCameraPermission === false) {
      toast({ variant: "destructive", title: "Camera Access Denied", description: "Please enable camera permissions in your browser settings. You may need to refresh the page after granting permission." });
    } else if (hasCameraPermission === null) {
      toast({ title: "Camera Initializing", description: "Camera permission is being checked. Please try again in a moment." });
      // Optionally, re-trigger permission request here or guide user.
      // For now, relying on initial useEffect.
    }
  };

  const handleDisableCamera = () => {
    setIsCameraOn(false);
    if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null; 
    }
  };
  
  const handleCaptureSelfie = () => {
    if (videoRef.current && canvasRef.current && isCameraOn) {
      const video = videoRef.current; const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setSelfieDataURL(dataUrl);
        const dailySelfieActivity = ActivityList.find(act => act.name === "Daily Selfie");
        if (dailySelfieActivity) {
            handleActivityMediaUpdate(dailySelfieActivity.name, dataUrl, 'image');
        }
      }
      handleDisableCamera(); // Turn off camera view after capture
    }
  };

  const handleUploadSelfie = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { 
      const reader = new FileReader(); 
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setSelfieDataURL(dataUrl);
        const dailySelfieActivity = ActivityList.find(act => act.name === "Daily Selfie");
        if (dailySelfieActivity) {
            handleActivityMediaUpdate(dailySelfieActivity.name, dataUrl, 'image');
        }
      }; 
      reader.readAsDataURL(file); 
    }
  };

  const handleClearSelfie = () => {
    setSelfieDataURL(null);
    handleDisableCamera();
    // Also remove from loggedActivities if "Daily Selfie" was logged with media
    setLoggedActivities(prev => prev.map(act => act.name === "Daily Selfie" ? {...act, mediaDataUri: null, mediaType: null} : act));
  };

  const handleActivityToggle = (activity: KarmaActivity) => {
    setLoggedActivities((prevActivities) => {
      let newActivities = [...prevActivities];
      const existingActivityIndex = newActivities.findIndex((a) => a.name === activity.name);

      if (existingActivityIndex > -1) {
        newActivities.splice(existingActivityIndex, 1);
        if (activity.type === "Habit / Addiction" && expandedHabit === activity.name) {
          setExpandedHabit(null);
        }
      } else {
        const newSelectedActivity: SelectedKarmaActivity = { ...activity, mediaDataUri: null, mediaType: null, triggers: '' };
        if (activity.quantificationUnit) newSelectedActivity.quantity = null;
        
        // If it's the Daily Selfie activity and a selfie already exists, pre-fill it
        if(activity.name === "Daily Selfie" && selfieDataURL) {
            newSelectedActivity.mediaDataUri = selfieDataURL;
            newSelectedActivity.mediaType = 'image';
        }

        newActivities.push(newSelectedActivity);
        if (activity.type === "Habit / Addiction") {
          setExpandedHabit(activity.name);
        } else {
          setExpandedHabit(null);
        }
      }
      return newActivities;
    });
  };
  
  const handleActivityMediaUpdate = (activityName: string, dataUri: string | null, mediaType: 'image' | 'video' | null) => {
    setLoggedActivities(prev => {
        const activityExists = prev.some(act => act.name === activityName);
        if (activityExists) {
            return prev.map(act => act.name === activityName ? { ...act, mediaDataUri: dataUri, mediaType } : act);
        } else {
            // If activity not yet logged, add it with the media
            const activityDefinition = ActivityList.find(act => act.name === activityName);
            if (activityDefinition) {
                const newSelectedActivity: SelectedKarmaActivity = { 
                    ...activityDefinition, 
                    mediaDataUri: dataUri, 
                    mediaType, 
                    quantity: activityDefinition.quantificationUnit ? null : undefined,
                    triggers: '' 
                };
                return [...prev, newSelectedActivity];
            }
        }
        return prev;
    });
  };


  const handleMediaUpload = (activityName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let mediaType: 'image'|'video'|null = null;
        if (file.type.startsWith('image/')) mediaType = 'image';
        else if (file.type.startsWith('video/')) mediaType = 'video';
        handleActivityMediaUpdate(activityName, reader.result as string, mediaType);
        toast({ title: "Media Uploaded", description: `Media for ${activityName} added.` });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleQuantityChange = (activityName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLoggedActivities(prev => prev.map(act => act.name === activityName ? { ...act, quantity: value === "" ? null : parseFloat(value) } : act));
  };
  const handlePredefinedTriggerChange = (activityName: string, trigger: string, checked: boolean) => {
    setLoggedActivities(prev => prev.map(act => {
      if (act.name === activityName) {
        const { predefined, other } = parseTriggersString(act.triggers);
        const newPredefined = checked ? [...predefined, trigger] : predefined.filter(t => t !== trigger);
        return { ...act, triggers: buildTriggersString(newPredefined, other) };
      } return act;
    }));
  };
  const handleOtherTriggerChange = (activityName: string, otherTriggerText: string) => {
    setLoggedActivities(prev => prev.map(act => {
      if (act.name === activityName) {
        const { predefined } = parseTriggersString(act.triggers);
        return { ...act, triggers: buildTriggersString(predefined, otherTriggerText) };
      } return act;
    }));
  };

  const handleSave = () => {
    if (!date) {
      toast({ title: "Error", description: "Please select a date.", variant: "destructive" });
      return;
    }
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    localStorage.setItem(`karma-${formattedDate}`, JSON.stringify(loggedActivities));

    const fullJournalText = journalPrompts.map(p => journalEntries[p.id] || "").join("\n\n").trim();
    const reflectionDataToSave = {
      text: fullJournalText,
      mood: selectedMood,
    };
    localStorage.setItem(`${REFLECTION_STORAGE_KEY_PREFIX}${formattedDate}`, JSON.stringify(reflectionDataToSave));

    let journalEntryMade = fullJournalText !== "" || !!selectedMood;
    const dailyJournalingActivityLogged = loggedActivities.some(act => act.name === "Daily Journaling");
    let mainToastDescription = `Your Karma Journal for ${formatDate(date, "MMMM d, yyyy")} has been saved!`;
    setStreakJustUpdated(false);

    if (dailyJournalingActivityLogged || journalEntryMade) {
      let currentStreakData = journalingStreak || { type: 'dailyJournaling', currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
      const today = startOfDay(date);
      let streakUpdatedThisSave = false;

      if (currentStreakData.lastCompletedDate) {
        const lastDate = startOfDay(parseISO(currentStreakData.lastCompletedDate));
        if (isSameDay(today, lastDate)) {
          // Already counted for today
        } else if (differenceInCalendarDays(today, lastDate) === 1) {
          currentStreakData.currentStreak += 1;
          streakUpdatedThisSave = true;
        } else if (differenceInCalendarDays(today, lastDate) > 1) {
          mainToastDescription += ` Your previous ${currentStreakData.currentStreak}-day streak ended. New streak started!`;
          currentStreakData.currentStreak = 1;
          streakUpdatedThisSave = true;
        } else if (differenceInCalendarDays(today, lastDate) < 0) {
           // Journaling for a past date, don't break current streak unless it was for a date *after* current streak's last date
        } else {
             currentStreakData.currentStreak = 1;
             streakUpdatedThisSave = true;
        }
      } else {
        currentStreakData.currentStreak = 1;
        streakUpdatedThisSave = true;
      }

      if (streakUpdatedThisSave) {
        currentStreakData.lastCompletedDate = formattedDate;
         if (currentStreakData.currentStreak > currentStreakData.longestStreak) {
            currentStreakData.longestStreak = currentStreakData.currentStreak;
        }
        setJournalingStreak({...currentStreakData});
        localStorage.setItem(JOURNAL_STREAK_STORAGE_KEY, JSON.stringify(currentStreakData));
        if (currentStreakData.currentStreak > 1) {
             mainToastDescription += ` Journaling streak: ${currentStreakData.currentStreak} days!`;
        }
        setStreakJustUpdated(isSameDay(date, new Date()));
      }
    }

    let affirmationToBeShown = false;
    if (journalEntryMade) {
      const randomIndex = Math.floor(Math.random() * affirmationsList.length);
      setCurrentAffirmation(affirmationsList[randomIndex]);
      affirmationToBeShown = true;
    }

    if (journalEntryMade && !firstReflectionBadgeAchieved) {
        setFirstReflectionBadgeAchieved(true);
        localStorage.setItem(FIRST_REFLECTION_BADGE_KEY, 'true');
        mainToastDescription += " Badge Unlocked: First Reflection! 🎉";
    }

    toast({ title: "Recorded!", description: mainToastDescription });

    if (affirmationToBeShown) {
        setTimeout(() => setShowAffirmation(true), 500);
    }
  };

  const toggleFavoriteAffirmationHandler = (affirmation: string) => {
    setFavoriteAffirmations(prev => {
      const newFavorites = prev.includes(affirmation)
        ? prev.filter(fav => fav !== affirmation)
        : [...prev, affirmation];
      localStorage.setItem(FAVORITE_AFFIRMATIONS_STORAGE_KEY, JSON.stringify(newFavorites));
      toast({ title: newFavorites.includes(affirmation) ? "Affirmation Saved!" : "Affirmation Unsaved", description: `"${affirmation.substring(0,30)}..."` });
      return newFavorites;
    });
  };

  const disabledDays = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    sevenDaysAgo.setHours(0,0,0,0);
    return [
        { after: new Date(today.getFullYear(), today.getMonth(), today.getDate()) },
        { before: new Date(sevenDaysAgo.getFullYear(), sevenDaysAgo.getMonth(), sevenDaysAgo.getDate()) }
    ];
  }, []);

  const toggleFavoriteActivity = (activityName: string) => {
    setFavoriteActivities(prevFavorites => {
      const isFavorited = prevFavorites.includes(activityName);
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = prevFavorites.filter(name => name !== activityName);
        toast({ title: "Removed from Favorites", description: `${activityName} removed from your favorite acts.` });
      } else {
        updatedFavorites = [...prevFavorites, activityName];
        toast({ title: "Added to Favorites!", description: `${activityName} added to your favorite acts.` });
      }
      localStorage.setItem(FAVORITE_ACTIVITIES_STORAGE_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const renderActivityItem = (activity: KarmaActivity, isFavoriteContext: boolean = false, isHabitTab: boolean = false) => {
    const isSelected = loggedActivities.some(la => la.name === activity.name);
    const CurrentIconComponent = activity.icon || ActivityIcon;
    const selectedActivityInstance = loggedActivities.find(sa => sa.name === activity.name);
    const isFavorited = favoriteActivities.includes(activity.name);

    const { predefined: selectedPredefinedTriggers, other: currentOtherTriggerText } = parseTriggersString(selectedActivityInstance?.triggers);
    const showHabitDetails = isSelected && isHabitTab && expandedHabit === activity.name;
    const displayName = activity.shortName || activity.name;

    const chemical = activity.chemicalRelease && activity.chemicalRelease !== 'none' ? activity.chemicalRelease : 'none';
    const colorConfig = chemicalColorClasses[chemical];

    const buttonBaseClasses = "w-16 h-16 rounded-full flex items-center justify-center p-0 shadow-md transition-all duration-150 ease-in-out";
    const buttonSelectedClasses = "bg-primary text-primary-foreground ring-2 ring-offset-2";
    const buttonUnselectedClasses = "bg-card hover:bg-muted/80";

    const uniqueKey = `${activity.name}-${isFavoriteContext ? 'fav' : 'main'}-${isHabitTab ? 'habit' : 'gen'}`;

    return (
      <div key={uniqueKey} className="flex flex-col items-center w-28">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex flex-col items-center cursor-pointer group/activitybutton"
              onClick={(e) => {
                e.stopPropagation();
                handleActivityToggle(activity);
              }}
            >
              <div className="relative">
                {isHabitTab && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="absolute -top-1 -left-1 h-7 w-7 p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-800 dark:hover:bg-blue-700 dark:text-blue-300 z-10"
                          aria-label={`Get help for ${activity.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/habits-manager?concern=${encodeURIComponent(activity.name)}`}
                            passHref
                            legacyBehavior
                          >
                           <a><HelpCircle className="h-4 w-4" /></a>
                          </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Seek help & resources for {activity.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    buttonBaseClasses,
                    isSelected
                      ? cn(buttonSelectedClasses, colorConfig.ring)
                      : cn(buttonUnselectedClasses, colorConfig.border, isHabitTab && "hover:border-yellow-400"),
                    "focus:ring-2 focus:ring-offset-2",
                    isSelected ? colorConfig.ring : "focus:ring-ring"
                  )}
                  aria-pressed={isSelected}
                >
                  <CurrentIconComponent className={cn("w-8 h-8",
                    isSelected ? "text-primary-foreground" : colorConfig.icon,
                    isHabitTab && !isSelected && "group-hover/activitybutton:text-yellow-500"
                  )} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-7 w-7 p-1 rounded-full bg-background/70 hover:bg-accent/70"
                  onClick={(e) => { e.stopPropagation(); toggleFavoriteActivity(activity.name); }}
                  aria-label={isFavorited ? `Unfavorite ${activity.name}` : `Favorite ${activity.name}`}
                >
                  <Star className={cn("h-4 w-4", isFavorited ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground hover:text-yellow-400")} />
                </Button>
              </div>
              <span className="text-xs text-center mt-2 block w-full truncate">
                {displayName}{activity.requiresPhoto && !isHabitTab && chemical === 'none' ? <span className="text-destructive">*</span> : ''}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{activity.name} {activity.chemicalRelease && activity.chemicalRelease !== 'none' ? `(${activity.chemicalRelease.charAt(0).toUpperCase() + activity.chemicalRelease.slice(1)})` : ''}</p>
            {activity.requiresPhoto && !isHabitTab && chemical === 'none' && <p className="text-xs text-destructive/80">(Photo recommended)</p>}
          </TooltipContent>
        </Tooltip>

        {showHabitDetails && (
            <div className="mt-2 w-full space-y-2 p-1 border border-muted rounded-md bg-muted/20">
            {activity.quantificationUnit && (
                <div className="flex flex-col items-center">
                <Input
                    type="number"
                    step="any"
                    placeholder="Qty"
                    value={selectedActivityInstance?.quantity === null || selectedActivityInstance?.quantity === undefined ? "" : selectedActivityInstance.quantity}
                    onChange={(e) => handleQuantityChange(activity.name, e)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs h-8 w-full text-center"
                    aria-label={`Quantity for ${activity.name} in ${activity.quantificationUnit}`}
                />
                <span className="text-xs text-muted-foreground">{activity.quantificationUnit}</span>
                </div>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs mt-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Tags className="mr-2 h-3 w-3" /> Manage Triggers
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-64 sm:w-72 p-4"
                    onClick={(e) => e.stopPropagation()}
                    side="bottom"
                    align="center"
                >
                    <div className="space-y-3">
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground block mb-1.5">Common Triggers:</Label>
                        <ScrollArea className="h-32 pr-2">
                        <div className="space-y-1.5">
                            {activity.commonTriggers && activity.commonTriggers.length > 0 ? (
                                activity.commonTriggers.map(trigger => (
                                    <div key={trigger} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${activity.name}-trigger-${trigger.replace(/\s+/g, '-')}-popover`}
                                        checked={selectedPredefinedTriggers.includes(trigger)}
                                        onCheckedChange={(checked) => handlePredefinedTriggerChange(activity.name, trigger, Boolean(checked))}
                                    />
                                    <Label htmlFor={`${activity.name}-trigger-${trigger.replace(/\s+/g, '-')}-popover`} className="text-xs font-normal">
                                        {trigger}
                                    </Label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground">No common triggers defined for this habit.</p>
                            )}
                        </div>
                        </ScrollArea>
                    </div>
                    <div>
                        <Label htmlFor={`${activity.name}-other-trigger-popover`} className="text-xs font-medium text-muted-foreground block mb-1">Other Trigger:</Label>
                        <Input
                        id={`${activity.name}-other-trigger-popover`}
                        type="text"
                        placeholder="Describe other trigger..."
                        value={currentOtherTriggerText}
                        onChange={(e) => handleOtherTriggerChange(activity.name, e.target.value)}
                        className="text-xs h-8"
                        />
                    </div>
                    </div>
                </PopoverContent>
            </Popover>
            </div>
        )}

        {isSelected && !isHabitTab && activity.requiresPhoto && (
            <div className="mt-2 w-full space-y-2 p-1 border border-muted rounded-md bg-muted/20">
                 <div className="flex flex-col items-center mt-1">
                    <label htmlFor={`media-upload-${activity.name}-${isFavoriteContext ? 'fav' : 'main'}`} className="sr-only">Upload media for {activity.name}</label>
                    <Input
                        id={`media-upload-${activity.name}-${isFavoriteContext ? 'fav' : 'main'}`}
                        type="file"
                        accept="image/*,video/*"
                        className="text-xs h-auto w-full file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-muted file:text-foreground hover:file:bg-muted/80"
                        onChange={(e) => handleMediaUpload(activity.name, e)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Upload photo or video for ${activity.name}`}
                    />
                    {selectedActivityInstance?.mediaDataUri && selectedActivityInstance.mediaType === 'image' && (
                    <img src={selectedActivityInstance.mediaDataUri} alt="Preview" className="h-10 w-10 object-cover rounded mt-1 border" />
                    )}
                    {selectedActivityInstance?.mediaDataUri && selectedActivityInstance.mediaType === 'video' && (
                    <video src={selectedActivityInstance.mediaDataUri} controls className="h-16 w-full object-cover rounded mt-1 border" />
                    )}
                </div>
            </div>
        )}
      </div>
    );
  };

  const favoriteActivityObjects = useMemo(() => {
    return ActivityList.filter(activity => favoriteActivities.includes(activity.name));
  }, [favoriteActivities]);


  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center mt-8">
          <div className="w-full max-w-3xl mb-3 text-left">
            <p className="font-bold text-red-600 dark:text-red-500">
              Your data is your property. No one else including the developers of the app can access your data.
            </p>
          </div>
          {journalingStreak && journalingStreak.currentStreak > 0 && (
            <div className={cn(
                "flex items-center p-2 mb-4 bg-background border border-border rounded-lg shadow-md self-start max-w-3xl w-full",
                streakJustUpdated && "streak-updated-pulse"
            )}>
                <Flame className="h-6 w-6 text-orange-500 mr-2" />
                <span className="text-sm font-semibold text-foreground">
                    {journalingStreak.currentStreak}-Day Journaling Streak!
                </span>
                {streakJustUpdated && <SparklesIcon className="h-4 w-4 text-yellow-400 ml-1" />}
            </div>
          )}

          <div className="w-full max-w-3xl flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-left">Record Your Day</h1>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-auto justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDate(date, "dd-MM-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(selectedDate) => { setDate(selectedDate); setIsDatePickerOpen(false); }} disabled={disabledDays} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Card className="w-full max-w-3xl mb-6 shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center"><PaletteIconMood className="mr-2 h-6 w-6 text-primary"/>How are you feeling today?</CardTitle>
                  <CardDescription>Select a mood that best describes your overall feeling for {date ? formatDate(date, "MMMM d, yyyy") : 'the selected date'}.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap justify-center gap-3 sm:gap-4 p-4">
                  {moodOptions.map(mood => {
                      const IconComponent = mood.icon;
                      return (
                          <Tooltip key={mood.id}>
                              <TooltipTrigger asChild>
                                  <Button
                                      variant={selectedMood === mood.id ? "default" : "outline"}
                                      onClick={() => setSelectedMood(mood.id)}
                                      className={cn(
                                          "flex flex-col items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-lg p-2 transition-all duration-150 ease-in-out shadow-sm hover:shadow-md",
                                          selectedMood === mood.id ? `${mood.bgColor} ${mood.color} border-2 border-current ring-2 ring-offset-2 ring-current` : `hover:${mood.bgColor}`
                                      )}
                                      aria-pressed={selectedMood === mood.id}
                                  >
                                      <IconComponent className={cn("h-8 w-8 sm:h-10 sm:w-10 mb-1", selectedMood === mood.id ? mood.color : 'text-muted-foreground group-hover:'+mood.color)} />
                                      <span className={cn("text-xs sm:text-sm", selectedMood === mood.id ? mood.color : 'text-muted-foreground group-hover:'+mood.color)}>{mood.label}</span>
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>{mood.label}</p>
                              </TooltipContent>
                          </Tooltip>
                      );
                  })}
              </CardContent>
          </Card>


          <Card className="w-full max-w-3xl mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><SparklesIcon className="mr-2 h-6 w-6 text-primary" /> Quick Capture: Voice & Visuals</CardTitle>
              <CardDescription>Instantly log your thoughts with voice or add a selfie to your day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="p-4 bg-secondary/30">
                <CardTitle className="text-lg mb-2 flex items-center"><Mic className="mr-2 h-5 w-5"/>Voice Journal</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  {!isRecording ? (
                    <Button onClick={handleStartRecording} disabled={isTranscribing || isAnalyzingJournal} className="flex-1">
                      <Play className="mr-2 h-4 w-4" /> Start Recording
                    </Button>
                  ) : (
                    <Button onClick={handleStopRecording} variant="destructive" className="flex-1">
                      <Square className="mr-2 h-4 w-4" /> Stop Recording
                    </Button>
                  )}
                  <Button onClick={handleAnalyzeVoiceNote} disabled={!audioDataURL || isTranscribing || isRecording || isAnalyzingJournal} className="flex-1">
                    {isTranscribing || isAnalyzingJournal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Analyze Voice Note
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2 h-5">{voiceJournalStatus}</p>
                {audioDataURL && !isRecording && (
                  <audio controls src={audioDataURL} className="w-full mb-2">Your browser does not support the audio element.</audio>
                )}
                {transcript && (
                  <Textarea value={transcript} readOnly placeholder="Voice transcript will appear here..." rows={3} className="bg-background"/>
                )}
              </Card>

              <Card className="p-4 bg-secondary/30">
                <CardTitle className="text-lg mb-2 flex items-center"><CameraIconLucide className="mr-2 h-5 w-5"/>Daily Selfie</CardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                   {isCameraOn ? (
                      <Button onClick={handleDisableCamera} variant="outline"><VideoOff className="mr-2 h-4 w-4"/>Disable Camera</Button>
                    ) : (
                      <Button onClick={handleEnableCamera} disabled={hasCameraPermission === null || hasCameraPermission === false}>
                        <Video className="mr-2 h-4 w-4"/>
                        {hasCameraPermission === null ? "Checking Camera..." : hasCameraPermission === false ? "Camera Disabled" : "Enable Camera"}
                      </Button>
                    )}
                  <Button onClick={handleCaptureSelfie} disabled={!isCameraOn || hasCameraPermission !== true}><CameraIconLucide className="mr-2 h-4 w-4"/>Capture Selfie</Button>
                </div>
                <label htmlFor="upload-selfie" className="w-full">
                    <Button asChild className="w-full mb-2 cursor-pointer">
                      <span><Upload className="mr-2 h-4 w-4"/>Upload Selfie</span>
                    </Button>
                    <input id="upload-selfie" type="file" accept="image/*" onChange={handleUploadSelfie} className="sr-only" />
                  </label>
                
                <div className={cn("my-2 relative", { 'hidden': !isCameraOn && hasCameraPermission !== false })}>
                    <video ref={videoRef} className={cn("w-full aspect-video rounded-md border bg-muted", {'hidden': !isCameraOn})} autoPlay playsInline muted />
                    {hasCameraPermission === false && (
                      <Alert variant="destructive" className={cn("mt-2", {'absolute inset-0 flex flex-col items-center justify-center bg-destructive/90': isCameraOn })}>
                          <AlertTitle>Camera Access Denied</AlertTitle>
                          <AlertDescription>Please enable camera permissions in your browser settings. You may need to refresh.</AlertDescription>
                      </Alert>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden"></canvas>
                {selfieDataURL && (
                  <div className="mt-2 relative w-48 h-48 mx-auto">
                    <img src={selfieDataURL} alt="Selfie Preview" className="rounded-md object-cover w-full h-full border-2 border-primary shadow-md" />
                    <Button onClick={handleClearSelfie} variant="destructive" size="icon" className="absolute -top-2 -right-2 rounded-full h-7 w-7">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                )}
              </Card>
            </CardContent>
          </Card>

          <Card className="mt-2 w-full max-w-3xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center"><Brain className="mr-2 h-6 w-6 text-primary" /> Daily Journal & Intentions</CardTitle>
              <CardDescription>Reflect on your day and set intentions. Your entries can help automatically select karma activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {journalPrompts.map(prompt => (
                <div key={prompt.id}>
                  <label htmlFor={prompt.id} className="block text-sm font-medium text-left mb-1 text-muted-foreground">{prompt.question}</label>
                  <Textarea
                    id={prompt.id}
                    value={journalEntries[prompt.id] || ""}
                    onChange={(e) => handleJournalInputChange(prompt.id, e.target.value)}
                    placeholder="Type your thoughts here..."
                    rows={3}
                    disabled={isAnalyzingJournal}
                    dir="ltr"
                    className="journal-entry-input"
                  />
                </div>
              ))}
              <Button onClick={handleTextJournalAnalysis} disabled={isAnalyzingJournal} className="w-full mt-2">
                {isAnalyzingJournal && !isTranscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SparklesIcon className="mr-2 h-4 w-4" />}
                Analyze Full Journal & Auto-Select Activities
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-2 w-full max-w-3xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center"><SparklesIcon className="mr-2 h-6 w-6 text-accent" /> Inspired to Act?</CardTitle>
              <CardDescription>Journaling can spark ideas for positive action. Explore these areas:</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <Button variant="outline" asChild className="h-auto py-3 flex flex-col items-center justify-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
                  <Link href="/impact" className="flex flex-col items-center text-center">
                      <HandCoins className="mb-1 h-6 w-6 text-primary" />
                      <span className="text-xs sm:text-sm">Explore Impact</span>
                  </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-3 flex flex-col items-center justify-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
                  <Link href="/goals" className="flex flex-col items-center text-center">
                      <GoalIcon className="mb-1 h-6 w-6 text-primary" />
                      <span className="text-xs sm:text-sm">Set/Review Goals</span>
                  </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-3 flex flex-col items-center justify-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
                  <Link href="/habits-manager" className="flex flex-col items-center text-center">
                      <HeartPulse className="mb-1 h-6 w-6 text-primary" />
                      <span className="text-xs sm:text-sm">Manage Habits</span>
                  </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-3 flex flex-col items-center justify-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
                  <Link href="/reflections" className="flex flex-col items-center text-center">
                      <BookText className="mb-1 h-6 w-6 text-primary" />
                      <span className="text-xs sm:text-sm">View Reflections</span>
                  </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="w-full max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Log Your Day: {date ? formatDate(date, "dd-MM-yyyy") : 'Selected Date'}</CardTitle>
                <CardDescription>
                  Select activities you performed. Activities are color-coded by the primary "happy chemical" they may release. Media upload is not available for habits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="mb-6 p-3 border rounded-md bg-secondary/20">
                      <h4 className="text-sm font-semibold mb-2 text-center text-primary">Legend - Activity & "Happy Chemical" Associations:</h4>
                      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                          {appChemicalLegend.map(item => (
                          <Tooltip key={item.chemical}>
                              <TooltipTrigger asChild>
                                  <div className="flex items-center space-x-1.5 cursor-default">
                                      <div className={cn("w-3 h-3 rounded-full", item.colorClass)}></div>
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


                  {favoriteActivityObjects.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-primary mb-3 flex items-center">
                        <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
                        My Favourite Acts
                      </h3>
                      <Separator className="mb-4"/>
                      <div className="flex flex-wrap gap-x-4 gap-y-8 p-2 justify-center sm:justify-start">
                        {favoriteActivityObjects.map(activity => renderActivityItem(activity, true, activity.type === "Habit / Addiction"))}
                      </div>
                      <Separator className="mt-4 mb-6"/>
                    </div>
                  )}

                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="general">General Activities</TabsTrigger>
                      <TabsTrigger value="habits">
                          <ListChecks className="mr-2 h-4 w-4"/> Habits & Addictions
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                      {groupedGeneralActivities.length > 0 ? (
                        <Accordion type="multiple" className="w-full" defaultValue={accordionDefaultOpenValuesGeneral}>
                          {groupedGeneralActivities.map(group => (
                            <AccordionItem value={group.type} key={group.type}>
                              <AccordionTrigger>{group.type}</AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-x-4 gap-y-8 p-2 justify-center sm:justify-start">
                                  {group.activities.map(activity => renderActivityItem(activity, false, false))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <p className="text-muted-foreground">No general activities available.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="habits">
                      {habitActivities.length > 0 ? (
                          <div className="flex flex-wrap gap-x-4 gap-y-8 p-2 justify-center sm:justify-start">
                            {habitActivities.map(activity => renderActivityItem(activity, false, true))}
                          </div>
                      ) : (
                        <p className="text-muted-foreground">No habits/addictions defined.</p>
                      )}
                    </TabsContent>
                  </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 w-full max-w-md">
            <CardHeader>
              <CardTitle>Your Karma Score</CardTitle>
              <CardDescription>Total score for {date ? formatDate(date, "dd-MM-yyyy") : 'Selected Date'}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${totalScore >= 0 ? 'text-green-500' : 'text-red-500'}`}>Total Score: {totalScore}</p>
              {journalingStreak && journalingStreak.currentStreak > 0 && (
                <p className="text-sm text-accent mt-1">
                  Daily Journaling Streak: {journalingStreak.currentStreak} day{journalingStreak.currentStreak === 1 ? '' : 's'}!
                </p>
              )}
            </CardContent>
          </Card>

          <Button className="mt-4 mb-8" onClick={handleSave} disabled={!date || isAnalyzingJournal || isTranscribing || isRecording}>
            Save Activities & Journal
          </Button>
        </main>

          <Dialog open={showAffirmation} onOpenChange={setShowAffirmation}>
              <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle className="flex items-center">
                          <MessageCircleQuestion className="mr-2 h-6 w-6 text-primary" /> Today's Reflection Reward
                      </DialogTitle>
                  </DialogHeader>
                  <div className="py-6 text-center">
                      <p className="text-lg italic text-muted-foreground">"{currentAffirmation}"</p>
                  </div>
                  <DialogFooter className="justify-between">
                      <Button variant="ghost" onClick={() => toggleFavoriteAffirmationHandler(currentAffirmation)} aria-label="Save to favorites">
                          <Star className={cn("mr-2 h-5 w-5", favoriteAffirmations.includes(currentAffirmation) ? "fill-yellow-400 text-yellow-500" : "text-muted-foreground")} />
                          {favoriteAffirmations.includes(currentAffirmation) ? "Saved" : "Save"}
                      </Button>
                      <Button onClick={() => setShowAffirmation(false)}>Close</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
      </div>
    </TooltipProvider>
  );
}

    