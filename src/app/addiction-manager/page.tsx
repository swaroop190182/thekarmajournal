
'use client';

import React, {useState, useEffect} from 'react';
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

const articles = {
  'Alcohol Addiction': [
    {
      title: 'Understanding Alcohol Use Disorder',
      url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-alcohol-use-disorder',
      sideEffects:
        'Liver damage, heart problems, increased risk of certain cancers, weakened immune system',
      remedies:
        'Therapy, support groups, medication, lifestyle changes, avoiding triggers',
    },
    {
      title: 'Treatment for Alcohol Problems: Finding and Getting Help',
      url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/treatment-alcohol-problems-finding-and-getting-help',
      sideEffects:
        'Withdrawal symptoms, relapse, social isolation, financial problems',
      remedies:
        'Medical detox, therapy, support groups, aftercare programs, sober living',
    },
  ],
  'Drug Addiction': [
    {
      title: 'DrugFacts: Understanding Drug Use and Addiction',
      url: 'https://www.drugabuse.gov/publications/drugfacts/understanding-drug-use-addiction',
      sideEffects:
        'Organ damage, mental health disorders, overdose, infectious diseases',
      remedies:
        'Detoxification, therapy, medication, support groups, relapse prevention',
    },
  ],
  'Nicotine Addiction': [
    {
      title: 'Smoking & Tobacco Use',
      url: 'https://www.cdc.gov/tobacco/index.htm',
      sideEffects:
        'Lung cancer, heart disease, respiratory illnesses, stroke',
      remedies:
        'Nicotine replacement therapy, medication, counseling, support groups',
    },
  ],
  'Caffeine Addiction': [
    {
      title: 'Caffeine: How much is too much?',
      url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/caffeine/art-20045678',
      sideEffects: 'Anxiety, insomnia, digestive issues, increased heart rate',
      remedies: 'Gradual reduction, herbal teas, relaxation techniques',
    },
  ],
  'Food Addiction': [
    {
      title: 'Is Food Addiction Real?',
      url: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/is-food-addiction-real',
      sideEffects: 'Weight gain, diabetes, heart disease, depression',
      remedies: 'Behavioral therapy, nutritional counseling, mindful eating, support groups',
    },
  ],
   'Sugar Addiction': [
    {
      title: 'Sugar Addiction: Is It Real?',
      url: 'https://www.webmd.com/diet/ss/slideshow-sugar-addiction',
      sideEffects: 'Weight gain, diabetes, energy crashes, mood swings',
      remedies: 'Limit processed foods, choose natural sweeteners, increase protein and fiber intake',
    },
  ],
  'Social Media Addiction': [
    {
      title: 'Social Media Addiction',
      url: 'https://www.therecoveryvillage.com/behavioral-health/social-media-addiction/',
      sideEffects: 'Anxiety, depression, low self-esteem, body image issues',
      remedies: 'Limit screen time, unfollow accounts that trigger negative emotions, focus on real-life connections',
    },
  ],
  'Internet Addiction': [
    {
      title: 'Internet Addiction',
      url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3480687/',
      sideEffects: 'Social isolation, eye strain, headaches, sleep disturbances',
      remedies: 'Set time limits, take breaks, find alternative activities, seek therapy',
    },
  ],
  'Gaming Addiction': [
    {
      title: 'Gaming Disorder',
      url: 'https://www.who.int/news-room/questions-and-answers/item/gaming-disorder',
      sideEffects: 'Social isolation, eye strain, headaches, sleep disturbances',
      remedies: 'Set time limits, take breaks, find alternative activities, seek therapy',
    },
  ],
  'Shopping Addiction': [
    {
      title: 'Compulsive Buying Disorder',
      url: 'https://www.psychologytoday.com/us/conditions/compulsive-buying-disorder',
      sideEffects: 'Financial problems, debt, anxiety, depression',
      remedies: 'Create a budget, avoid triggers, seek therapy, join a support group',
    },
  ],
  'Gambling Addiction': [
    {
      title: 'Problem Gambling',
      url: 'https://www.helpguide.org/articles/addictions/problem-gambling.htm',
      sideEffects: 'Financial problems, debt, anxiety, depression',
      remedies: 'Create a budget, avoid triggers, seek therapy, join a support group',
    },
  ],
  'Work Addiction (Workaholism)': [
    {
      title: 'Workaholism: What You Need to Know',
      url: 'https://www.webmd.com/mental-health/what-is-workaholism',
      sideEffects: 'Stress, burnout, health problems, relationship problems',
      remedies: 'Set boundaries, take breaks, practice self-care, seek therapy',
    },
  ],
  'Pornography Addiction': [
    {
      title: 'Pornography Addiction: Symptoms, Risks and Treatment',
      url: 'https://www.healthline.com/health/porn-addiction',
      sideEffects: 'Sexual dysfunction, relationship problems, anxiety, depression',
      remedies: 'Cognitive-behavioral therapy, support groups, self-help books',
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
  duration: string; // Base duration display
  cost: number;     // Base cost
  description: string;
}

interface RegistrationReceipt {
  registrationId: string;
  programName: string;
  counsellor: string;
  amountPaid: number;
  registrationDate: string;
  addictionType: string;
  selectedDuration: string;
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


const addictionTypes = Object.keys(articles);
const REGISTRATIONS_STORAGE_KEY = 'addictionProgramRegistrations';

const AddictionManagerPage = () => {
  const [addictionType, setAddictionType] = useState('');
  const [counsellorList, setCounsellorList] = useState<{name: string; contact: string}[]>([]);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationReceipt[]>([]);
  const [latestReceipt, setLatestReceipt] = useState<RegistrationReceipt | null>(null);
  const {toast} = useToast();
  const [selectedArticle, setSelectedArticle] = useState(articles[addictionType as keyof typeof articles]?.[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [programForPayment, setProgramForPayment] = useState<Program | null>(null);
  const [selectedProgramDuration, setSelectedProgramDuration] = useState<string>(programDurations[0]);


  useEffect(() => {
    const storedRegistrations = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (storedRegistrations) {
      setRegistrations(JSON.parse(storedRegistrations));
    }
  }, []);

  const handleSupportRequest = async () => {
    if (!addictionType) {
      toast({
        title: 'Error',
        description: 'Please select an addiction type to see available counsellors and programs.',
        variant: 'destructive',
      });
      return;
    }

    const availableCounsellors = counsellors[addictionType as keyof typeof counsellors] || [];
    setCounsellorList(availableCounsellors);

    const availablePrograms = programsData[addictionType as keyof typeof programsData] || [];
    setProgramList(availablePrograms);
    setLatestReceipt(null); 

    toast({
      title: 'Support Information Updated',
      description: 'List of available counsellors and programs has been updated.',
    });
  };

  const openPaymentDialog = (program: Program) => {
    setProgramForPayment(program);
    setSelectedProgramDuration(programDurations[0]); // Default to first duration option
    setIsPaymentDialogOpen(true);
  };

  const handleProgramRegistration = () => {
    if (!programForPayment) return;

    const registrationId = `REG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const receiptData: RegistrationReceipt = {
      registrationId,
      programName: programForPayment.name,
      counsellor: programForPayment.counsellor,
      amountPaid: programForPayment.cost, // Using base cost for simulation
      registrationDate: new Date().toLocaleDateString(),
      addictionType: addictionType,
      selectedDuration: selectedProgramDuration,
    };

    const newRegistrations = [...registrations, receiptData];
    setRegistrations(newRegistrations);
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(newRegistrations));
    setLatestReceipt(receiptData);

    toast({
      title: 'Registration Successful!',
      description: `You've successfully registered for "${programForPayment.name}" for ${selectedProgramDuration}. Cost: $${programForPayment.cost}.`,
    });
    setIsPaymentDialogOpen(false);
    setProgramForPayment(null);
  };

  useEffect(() => {
    setCounsellorList([]);
    setProgramList([]);
    setSelectedArticle(articles[addictionType as keyof typeof articles]?.[0] || null);
    setLatestReceipt(null);
  }, [addictionType]);

  useEffect(() => {
    const foundAddiction = addictionTypes.find(type =>
      type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundAddiction) {
      setAddictionType(foundAddiction);
    } else if (searchTerm === "") { 
      setAddictionType('');
    }
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto shadow-xl rounded-lg">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-primary">Addiction Management Hub</CardTitle>
          <CardDescription className="text-muted-foreground">
            Find resources, counsellors, and programs to support your journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">

          <div className="grid gap-2">
            <label htmlFor="search-addiction" className="font-semibold text-sm">Search Your Concern</label>
            <Input
              type="text"
              id="search-addiction"
              placeholder="e.g., Alcohol, Gaming, Shopping"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="shadow-sm"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="addiction-type" className="font-semibold text-sm">Or Select Type of Addiction</label>
            <Select onValueChange={setAddictionType} value={addictionType}>
              <SelectTrigger className="w-full sm:w-[300px] shadow-sm">
                <SelectValue placeholder="Select an addiction type" />
              </SelectTrigger>
              <SelectContent>
                {addictionTypes.map(type => (
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
                <div>
                  <label htmlFor="side-effects" className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Side Effects</label>
                  <Textarea
                    id="side-effects"
                    value={selectedArticle.sideEffects}
                    readOnly
                    className="mt-1 bg-background/50"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="remedies" className="font-medium text-xs text-muted-foreground uppercase tracking-wider">Remedies</label>
                  <Textarea
                    id="remedies"
                    value={selectedArticle.remedies}
                    readOnly
                    className="mt-1 bg-background/50"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleSupportRequest} disabled={!addictionType} className="w-full sm:w-auto shadow-md">
            Seek Support & View Programs
          </Button>

          {counsellorList.length > 0 && (
            <Card className="mt-4 shadow-md rounded-md">
              <CardHeader className="bg-muted/20">
                <CardTitle className="text-xl">Available Counsellors for {addictionType}</CardTitle>
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
                <CardTitle className="text-xl">Available Programs for {addictionType}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid gap-4 md:grid-cols-2">
                {programList.map((program) => (
                  <Card key={program.id} className="flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-accent">{program.name}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Led by: {program.counsellor} | Base Duration: {program.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{program.description}</p>
                    </CardContent>
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
              <CardHeader className="bg-primary/10">
                <CardTitle className="text-xl text-primary">Latest Program Registration Receipt</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-sm">
                <p><strong>Registration ID:</strong> {latestReceipt.registrationId}</p>
                <p><strong>Program:</strong> {latestReceipt.programName}</p>
                <p><strong>Counsellor:</strong> {latestReceipt.counsellor}</p>
                <p><strong>Selected Duration:</strong> {latestReceipt.selectedDuration}</p>
                <p><strong>Amount Paid:</strong> ${latestReceipt.amountPaid}</p>
                <p><strong>Date:</strong> {latestReceipt.registrationDate}</p>
                <p><strong>For Addiction:</strong> {latestReceipt.addictionType}</p>
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
                        <p><strong>For Addiction:</strong> {receipt.addictionType}</p>
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
              <AccordionTrigger className="text-xl font-semibold">Helpful Articles & Resources</AccordionTrigger>
              <AccordionContent className="pt-4">
                {addictionType && articles[addictionType as keyof typeof articles] ? (
                  <ul className="space-y-3">
                    {articles[addictionType as keyof typeof articles].map((article, index) => (
                      <li key={index} className="p-3 border rounded-md bg-background/30 hover:shadow-sm transition-shadow">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {article.title}
                        </a>
                         <p className="text-xs text-muted-foreground mt-1">
                            Side Effects: {article.sideEffects.substring(0,100)}{article.sideEffects.length > 100 ? '...' : ''}
                        </p>
                         <p className="text-xs text-muted-foreground mt-1">
                            Remedies: {article.remedies.substring(0,100)}{article.remedies.length > 100 ? '...' : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    {addictionType
                      ? 'No articles found for this addiction.'
                      : 'Select an addiction type to find helpful articles.'}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {programForPayment && (
        <Dialog open={isPaymentDialogOpen} onOpenChange={(isOpen) => {
            setIsPaymentDialogOpen(isOpen);
            if (!isOpen) setProgramForPayment(null);
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register for: {programForPayment.name}</DialogTitle>
              <DialogDescription>
                Led by: {programForPayment.counsellor}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Program Description</Label>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border">
                    {programForPayment.description}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="program-duration">Select Duration</Label>
                <Select value={selectedProgramDuration} onValueChange={setSelectedProgramDuration}>
                    <SelectTrigger id="program-duration" className="w-full">
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        {programDurations.map(duration => (
                            <SelectItem key={duration} value={duration}>
                                {duration}
                            </SelectItem>
                        ))}
                    </SelectContent>
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

export default AddictionManagerPage;
