
'use client';

import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ActivityList } from '@/app/constants';
import type { SelectedKarmaActivity, KarmaActivity as KarmaActivityType } from '@/app/types';
import { Info, Bot, Send, User, Upload, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { elaAddictionCounsellorFlow, type ElaCounsellorInput } from '@/ai/flows/ela-addiction-counsellor-flow';
import { cn } from "@/lib/utils";
import { format, parseISO, isValid, subDays } from 'date-fns';

const articles = {
  'Alcohol Addiction': [
    {
      title: 'Understanding Alcohol Use Disorder',
      url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-alcohol-use-disorder',
      triggers: 'Stress, social gatherings, boredom, negative emotions (sadness, anxiety), celebrations, specific people or places, withdrawal symptoms, seeing alcohol advertisements, peer pressure',
      sideEffects:
        'Liver damage, heart problems, increased risk of certain cancers, weakened immune system, pancreatitis, nerve damage, memory problems, depression, anxiety',
      remedies:
        'Therapy (CBT, motivational interviewing), support groups (AA), medication (naltrexone, acamprosate, disulfiram), lifestyle changes, avoiding triggers, medical detox for severe cases, nutritional support',
    },
    {
      title: 'Treatment for Alcohol Problems: Finding and Getting Help',
      url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/treatment-alcohol-problems-finding-and-getting-help',
      triggers: 'Stress, social gatherings, boredom, negative emotions (sadness, anxiety), celebrations, specific people or places, withdrawal symptoms, seeing alcohol advertisements, peer pressure',
      sideEffects:
        'Withdrawal symptoms (anxiety, tremors, seizures), relapse, social isolation, financial problems, legal issues, relationship conflicts',
      remedies:
        'Medical detox, inpatient/outpatient rehab programs, therapy, support groups, aftercare programs, sober living environments, developing coping mechanisms',
    },
  ],
  'Drug Addiction': [
    {
      title: 'DrugFacts: Understanding Drug Use and Addiction',
      url: 'https://www.drugabuse.gov/publications/drugfacts/understanding-drug-use-addiction',
      triggers: 'Stress, peer pressure, environmental cues (places, people, paraphernalia associated with drug use), mental health issues (depression, anxiety, trauma), physical pain (for opioids), boredom, loneliness, curiosity, history of substance abuse in family',
      sideEffects:
        'Organ damage (heart, liver, kidneys, brain), mental health disorders (psychosis, paranoia), overdose, infectious diseases (HIV, hepatitis from needle sharing), impaired judgment, addiction, withdrawal symptoms',
      remedies:
        'Detoxification, behavioral therapies (CBT, contingency management), medication-assisted treatment (MAT), support groups (NA), inpatient/outpatient treatment programs, relapse prevention planning, addressing co-occurring mental health disorders',
    },
  ],
  'Nicotine Addiction': [
    {
      title: 'Smoking & Tobacco Use',
      url: 'https://www.cdc.gov/tobacco/index.htm',
      triggers: 'Stress, social situations (seeing others smoke/vape), routines (after meals, with coffee, driving), boredom, emotional distress (sadness, anger), alcohol consumption, cravings, withdrawal symptoms, certain places or activities associated with smoking',
      sideEffects:
        'Lung cancer, heart disease, respiratory illnesses (COPD, emphysema, chronic bronchitis), stroke, various other cancers (mouth, throat, bladder), premature aging, stained teeth, bad breath, addiction',
      remedies:
        'Nicotine replacement therapy (patches, gum, lozenges), medication (bupropion, varenicline), counseling (individual or group), support groups, behavioral strategies (identifying and avoiding triggers, coping skills), quitlines',
    },
    {
      title: 'Resources for Quitting Tobacco',
      url: 'https://tobaccofree.org/quitting/?gad_source=1&gad_campaignid=16294939&gbraid=0AAAAAD_qyRYQ0llKMQ95y9C77ndcT6Gmm&gclid=CjwKCAjwpMTCBhA-EiwA_-MsmQq5SjBlD7B6I18dyXDWO3an3SGEkaRXaV2uYjAveIdVXiSJEbX7VBoCt38QAvD_BwE',
      triggers: 'Cravings, stress, social cues, routines associated with smoking/vaping, seeing others use tobacco',
      sideEffects:
        'Withdrawal symptoms (irritability, anxiety, difficulty concentrating), increased appetite, sleep disturbances initially',
      remedies:
        'Setting a quit date, identifying and managing triggers, using FDA-approved medications (NRT, bupropion, varenicline), behavioral counseling, support from quitlines or support groups, developing coping strategies for cravings',
    },
  ],
  'Caffeine Addiction': [
    {
      title: 'Caffeine: How much is too much?',
      url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/caffeine/art-20045678',
      triggers: 'Morning routine, fatigue/tiredness, work deadlines/study pressure, social coffee breaks, headaches (withdrawal), habit/ritual, boredom, smell of coffee',
      sideEffects: 'Anxiety, insomnia, digestive issues (heartburn, upset stomach), increased heart rate and blood pressure, restlessness, nervousness, caffeine withdrawal headaches, dependence',
      remedies: 'Gradual reduction of caffeine intake, substituting with lower-caffeine or caffeine-free beverages (herbal teas, decaf), improving sleep hygiene, stress management techniques, ensuring adequate hydration',
    },
  ],
  'Food Addiction': [
    {
      title: 'Is Food Addiction Real?',
      url: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/is-food-addiction-real',
      triggers: 'Stress, boredom, emotional distress (sadness, anxiety, loneliness), sight/smell of certain foods (especially highly palatable foods rich in sugar, fat, salt), social events, restrictive dieting (leading to binging), learned associations (e.g., eating while watching TV)',
      sideEffects: 'Weight gain/obesity, diabetes, heart disease, depression, low self-esteem, guilt, shame, digestive problems, nutritional deficiencies (if binging on processed foods)',
      remedies: 'Behavioral therapy (CBT), nutritional counseling, mindful eating practices, support groups (Overeaters Anonymous), addressing underlying emotional issues, creating a structured eating plan, avoiding trigger foods and situations',
    },
  ],
   'Sugar Addiction': [
    {
      title: 'Sugar Addiction: Is It Real?',
      url: 'https://www.webmd.com/diet/ss/slideshow-sugar-addiction',
      triggers: 'Stress, emotional eating, cravings, availability of sugary foods/drinks, habit (e.g., dessert after meals, sugary snacks), fatigue (seeking quick energy boost), social events/celebrations, advertisements for sugary products',
      sideEffects: 'Weight gain, type 2 diabetes, energy crashes, mood swings, dental problems (cavities), inflammation, increased risk of heart disease, difficulty concentrating, dependence',
      remedies: 'Limit processed foods and sugary drinks, choose natural sweeteners in moderation, increase protein and fiber intake to stabilize blood sugar, read food labels to identify hidden sugars, mindful eating, stress management, finding healthy alternatives for cravings',
    },
  ],
  'Social Media Addiction': [
    {
      title: 'Social Media Addiction',
      url: 'https://www.therecoveryvillage.com/behavioral-health/social-media-addiction/',
      triggers: 'FOMO (Fear Of Missing Out), boredom, loneliness, notifications/alerts, seeking validation (likes, comments, shares), habit (compulsive checking), procrastination, social pressure to stay updated, escapism from real-world problems',
      sideEffects: 'Anxiety, depression, low self-esteem, body image issues, sleep disturbances, reduced productivity, social isolation (despite being "connected"), cyberbullying, comparison with others',
      remedies: 'Limit screen time (set time limits, use app blockers), turn off notifications, unfollow accounts that trigger negative emotions, focus on real-life connections and hobbies, practice digital detox periods, mindfulness, seek therapy if severe',
    },
  ],
  'Internet Addiction': [
    {
      title: 'Internet Addiction',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3480687/',
      triggers: 'Boredom, loneliness, stress, anxiety (using internet to cope), procrastination/avoiding tasks, habit/mindless scrolling, seeking information or entertainment, Fear Of Missing Out (FOMO), easy accessibility, lack of real-world activities',
      sideEffects: 'Social isolation, eye strain, headaches, sleep disturbances, carpal tunnel syndrome, neglect of personal responsibilities (work, school, hygiene), depression, anxiety, financial problems (if related to online shopping/gaming)',
      remedies: 'Set time limits for internet use, take regular breaks, find alternative offline activities and hobbies, use internet blocking software, schedule internet-free times, prioritize real-life interactions, seek therapy (CBT)',
    },
  ],
  'Gaming Addiction': [
    {
      title: 'Gaming Disorder',
      url: 'https://www.who.int/news-room/questions-and-answers/item/gaming-disorder',
      triggers: 'Boredom/lack of alternative activities, stress relief/escapism, social connection within games, achievements/rewards in games, Fear Of Missing Out (FOMO) on in-game events, procrastination, loneliness, competitive drive',
      sideEffects: 'Social isolation, eye strain, headaches, sleep disturbances, carpal tunnel syndrome, neglect of responsibilities, poor academic/work performance, depression, anxiety, anger/irritability when unable to play, financial issues (in-game purchases)',
      remedies: 'Set strict time limits for gaming, take frequent breaks, find alternative hobbies and social activities, prioritize responsibilities, uninstall problematic games, seek therapy (CBT), join support groups for gaming addiction',
    },
  ],
  'Shopping Addiction': [
    {
      title: 'Compulsive Buying Disorder',
      url: 'https://www.psychologytoday.com/us/conditions/compulsive-buying-disorder',
      triggers: 'Sales and promotions, emotional distress (feeling down, stressed, anxious, bored, lonely), social media influence/advertisements, seeking a "high" or temporary mood boost from purchasing, payday/unexpected money, desire for new items/status',
      sideEffects: 'Financial problems (debt, bankruptcy), anxiety, depression, guilt, shame, relationship conflicts due to overspending, hoarding, lying about purchases, neglect of responsibilities',
      remedies: 'Create a budget and stick to it, avoid triggers (e.g., shopping malls, online stores, marketing emails), seek therapy (CBT), join support groups (Debtors Anonymous), use cash instead of credit cards, find healthier coping mechanisms for emotions',
    },
  ],
  'Gambling Addiction': [
    {
      title: 'Problem Gambling',
      url: 'https://www.helpguide.org/articles/addictions/problem-gambling.htm',
      triggers: 'Financial stress (chasing losses), excitement/thrill/"rush", boredom/loneliness, social influence/peer pressure, accessibility (online gambling, casinos), belief in luck or systems, escapism/avoiding problems, alcohol or drug use, advertisements',
      sideEffects: 'Severe financial problems (debt, bankruptcy, loss of assets), relationship issues, job loss, legal problems, depression, anxiety, suicidal thoughts, lying, stealing to fund gambling, neglect of responsibilities',
      remedies: 'Seek professional help (therapy, counseling), support groups (Gamblers Anonymous), self-exclusion programs from gambling venues/sites, manage finances (e.g., turn over control to a trusted person), develop coping strategies for triggers and cravings, find healthy alternatives',
    },
  ],
  'Work Addiction (Workaholism)': [
    {
      title: 'Workaholism: What You Need to Know',
      url: 'https://www.webmd.com/mental-health/what-is-workaholism',
      triggers: 'Fear of failure/insecurity, desire for approval/validation, feeling indispensable/difficulty delegating, company culture/pressure to overwork, avoiding personal problems/using work as escape, perfectionism, difficulty saying "no", ambition, financial pressures',
      sideEffects: 'Stress, burnout, health problems (cardiovascular, sleep disorders, anxiety, depression), relationship problems/neglect of family and friends, reduced productivity in the long run, lack of work-life balance, loss of interest in other activities',
      remedies: 'Set clear boundaries between work and personal life, schedule regular breaks and vacations, practice self-care (exercise, hobbies, relaxation), delegate tasks, learn to say "no" to extra work, seek therapy or coaching, prioritize tasks and manage time effectively, mindfulness',
    },
  ],
  'Pornography Addiction': [
    {
      title: 'Pornography Addiction: Symptoms, Risks and Treatment',
      url: 'https://www.healthline.com/health/porn-addiction',
      triggers: 'Stress, anxiety, loneliness, boredom, relationship dissatisfaction/lack of intimacy, easy accessibility online, habit/routine, escapism/avoiding emotions, curiosity/fantasy seeking, depression, low self-esteem',
      sideEffects: 'Sexual dysfunction (e.g., erectile dysfunction, delayed ejaculation), unrealistic expectations of sex and relationships, relationship problems, decreased intimacy, anxiety, depression, shame, guilt, social isolation, neglect of responsibilities, financial issues (if paying for content)',
      remedies: 'Cognitive-behavioral therapy (CBT), support groups (e.g., SAA, SRA), self-help books and programs, internet filters/blocking software, developing healthy coping mechanisms for stress and emotions, improving real-life relationships and intimacy, mindfulness, finding alternative hobbies',
    },
  ],
};

const counsellors = {
  'Alcohol Addiction': [
    {name: 'Dr. Emily Carter', contact: 'emily.carter@example.com'},
    {name: 'Dr. James Smith', contact: 'james.smith@example.com'},
  ],
  'Drug Addiction': [
    {name: 'Dr. Aisha Khan', contact: 'aisha.khan@example.com'},
    {name: 'Dr. Ben Williams', contact: 'ben.williams@example.com'},
  ],
  'Nicotine Addiction': [
    {name: 'Dr. Chloe Davis', contact: 'chloe.davis@example.com'},
    {name: 'Dr. Finn Taylor', contact: 'finn.taylor@example.com'},
  ],
  'Caffeine Addiction': [
    {name: 'Dr. Grace Miller', contact: 'grace.miller@example.com'},
    {name: 'Dr. Harry Wilson', contact: 'harry.wilson@example.com'},
  ],
  'Food Addiction': [
    {name: 'Dr. Isabella Moore', contact: 'isabella.moore@example.com'},
    {name: 'Dr. Jack Thomas', contact: 'jack.thomas@example.com'},
  ],
   'Sugar Addiction': [
    {name: 'Dr. Kate Green', contact: 'kate.green@example.com'},
    {name: 'Dr. Leo Hall', contact: 'leo.hall@example.com'},
  ],
  'Social Media Addiction': [
    {name: 'Dr. Olivia Adams', contact: 'olivia.adams@example.com'},
    {name: 'Dr. Peter Baker', contact: 'peter.baker@example.com'},
  ],
  'Internet Addiction': [
    {name: 'Dr. Quinn Hill', contact: 'quinn.hill@example.com'},
    {name: 'Dr. Ruby Nelson', contact: 'ruby.nelson@example.com'},
  ],
  'Gaming Addiction': [
    {name: 'Dr. Sam Wright', contact: 'sam.wright@example.com'},
    {name: 'Dr. Sophia King', contact: 'sophia.king@example.com'},
  ],
  'Shopping Addiction': [
    {name: 'Dr. Tom Scott', contact: 'tom.scott@example.com'},
    {name: 'Dr. Uma Lewis', contact: 'uma.lewis@example.com'},
  ],
  'Gambling Addiction': [
    {name: 'Dr. Victor Gray', contact: 'victor.gray@example.com'},
    {name: 'Dr. Wendy Bell', contact: 'wendy.bell@example.com'},
  ],
  'Work Addiction (Workaholism)': [
    {name: 'Dr. Xavier Cook', contact: 'xavier.cook@example.com'},
    {name: 'Dr. Yara Ward', contact: 'yara.ward@example.com'},
  ],
  'Pornography Addiction': [
    {name: 'Dr. Daisy Barnes', contact: 'daisy.barnes@example.com'},
    {name: 'Dr. Eric Coleman', contact: 'eric.coleman@example.com'},
  ],
};

interface Program {
  id: string;
  name: string;
  counsellor: string;
  duration: string;
  cost: number;
  description: string;
}

interface RegistrationReceipt {
  registrationId: string;
  programName: string;
  counsellor: string;
  amountPaid: number;
  registrationDate: string;
  concernType: string;
  selectedDuration: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface AddictionInstanceForFlow {
    date: string;
    quantity: number | null | undefined;
    quantificationUnit?: string;
    triggers?: string;
}


const programDurations = ["3 Months", "6 Months", "9 Months", "1 Year"];
const programsData: Record<string, Program[]> = {
  'Alcohol Addiction': [
    { id: 'aa_prog1', name: 'Sober Foundations', counsellor: 'Dr. Emily Carter', duration: '4 Weeks', cost: 199, description: 'Build a strong foundation for a life free from alcohol. Includes weekly sessions and coping strategies to identify triggers and manage cravings. This program incorporates mindfulness practices.' },
    { id: 'aa_prog2', name: 'Mindful Recovery Path', counsellor: 'Dr. James Smith', duration: '8 Weeks', cost: 349, description: 'A holistic approach to understanding triggers and developing healthier habits. Focuses on relapse prevention and building a supportive social network. Includes family counseling sessions.' },
  ],
  'Drug Addiction': [
    { id: 'da_prog1', name: 'Clean Start Intensive', counsellor: 'Dr. Aisha Khan', duration: '6 Weeks', cost: 499, description: 'Intensive support for overcoming drug dependency with personalized plans and daily check-ins. Suitable for various substance use disorders. Offers aftercare planning.' },
    { id: 'da_prog2', name: 'Relapse Prevention Skills', counsellor: 'Dr. Ben Williams', duration: '10 Weeks', cost: 400, description: 'Focus on identifying relapse triggers and building long-term coping mechanisms. Includes cognitive behavioral therapy (CBT) techniques and group therapy sessions.' },
  ],
  'Nicotine Addiction': [
    { id: 'na_prog1', name: 'Breathe Free Program', counsellor: 'Dr. Chloe Davis', duration: '4 Weeks', cost: 150, description: 'Step-by-step guidance to quit smoking or vaping. Utilizes nicotine replacement therapy advice and behavioral modification strategies.' },
    { id: 'na_prog2', name: 'Smoke-Free for Life', counsellor: 'Dr. Finn Taylor', duration: '6 Weeks', cost: 220, description: 'Comprehensive support including behavioral therapy, stress management techniques, and peer support groups to ensure long-term cessation.' },
  ],
  'Caffeine Addiction': [
    { id: 'ca_prog1', name: 'Balanced Energy Habits', counsellor: 'Dr. Grace Miller', duration: '3 Weeks', cost: 99, description: 'Learn to manage caffeine intake, understand its effects on your body, and find natural energy sources. Includes dietary advice and sleep hygiene tips.' },
  ],
  'Food Addiction': [
    { id: 'fa_prog1', name: 'Mindful Eating Journey', counsellor: 'Dr. Isabella Moore', duration: '8 Weeks', cost: 299, description: 'Develop a healthier relationship with food through mindfulness, intuitive eating principles, and nutritional guidance. Addresses emotional eating patterns.' },
  ],
  'Sugar Addiction': [
    { id: 'sa_prog1', name: 'Sweet Freedom Plan', counsellor: 'Dr. Kate Green', duration: '4 Weeks', cost: 129, description: 'Break free from sugar cravings, understand hidden sugars, and adopt a balanced diet. Provides recipes and meal planning support.' },
  ],
  'Social Media Addiction': [
    { id: 'sma_prog1', name: 'Mindful Social Engagement', counsellor: 'Dr. Olivia Adams', duration: '4 Weeks', cost: 160, description: 'Learn to use social media consciously, reduce compulsive checking, and protect your mental well-being from online pressures. Focuses on digital citizenship.' },
  ],
  'Internet Addiction': [
    { id: 'ia_prog1', name: 'Online Life Rebalance', counsellor: 'Dr. Quinn Hill', duration: '6 Weeks', cost: 200, description: 'Strategies for managing internet use, fostering real-world connections, and addressing underlying issues contributing to excessive online behavior.' },
  ],
  'Gaming Addiction': [
    { id: 'ga_prog1', name: 'Game On: Healthy Play', counsellor: 'Dr. Sam Wright', duration: '8 Weeks', cost: 250, description: 'Support for gamers to find balance, manage excessive gaming habits, and integrate gaming positively into their lives. Addresses issues like loot box mechanics.' },
  ],
  'Shopping Addiction': [
    { id: 'shopa_prog1', name: 'Conscious Consumer Course', counsellor: 'Dr. Tom Scott', duration: '6 Weeks', cost: 190, description: 'Address compulsive shopping behaviors, develop financial wellness, and understand the psychological triggers behind overspending. Includes budgeting tools.' },
  ],
  'Gambling Addiction': [
    { id: 'gamba_prog1', name: 'Bet on Yourself Recovery', counsellor: 'Dr. Victor Gray', duration: '10 Weeks', cost: 350, description: 'A structured program to overcome gambling addiction, manage financial recovery, and rebuild trust. Offers support for families affected.' },
  ],
  'Work Addiction (Workaholism)': [
    { id: 'worka_prog1', name: 'Work-Life Harmony Workshop', counsellor: 'Dr. Xavier Cook', duration: '5 Weeks', cost: 220, description: 'Find balance, manage stress, prevent burnout from workaholism, and learn to set healthy boundaries between work and personal life.' },
  ],
  'Pornography Addiction': [
    { id: 'porna_prog1', name: 'Healthy Intimacy Path', counsellor: 'Dr. Daisy Barnes', duration: '8 Weeks', cost: 280, description: 'Address compulsive pornography use, understand its impact on relationships and self-esteem, and build healthier sexual habits and intimacy skills.' },
  ],
};

const concernTypes = Object.keys(articles);
const REGISTRATIONS_STORAGE_KEY = 'habitProgramRegistrations';

const HabitsManagerClient = () => {
  const searchParams = useSearchParams();
  const [selectedConcernType, setSelectedConcernType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [counsellorList, setCounsellorList] = useState<{name: string; contact: string}[]>([]);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationReceipt[]>([]);
  const [latestReceipt, setLatestReceipt] = useState<RegistrationReceipt | null>(null);
  const {toast} = useToast();
  const [selectedArticle, setSelectedArticle] = useState<(typeof articles)[keyof typeof articles][0] | null>(null);
  
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [programForPayment, setProgramForPayment] = useState<Program | null>(null);
  const [selectedProgramDuration, setSelectedProgramDuration] = useState<string>(programDurations[0]);

  const [userMessageEla, setUserMessageEla] = useState('');
  const [chatMessagesEla, setChatMessagesEla] = useState<ChatMessage[]>([]);
  const [isElaLoading, setIsElaLoading] = useState(false);
  const elaChatContainerRef = useRef<HTMLDivElement>(null);

  const handleConcernChange = useCallback((newConcern: string) => {
    setSelectedConcernType(newConcern);
    setSearchTerm(newConcern); 
  }, []);

  useEffect(() => {
    const concernFromQuery = searchParams.get('concern');
    if (concernFromQuery) {
        const decodedConcern = decodeURIComponent(concernFromQuery);
        if (concernTypes.includes(decodedConcern)) {
            handleConcernChange(decodedConcern);
        } else {
            console.warn(`Concern type "${decodedConcern}" from query not found.`);
            handleConcernChange(''); 
        }
    }
    const storedRegistrations = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (storedRegistrations) {
        setRegistrations(JSON.parse(storedRegistrations));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); 

  useEffect(() => {
    if (searchTerm === "" && !searchParams.get('concern')) { 
        if (selectedConcernType !== '') handleConcernChange('');
        return;
    }
    const foundConcern = concernTypes.find(type =>
        type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (foundConcern && foundConcern !== selectedConcernType) {
        handleConcernChange(foundConcern);
    }
  }, [searchTerm, selectedConcernType, handleConcernChange, searchParams]);

  useEffect(() => {
    setCounsellorList(selectedConcernType ? (counsellors[selectedConcernType as keyof typeof counsellors] || []) : []);
    setProgramList(selectedConcernType ? (programsData[selectedConcernType as keyof typeof programsData] || []) : []);
    const currentConcernArticles = selectedConcernType ? articles[selectedConcernType as keyof typeof articles] : null;
    setSelectedArticle(currentConcernArticles?.[0] || null);
    setLatestReceipt(null); 

    if (selectedConcernType) {
        setChatMessagesEla([{role: 'model', content: `Hi! I'm Ela. I can offer some general information and support for ${selectedConcernType}. How can I help you today?`}]);
    } else {
        setChatMessagesEla([]); 
    }
  }, [selectedConcernType]);


  useEffect(() => {
    if (elaChatContainerRef.current) {
      elaChatContainerRef.current.scrollTop = elaChatContainerRef.current.scrollHeight;
    }
  }, [chatMessagesEla]);

  const handleSupportRequest = async () => {
    if (!selectedConcernType) {
      toast({
        title: 'Error',
        description: 'Please select a habit or concern type to see available counsellors and programs for addictions.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Addiction Support Info Updated',
      description: 'List of available counsellors and programs for addictions has been updated based on your selection.',
    });
  };

  const openPaymentDialog = (program: Program) => {
    setProgramForPayment(program);
    setSelectedProgramDuration(programDurations[0]);
    setIsPaymentDialogOpen(true);
  };
  
  const logSelfImprovementActivity = () => {
    const improvementActivity = ActivityList.find(activity => activity.name === 'Self-Improvement Initiative');
    if (improvementActivity) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const storageKey = `karma-${todayStr}`;
      const existingActivities: SelectedKarmaActivity[] = JSON.parse(localStorage.getItem(storageKey) || '[]');

      if (!existingActivities.some(act => act.name === improvementActivity.name)) {
        const activityToLog: SelectedKarmaActivity = {
          ...improvementActivity,
          mediaDataUri: null,
          mediaType: null,
          quantity: null,
          triggers: '',
        };
        localStorage.setItem(storageKey, JSON.stringify([...existingActivities, activityToLog]));
      }
    }
  };

  const handleProgramRegistration = () => {
    if (!programForPayment) return;

    const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const receiptData: RegistrationReceipt = {
      registrationId,
      programName: programForPayment.name,
      counsellor: programForPayment.counsellor,
      amountPaid: programForPayment.cost,
      registrationDate: new Date().toLocaleDateString(),
      concernType: selectedConcernType,
      selectedDuration: selectedProgramDuration,
    };

    const newRegistrations = [...registrations, receiptData];
    setRegistrations(newRegistrations);
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(newRegistrations));
    setLatestReceipt(receiptData);
    logSelfImprovementActivity();

    toast({
      title: 'Registration Successful!',
      description: `You've successfully registered for "${programForPayment.name}" for ${selectedProgramDuration}. Cost: $${programForPayment.cost}. A "Self-Improvement Initiative" has been logged in your Karma Journal.`,
    });
    setIsPaymentDialogOpen(false);
    setProgramForPayment(null);
  };

  const handleSendMessageToEla = async () => {
    if (!userMessageEla.trim() || !selectedConcernType) {
      toast({title: "Cannot send message to Ela", description: "Please select an addiction concern type and type a message.", variant: "default"});
      return;
    }
    const newUserMessage: ChatMessage = { role: 'user', content: userMessageEla.trim() };
    setChatMessagesEla(prev => [...prev, newUserMessage]);
    setUserMessageEla('');
    setIsElaLoading(true);

    let addictionLogForFlow: AddictionInstanceForFlow[] = [];
    if (typeof window !== 'undefined') {
        const today = new Date();
        for (let i = 0; i < 30; i++) { // Look back 30 days
            const targetDate = subDays(today, i);
            const dateStr = format(targetDate, 'yyyy-MM-dd');
            const activitiesString = localStorage.getItem(`karma-${dateStr}`);
            if (activitiesString) {
                try {
                    const dailyActivities: SelectedKarmaActivity[] = JSON.parse(activitiesString);
                    dailyActivities.forEach(activity => {
                        if (activity.name === selectedConcernType) {
                            const activityDefinition = ActivityList.find(a => a.name === activity.name);
                            addictionLogForFlow.push({
                                date: dateStr,
                                quantity: activity.quantity,
                                quantificationUnit: activityDefinition?.quantificationUnit,
                                triggers: activity.triggers || '',
                            });
                        }
                    });
                } catch (e) { console.warn(`Error parsing activities for Ela's history on ${dateStr}`, e); }
            }
        }
        addictionLogForFlow.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending
        if (addictionLogForFlow.length > 15) { // Limit to most recent 15 entries if too many
            addictionLogForFlow = addictionLogForFlow.slice(-15);
        }
    }

    try {
      const input: ElaCounsellorInput = {
        addictionType: selectedConcernType,
        userQuery: newUserMessage.content,
        chatHistory: chatMessagesEla.slice(0, -1).filter(msg => msg.role === 'user' || msg.role === 'model'), // Ensure only valid roles
        addictionHistory: addictionLogForFlow,
      };
      const response = await elaAddictionCounsellorFlow(input);
      const elaResponse: ChatMessage = { role: 'model', content: response.elaResponse };
      setChatMessagesEla(prev => [...prev, elaResponse]);
    } catch (error) {
      console.error("Error getting response from Ela:", error);
      const errorResponse: ChatMessage = { role: 'model', content: "I'm having a little trouble connecting right now. Please try again in a moment." };
      setChatMessagesEla(prev => [...prev, errorResponse]);
      toast({title: "AI Counsellor Ela Error", description: "Could not get a response from Ela.", variant: "destructive"});
    } finally {
      setIsElaLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-6xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-primary">Addiction & Habit Support Hub</CardTitle>
          <CardDescription className="text-muted-foreground">
            Find resources for addictions/habits, and chat with AI Counsellor Ela for guidance.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8"> {/* Changed from grid to single column with space-y */}
          
          <div className="grid gap-2">
            <label htmlFor="search-concern" className="font-semibold text-sm">Search Addiction Concern</label>
            <Input
              type="text"
              id="search-concern"
              placeholder="e.g., Alcohol, Gaming, Shopping"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="shadow-sm"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="concern-type-ela" className="font-semibold text-sm">Or Select Addiction Type (for Ela & Resources)</label>
            <Select 
              onValueChange={handleConcernChange} 
              value={selectedConcernType}
            >
              <SelectTrigger id="concern-type-ela" className="w-full shadow-sm">
                <SelectValue placeholder="Select an addiction type" />
              </SelectTrigger>
              <SelectContent>
                {concernTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedArticle && (
            <Card className="bg-secondary/20 shadow-md rounded-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-accent">{selectedArticle.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedArticle.triggers && (
                  <div>
                    <label htmlFor="triggers" className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Common Triggers</label>
                    <Textarea id="triggers" value={selectedArticle.triggers} readOnly className="mt-1 bg-background/50" rows={3} />
                  </div>
                )}
                <div>
                  <label htmlFor="side-effects" className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Side Effects</label>
                  <Textarea id="side-effects" value={selectedArticle.sideEffects} readOnly className="mt-1 bg-background/50" rows={3} />
                </div>
                <div>
                  <label htmlFor="remedies" className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Remedies</label>
                  <Textarea id="remedies" value={selectedArticle.remedies} readOnly className="mt-1 bg-background/50" rows={3} />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* AI Counsellor Ela Card */}
          <Card className="flex flex-col border rounded-lg p-4 shadow-sm bg-card h-[calc(100vh-20rem)] min-h-[500px] max-h-[700px]">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/ela.png" alt="Ela AI Counsellor" />
                <AvatarFallback>ELA</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg text-primary">Ela</p>
                <p className="text-xs text-muted-foreground">AI Addiction Counsellor</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 p-2 border border-dashed rounded-md">
                Ela is an AI assistant and cannot provide medical advice. Information shared is for general guidance for addictions. Please consult with a qualified healthcare professional.
            </p>
            <ScrollArea className="flex-grow mb-4 pr-2" ref={elaChatContainerRef}>
              <div className="space-y-4">
                {chatMessagesEla.map((msg, index) => (
                  <div
                    key={`ela-${index}`}
                    className={cn("flex items-end space-x-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.role === 'model' && (
                      <Avatar className="h-6 w-6 self-start">
                        <AvatarImage src="/ela.png" alt="Ela" />
                        <AvatarFallback>E</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("p-3 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap shadow-sm", msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-muted-foreground rounded-bl-none')}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (<Avatar className="h-6 w-6 self-start"><AvatarFallback><User className="h-4 w-4"/></AvatarFallback></Avatar>)}
                  </div>
                ))}
                {isElaLoading && (
                    <div className="flex justify-start space-x-2">
                        <Avatar className="h-6 w-6 self-start"><AvatarImage src="/ela.png" alt="Ela" /><AvatarFallback>E</AvatarFallback></Avatar>
                        <div className="p-3 rounded-lg bg-muted text-muted-foreground rounded-bl-none text-sm shadow-sm">Ela is typing...</div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2 mt-auto">
              <Input
                type="text"
                placeholder={selectedConcernType ? `Ask Ela about ${selectedConcernType}...` : "Select addiction concern first..."}
                value={userMessageEla}
                onChange={(e) => setUserMessageEla(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isElaLoading && handleSendMessageToEla()}
                disabled={!selectedConcernType || isElaLoading}
                className="flex-grow"
              />
              <Button onClick={handleSendMessageToEla} disabled={!selectedConcernType || isElaLoading || !userMessageEla.trim()} size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Program Registration Note */}
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start space-x-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>Registering for an addiction support program is a positive step. A "Self-Improvement Initiative" activity will be automatically logged in your Karma Journal.</p>
          </div>

          <Button onClick={handleSupportRequest} disabled={!selectedConcernType} className="w-full sm:w-auto shadow-md">
            Seek Addiction Support & View Programs
          </Button>

          {counsellorList.length > 0 && (
            <Card className="mt-4 shadow-md rounded-md">
              <CardHeader className="bg-muted/20">
                <CardTitle className="text-xl">Available Counsellors for {selectedConcernType}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {counsellorList.map((counsellor, index) => (
                    <li key={index} className="p-3 border rounded-md bg-background/50 hover:shadow-sm transition-shadow">
                      <p className="font-semibold text-primary">{counsellor.name}</p>
                      <p className="text-sm text-muted-foreground">Contact: {counsellor.contact}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {programList.length > 0 && (
            <Card className="mt-6 shadow-md rounded-md">
              <CardHeader className="bg-muted/20">
                <CardTitle className="text-xl">Available Programs for {selectedConcernType}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2"> {/* Adjusted grid for wider cards in single column */}
                {programList.map((program) => (
                  <Card key={program.id} className="flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-accent">{program.name}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Led by: {program.counsellor} | Base Duration: {program.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm"><p>{program.description}</p></CardContent>
                    <CardFooter className="flex justify-between items-center border-t pt-3 mt-2">
                      <p className="font-semibold text-lg">${program.cost}</p>
                      <Button onClick={() => openPaymentDialog(program)} size="sm">Register</Button>
                    </CardFooter>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {(latestReceipt || registrations.length > 0) && <Separator className="my-6" />}

          {latestReceipt && (
            <Card className="mt-6 shadow-lg rounded-md border-primary border-2">
              <CardHeader className="bg-primary/10"><CardTitle className="text-xl text-primary">Latest Program Registration Receipt</CardTitle></CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                <p><strong>Registration ID:</strong> {latestReceipt.registrationId}</p>
                <p><strong>Program:</strong> {latestReceipt.programName}</p>
                <p><strong>Counsellor:</strong> {latestReceipt.counsellor}</p>
                <p><strong>Selected Duration:</strong> {latestReceipt.selectedDuration}</p>
                <p><strong>Amount Paid:</strong> ${latestReceipt.amountPaid}</p>
                <p><strong>Date:</strong> {latestReceipt.registrationDate}</p>
                <p><strong>For Concern:</strong> {latestReceipt.concernType}</p>
              </CardContent>
            </Card>
          )}

          {registrations.length > 0 && (
            <Accordion type="single" collapsible className="w-full mt-6">
              <AccordionItem value="program-registrations">
                <AccordionTrigger className="text-xl font-semibold">View All My Program Registrations ({registrations.length})</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  {registrations.filter(reg => !latestReceipt || reg.registrationId !== latestReceipt.registrationId)
                                .sort((a,b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
                                .map((receipt) => (
                    <Card key={receipt.registrationId} className="shadow-sm">
                      <CardHeader className="bg-muted/20 pb-2">
                        <CardTitle className="text-md">Receipt: {receipt.programName}</CardTitle>
                         <CardDescription className="text-xs">ID: {receipt.registrationId} | Date: {receipt.registrationDate}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-3 space-y-1 text-xs">
                        <p><strong>Counsellor:</strong> {receipt.counsellor}</p>
                        <p><strong>Selected Duration:</strong> {receipt.selectedDuration}</p>
                        <p><strong>Amount Paid:</strong> ${receipt.amountPaid}</p>
                        <p><strong>For Concern:</strong> {receipt.concernType}</p>
                      </CardContent>
                    </Card>
                  ))}
                   {registrations.length === 0 && !latestReceipt && <p className="text-muted-foreground">No past program registrations found.</p>}
                   {registrations.length === 1 && latestReceipt && registrations[0].registrationId === latestReceipt.registrationId && <p className="text-muted-foreground">No other program registrations found.</p>}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <Accordion type="single" collapsible className="w-full mt-8">
            <AccordionItem value="articles">
              <AccordionTrigger className="text-xl font-semibold">Helpful Articles & Resources (Addictions)</AccordionTrigger>
              <AccordionContent className="pt-4">
                {selectedConcernType && articles[selectedConcernType as keyof typeof articles] ? (
                  <ul className="space-y-3">
                    {articles[selectedConcernType as keyof typeof articles].map((article, index) => (
                      <li key={index} className="p-3 border rounded-md bg-background/30 hover:shadow-sm transition-shadow">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{article.title}</a>
                         <p className="text-xs text-muted-foreground mt-1">Side Effects: {article.sideEffects.substring(0,100)}{article.sideEffects.length > 100 ? '...' : ''}</p>
                         <p className="text-xs text-muted-foreground mt-1">Remedies: {article.remedies.substring(0,100)}{article.remedies.length > 100 ? '...' : ''}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{selectedConcernType ? 'No articles found for this addiction.' : 'Select an addiction type to find helpful articles.'}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
        </CardContent>
      </Card>

      {programForPayment && (
        <Dialog open={isPaymentDialogOpen} onOpenChange={(isOpen) => { setIsPaymentDialogOpen(isOpen); if (!isOpen) setProgramForPayment(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register for: {programForPayment.name}</DialogTitle>
              <DialogDescription>Led by: {programForPayment.counsellor}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Program Description</Label>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border">{programForPayment.description}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="program-duration">Select Duration</Label>
                <Select value={selectedProgramDuration} onValueChange={setSelectedProgramDuration}>
                    <SelectTrigger id="program-duration" className="w-full"><SelectValue placeholder="Select duration" /></SelectTrigger>
                    <SelectContent>{programDurations.map(duration => (<SelectItem key={duration} value={duration}>{duration}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                You are about to register for <span className="font-semibold">{programForPayment.name}</span> for a duration of <span className="font-semibold">{selectedProgramDuration}</span>.
                The cost for this program is <span className="font-semibold">${programForPayment.cost}</span>.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setIsPaymentDialogOpen(false); setProgramForPayment(null);}}>Cancel</Button>
              <Button onClick={handleProgramRegistration}>Confirm Payment & Register</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default HabitsManagerClient;
