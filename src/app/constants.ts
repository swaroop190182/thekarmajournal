
import type { KarmaActivity, Badge, MoodOption as AppMoodOption } from "./types";
import {
    Gift, HandHeart, Handshake, Coins, Users, ThumbsUp, Recycle, Sprout, Brain, Sparkles, Store, Smile, Ear, Dumbbell, Send,
    LightbulbOff, BookOpen, Soup, Mail, Trash2, Megaphone, Hourglass, GraduationCap, Heart, HelpingHand, MessagesSquare,
    EyeOff, Frown, ClipboardX, Scale, ShieldOff, UserMinus, HeartCrack, Fuel, Ban, UserX, FileLock, Sword, ShieldAlert, Car, Eye,
    Cookie, TimerOff, Bed, VolumeX, ShowerHead, ThumbsDown, Wine, Pipette, Cigarette, Coffee, Pizza, Candy, Smartphone, Share2,
    Globe, Gamepad2, ShoppingBag, Dice5, Briefcase, HeartPulse, Tv, ScreenShareOff, VenetianMask, Zap, UsersRound, Bandage,
    Scissors, Castle, MousePointer2, Church, Activity, CircleDot, Drama, Palette, Music2, Utensils, Bus, Trees, SunMedium, Leaf, Lightbulb, Award, Target, BookText, Flame,
    NotebookText, Medal, BrainCog, Star as StarIcon, Wind,
    Laugh, // Added for moodOptions
    Meh,   // Added for moodOptions
    Angry  // Added for moodOptions
} from 'lucide-react';

export const ActivityList: KarmaActivity[] = [
    // Wellbeing & Mindfulness
    { name: "Daily Journaling", shortName: "Journaling", type: "Wellbeing & Mindfulness", points: 5, icon: BookText, keywords: ["journal", "journaling", "wrote diary", "diary entry", "daily entry", "reflection written", "wrote reflection"], chemicalRelease: 'serotonin' },
    { name: "Enjoy Sunlight", shortName: "Sunlight", type: "Wellbeing & Mindfulness", points: 4, icon: SunMedium, keywords: ["sunlight", "sunshine", "sunbathe", "vitamin d", "enjoyed the sun", "sat in sun"], chemicalRelease: 'serotonin' },
    { name: "Listen to Music", shortName: "Music", type: "Wellbeing & Mindfulness", points: 3, icon: Music2, keywords: ["music", "listened to music", "song", "songs", "album", "playlist"], chemicalRelease: 'dopamine' },
    { name: "Practice Gratitude", shortName: "Gratitude", type: "Wellbeing & Mindfulness", points: 8, icon: Gift, keywords: ["grateful", "gratitude", "thankful", "appreciation", "appreciate", "blessed", "counted blessings"], chemicalRelease: 'serotonin' },
    { name: "Practice Mindfulness", shortName: "Mindfulness", type: "Wellbeing & Mindfulness", points: 7, icon: Brain, keywords: ["mindful", "mindfulness", "meditate", "meditated", "meditation", "present moment", "awareness", "mindful moment", "conscious breathing"], chemicalRelease: 'serotonin' },
    { name: "Relaxation", shortName: "Relax", type: "Wellbeing & Mindfulness", points: 5, icon: Palette, keywords: ["relax", "relaxed", "relaxation", "chill", "unwind", "calm down", "rested", "took a break"], chemicalRelease: 'serotonin' },

    // Health
    { name: "Exercise", type: "Health", points: 7, icon: Dumbbell, keywords: ["exercise", "exercised", "workout", "gym", "run", "ran", "jog", "jogged", "swim", "swam", "yoga", "fitness", "physical activity", "sport", "walked", "hiked"], chemicalRelease: 'endorphins' },
    { name: "Healthy Meal", shortName: "Healthy Meal", type: "Health", points: 6, icon: Leaf, keywords: ["healthy meal", "ate healthy", "nutritious food", "salad", "vegetables", "fruit", "balanced diet", "good food choices"], chemicalRelease: 'dopamine' }, 
    { name: "Neglecting Self-Care", shortName: "Neglect Self-Care", type: "Health", points: -8, icon: ShowerHead, keywords: ["neglect self-care", "no self-care", "ignored well-being", "burnout", "didn't rest", "skipped hygiene"], chemicalRelease: 'none' },
    { name: "Outdoor Activity", shortName: "Outdoor Act", type: "Health", points: 7, icon: Trees, keywords: ["outdoor", "outdoors", "outside", "nature walk", "hike", "park visit", "fresh air", "spent time in nature"], chemicalRelease: 'endorphins' }, 

    // Personal Growth
    { name: "Achieved a Daily Goal", shortName: "Goal Achieved", type: "Personal Growth", points: 10, icon: Award, keywords: ["goal achieved", "achieved goal", "completed goal", "reached target", "finished task", "milestone met", "accomplished task"], chemicalRelease: 'dopamine' },
    { name: "Creative Hobby", shortName: "Creative Hobby", type: "Personal Growth", points: 6, icon: Palette, keywords: ["creative", "hobby", "art", "craft", "drew", "painted", "wrote creatively", "played instrument", "sang", "danced", "sculpted"], chemicalRelease: 'dopamine' },
    { name: "Educate Yourself", shortName: "Educate Self", type: "Personal Growth", points: 8, icon: BookOpen, keywords: ["learn", "learned", "learning", "study", "studied", "studying", "research", "educate", "course", "read book", "documentary", "skill development"], chemicalRelease: 'dopamine' },
    { name: "Self-Improvement Initiative", shortName: "Self-Improvement", type: "Personal Growth", points: 5, icon: Lightbulb, keywords: ["self-improvement", "personal growth", "new habit", "started program", "joined course", "workshop", "therapy", "counseling", "self-help", "habit building"], chemicalRelease: 'dopamine' },

    // Mindset
    { name: "Being Envious", shortName: "Envious", type: "Mindset", points: -8, icon: Eye, keywords: ["envious", "envy", "jealous", "jealousy", "covet", "resentful of others' success"], chemicalRelease: 'none' },
    { name: "Engaging in Negative Self-Talk", shortName: "Neg Self-Talk", type: "Mindset", points: -5, icon: VolumeX, keywords: ["negative self-talk", "self-criticism", "put myself down", "self-deprecating", "i'm not good enough", "inner critic"], chemicalRelease: 'none' },
    { name: "Practice Patience", shortName: "Patience", type: "Mindset", points: 7, icon: Hourglass, keywords: ["patient", "patience", "waited calmly", "tolerant", "showed restraint", "didn't rush"], chemicalRelease: 'serotonin' },
    { name: "Smile", type: "Mindset", points: 7, icon: Smile, keywords: ["smile", "smiled", "smiling", "grin", "grinned", "cheerful expression"], chemicalRelease: 'endorphins' },

    // Social Acts of Kindness
    { name: "Compliment Someone", shortName: "Compliment", type: "Social Acts of Kindness", points: 7, icon: ThumbsUp, keywords: ["compliment", "complimented", "praise", "praised", "admire", "admired", "flatter", "flattered", "said something nice"], chemicalRelease: 'oxytocin' }, 
    { name: "Cook a Meal for Someone", shortName: "Cook for Someone", type: "Social Acts of Kindness", points: 9, icon: Soup, keywords: ["cook for", "cooked for", "meal for", "prepare food for", "made dinner for"], chemicalRelease: 'oxytocin' }, 
    { name: "General Good Deed", shortName: "Good Deed", type: "Social Acts of Kindness", points: 5, icon: CircleDot, keywords: ["good deed", "act of goodness", "did something nice", "helpful act", "kind action"], chemicalRelease: 'serotonin' },
    { name: "Help Someone", shortName: "Help", type: "Social Acts of Kindness", points: 9, icon: Handshake, keywords: ["help", "helped", "helping", "assist", "assisted", "assisting", "support", "supported", "supporting", "aid", "aided", "aiding", "lend a hand", "offered help"], chemicalRelease: 'serotonin' }, 
    { name: "Offer Encouragement", shortName: "Encourage", type: "Social Acts of Kindness", points: 8, icon: Megaphone, keywords: ["encourage", "encouraged", "motivate", "motivated", "support words", "uplift", "cheered someone on"], chemicalRelease: 'oxytocin' },
    { name: "Random Act of Kindness", shortName: "Kind Act", type: "Social Acts of Kindness", points: 9, icon: Sparkles, keywords: ["kindness", "kind act", "generous", "thoughtful gesture", "spontaneous help", "unexpected kindness"], chemicalRelease: 'serotonin' },
    { name: "Spread Positivity Online", shortName: "Positive Online", type: "Social Acts of Kindness", points: 8, icon: Send, keywords: ["positive online", "share good news online", "uplifting post", "encouraging message online", "kind comment"], chemicalRelease: 'serotonin' },
    { name: "Write a Thank You Note", shortName: "Thank You Note", type: "Social Acts of Kindness", points: 8, icon: Mail, requiresPhoto: true, keywords: ["thank you note", "wrote thank you", "gratitude letter", "sent thanks"], chemicalRelease: 'oxytocin' },

    // Social & Relationships
    { name: "Eat out", shortName: "Eat Out", type: "Social & Relationships", points: 3, icon: Utensils, keywords: ["eat out", "ate out", "restaurant", "dined out", "cafe visit", "went for food"], chemicalRelease: 'dopamine' },
    { name: "Spend Quality Time with Loved Ones", shortName: "Quality Time", type: "Social & Relationships", points: 9, icon: Heart, keywords: ["quality time", "family time", "friends time", "connect with loved ones", "meaningful interaction", "bonded with"], chemicalRelease: 'oxytocin' },

    // Community & Giving
    { name: "Committed to Volunteer", shortName: "Commit Volunteer", type: "Community & Giving", points: 3, icon: Handshake, keywords: ["commit to volunteer", "pledged to volunteer", "signed up to volunteer", "will volunteer", "registered to help"], chemicalRelease: 'dopamine' },
    { name: "Donate", type: "Community & Giving", points: 15, icon: Coins, keywords: ["donate", "donated", "donating", "charity", "contribution", "give", "gave", "giving money", "philanthropy", "fundraising"], requiresPhoto: true, chemicalRelease: 'serotonin' },
    { name: "Support Local Businesses", shortName: "Support Local", type: "Community & Giving", points: 6, icon: Store, keywords: ["local business", "shop local", "small business", "buy local", "support local economy"], requiresPhoto: true, chemicalRelease: 'dopamine' },
    { name: "Teach or Mentor", shortName: "Teach/Mentor", type: "Community & Giving", points: 8, icon: GraduationCap, keywords: ["teach", "taught", "mentor", "mentored", "guide", "guided", "instruct", "share knowledge", "tutored"], chemicalRelease: 'dopamine' }, 
    { name: "Volunteer", type: "Community & Giving", points: 20, icon: Users, keywords: ["volunteer", "volunteered", "volunteering", "serve", "served", "serving community", "community service", "pro bono work", "helped at event"], requiresPhoto: true, chemicalRelease: 'serotonin' }, 

    // Environmental Actions
    { name: "Clean Up", shortName: "Clean Up", type: "Environmental Actions", points: 8, icon: Trash2, keywords: ["clean", "cleaned up", "tidy up", "tidied", "organize area", "declutter space", "picked up litter"], chemicalRelease: 'dopamine' },
    { name: "Conserve Energy", shortName: "Conserve Energy", type: "Environmental Actions", points: 7, icon: LightbulbOff, keywords: ["conserve energy", "save electricity", "reduce power consumption", "energy efficient", "turned off lights"], chemicalRelease: 'none' },
    { name: "Plant a Tree", shortName: "Plant Tree", type: "Environmental Actions", points: 10, icon: Sprout, keywords: ["plant tree", "planted tree", "gardening", "afforestation", "reforestation", "tree planting"], requiresPhoto: true, chemicalRelease: 'serotonin' },
    { name: "Recycle", type: "Environmental Actions", points: 8, icon: Recycle, keywords: ["recycle", "recycled", "recycling", "reuse items", "repurposed materials", "sorted waste"], chemicalRelease: 'none' },

    // Behaviour
    { name: "Be Polite", shortName: "Polite", type: "Behaviour", points: 6, icon: Smile, keywords: ["polite", "politely", "courteous", "respectful", "mannerly", "good manners", "said please", "said thank you"], chemicalRelease: 'serotonin' },
    { name: "Being Intolerant", shortName: "Intolerant", type: "Behaviour", points: -8, icon: UserX, keywords: ["intolerant", "prejudiced", "biased", "close-minded", "judgmental", "discriminatory"], chemicalRelease: 'none' },
    { name: "Being Manipulative", shortName: "Manipulative", type: "Behaviour", points: -7, icon: Drama, keywords: ["manipulate", "manipulated", "manipulative", "deceitful tactics", "exploit", "control others unfairly"], chemicalRelease: 'none' },
    { name: "Being Rude", shortName: "Rude", type: "Behaviour", points: -7, icon: Frown, keywords: ["rude", "impolite", "disrespectful behavior", "offensive remark", "insulting", "curt", "abrupt"], chemicalRelease: 'none' },
    { name: "Being Selfish", shortName: "Selfish", type: "Behaviour", points: -8, icon: UserMinus, keywords: ["selfish", "inconsiderate of others", "self-centered", "egotistical", "thought only of myself"], chemicalRelease: 'none' },
    { name: "Disrespecting Boundaries", shortName: "Cross Boundaries", type: "Behaviour", points: -5, icon: Ban, keywords: ["disrespect boundaries", "overstep limits", "invade privacy", "ignore personal space", "crossed a line"], chemicalRelease: 'none' },
    { name: "General Bad Deed", shortName: "Bad Deed", type: "Behaviour", points: -5, icon: CircleDot, keywords: ["bad deed", "misdeed", "did something wrong", "acted poorly", "negative action"], chemicalRelease: 'none' },
    { name: "Gossiping", type: "Behaviour", points: -6, icon: MessagesSquare, keywords: ["gossip", "gossiped", "rumor mongering", "talk behind back", "spread rumors", "slander"], chemicalRelease: 'none' },
    { name: "Hurting Someone", shortName: "Hurt Someone", type: "Behaviour", points: -8, icon: HeartCrack, keywords: ["hurt someone", "harmed someone", "upset someone", "mean to", "caused pain emotionally", "made someone cry"], chemicalRelease: 'none' },
    { name: "Ignoring Someone in Need", shortName: "Ignoring", type: "Behaviour", points: -7, icon: ShieldAlert, keywords: ["ignore need", "ignored someone in need", "neglected person asking for help", "turn blind eye to suffering"], chemicalRelease: 'none' },
    { name: "Listen Actively", shortName: "Listen", type: "Behaviour", points: 8, icon: Ear, keywords: ["listen", "listened attentively", "active listening", "heard someone out", "paid attention when spoken to", "truly listened"], chemicalRelease: 'oxytocin' },
    { name: "Lying", type: "Behaviour", points: -8, icon: EyeOff, keywords: ["lie", "lied", "dishonest statement", "untruthful", "deceive", "told a falsehood"], chemicalRelease: 'none' },
    { name: "Show Empathy", shortName: "Empathy", type: "Behaviour", points: 8, icon: HelpingHand, keywords: ["empathy", "empathize", "empathized", "empathetic", "compassion", "understanding others' feelings", "feel for someone", "showed compassion"], chemicalRelease: 'oxytocin' },
    { name: "Showing Ingratitude", shortName: "Ingratitude", type: "Behaviour", points: -7, icon: HandHeart, keywords: ["ungrateful", "ingratitude", "not thankful", "didn't appreciate", "took for granted"], chemicalRelease: 'none' },
    { name: "Spreading Negativity Online", shortName: "Negativity Online", type: "Behaviour", points: -7, icon: ThumbsDown, keywords: ["negative online", "cyberbully", "troll post", "hate comment", "spread negativity on social media"], chemicalRelease: 'none' },

    // Personal Responsibility
    { name: "Being Lazy", shortName: "Lazy", type: "Personal Responsibility", points: -5, icon: Bed, keywords: ["lazy", "slothful", "idle", "inactive", "unproductive", "avoided work"], chemicalRelease: 'none' },
    { name: "Commute", type: "Personal Responsibility", points: 1, icon: Bus, keywords: ["commute", "commuted", "travel to work", "drive to work", "bus ride", "train ride", "went to office"], chemicalRelease: 'none' },
    { name: "Driving Recklessly", shortName: "Reckless Driving", type: "Personal Responsibility", points: -6, icon: Car, keywords: ["reckless driving", "speeding", "unsafe driving", "ran red light", "traffic violation", "drove dangerously"], chemicalRelease: 'none' },
    { name: "Neglecting Responsibilities", shortName: "Neglect Duties", type: "Personal Responsibility", points: -7, icon: ClipboardX, keywords: ["neglect responsibilities", "neglected duties", "irresponsible action", "avoid duties", "shirk responsibility", "didn't do chores"], chemicalRelease: 'none' },
    { name: "Overindulgence", type: "Personal Responsibility", points: -8, icon: Cookie, keywords: ["overindulge", "overindulged", "excess consumption", "binged", "too much of something", "lack of moderation"], chemicalRelease: 'none' },
    { name: "Procrastinating", shortName: "Procrastinate", type: "Personal Responsibility", points: -6, icon: TimerOff, keywords: ["procrastinate", "procrastinated", "delay tasks", "put off work", "postpone duties", "avoided tasks"], chemicalRelease: 'none' },

    // Ethical Violations
    { name: "Breaking Promises", shortName: "Break Promises", type: "Ethical Violations", points: -10, icon: FileLock, keywords: ["break promise", "broke promise", "unreliable promise", "renege on deal", "didn't keep word"], chemicalRelease: 'none' },
    { name: "Cheating", type: "Ethical Violations", points: -9, icon: Scale, keywords: ["cheat", "cheated", "dishonest act in game or test", "fraudulent action", "deceived in rules"], chemicalRelease: 'none' },
    { name: "Engaging in Violence", shortName: "Violence", type: "Ethical Violations", points: -7, icon: Sword, keywords: ["violence", "violent act", "fight", "fought", "aggression", "physical altercation", "assault"], chemicalRelease: 'none' },
    { name: "Stealing", type: "Ethical Violations", points: -10, icon: ShieldOff, keywords: ["steal", "stole", "theft", "shoplift", "took without permission", "pilfer"], chemicalRelease: 'none' },

    // Negative Environmental Impact
    { name: "Littering", type: "Negative Environmental Impact", points: -6, icon: Trash2, keywords: ["litter", "littered", "threw trash on ground", "drop garbage improperly", "polluted"], chemicalRelease: 'none' },
    { name: "Wasting Resources", shortName: "Waste Resources", type: "Negative Environmental Impact", points: -6, icon: Fuel, keywords: ["waste resources", "wasted food", "wasted water", "overconsume resources", "left tap running", "wasted electricity"], chemicalRelease: 'none' },

    // Habit / Addiction
    { name: "Alcohol Addiction", shortName: "Alcohol", type: "Habit / Addiction", points: -9, icon: Wine, keywords: ["alcohol", "drink alcohol", "drank alcohol", "beer", "wine", "liquor", "booze", "got drunk", "alcoholic beverage"], quantificationUnit: "ML", commonTriggers: ['Stress', 'Social gatherings', 'Boredom', 'Negative emotions (sadness, anxiety)', 'Celebrations', 'Specific people or places', 'Withdrawal symptoms', 'Peer pressure', 'Advertisements'], chemicalRelease: 'none' },
    { name: "Caffeine Addiction", shortName: "Caffeine", type: "Habit / Addiction", points: -4, icon: Coffee, keywords: ["caffeine", "coffee", "tea", "energy drink", "soda with caffeine"], quantificationUnit: "Times", commonTriggers: ['Morning routine', 'Fatigue / Tiredness', 'Work deadlines / Study pressure', 'Social coffee breaks', 'Headaches (withdrawal)', 'Habit / Ritual', 'Boredom'], chemicalRelease: 'none' },
    { name: "Shopping Addiction", shortName: "Shopping", type: "Habit / Addiction", points: -8, icon: ShoppingBag, keywords: ["compulsive shopping", "shop excessively", "shopping spree", "bought too much", "spend impulsively", "retail therapy overload"], quantificationUnit: "Currency", commonTriggers: ['Sales and promotions', 'Emotional distress (feeling down, stressed, anxious)', 'Boredom / Loneliness', 'Social media influence / Ads', 'Seeking a "high" from purchasing', 'Payday / Unexpected money', 'Desire for new items'], chemicalRelease: 'none' },
    { name: "Drug Addiction", shortName: "Drugs", type: "Habit / Addiction", points: -10, icon: Pipette, keywords: ["drugs", "drug use", "substance abuse", "got high", "used illicit drugs", "recreational drugs"], quantificationUnit: "Grams", commonTriggers: ['Stress / Anxiety / Depression', 'Peer pressure', 'Environmental cues (places, paraphernalia)', 'Mental health issues', 'Physical pain (for opioids)', 'Boredom / Loneliness', 'Trauma reminders', 'Escapism'], chemicalRelease: 'none' },
    { name: "Sugar Addiction", shortName: "Sugar", type: "Habit / Addiction", points: -5, icon: Candy, keywords: ["sugar", "sweets", "candy", "sugary soda", "dessert overload", "too much sugar"], quantificationUnit: "Times", commonTriggers: ['Stress / Emotional eating', 'Cravings', 'Availability of sugary foods', 'Habit (e.g., dessert after meals)', 'Fatigue (seeking quick energy)', 'Social events / Celebrations', 'Advertisements'], chemicalRelease: 'none' },
    { name: "Gaming Addiction", shortName: "Gaming", type: "Habit / Addiction", points: -6, icon: Gamepad2, keywords: ["gaming", "excessive gaming", "video games too much", "online games excessively", "played games too long"], quantificationUnit: "Minutes", commonTriggers: ['Boredom / Lack of alternative activities', 'Stress relief / Escapism', 'Social connection within games', 'Achievements/rewards in games', 'Fear Of Missing Out (FOMO)', 'Procrastination', 'Loneliness'], chemicalRelease: 'none' },
    { name: "Gambling Addiction", shortName: "Gambling", type: "Habit / Addiction", points: -9, icon: Dice5, keywords: ["gamble", "gambled", "bet", "betting", "casino visit", "lottery tickets", "sports betting"], quantificationUnit: "Currency", commonTriggers: ['Financial stress (chasing losses)', 'Excitement / Thrill / "Rush"', 'Boredom / Loneliness', 'Social influence / Peer pressure', 'Accessibility (online gambling)', 'Belief in luck or systems', 'Escapism / Avoiding problems', 'Alcohol or drug use'], chemicalRelease: 'none' },
    { name: "Internet Addiction", shortName: "Internet", type: "Habit / Addiction", points: -6, icon: Globe, keywords: ["internet overuse", "online too much", "web surfing excessively", "browsing addiction", "endless scrolling"], quantificationUnit: "Minutes", commonTriggers: ['Boredom / Lack of real-world activities', 'Loneliness / Seeking connection', 'Stress / Anxiety (using internet to cope)', 'Procrastination / Avoiding tasks', 'Habit / Mindless scrolling', 'Fear Of Missing Out (FOMO)', 'Easy accessibility'], chemicalRelease: 'none' },
    { name: "Nicotine Addiction", shortName: "Nicotine", type: "Habit / Addiction", points: -8, icon: Cigarette, keywords: ["nicotine", "smoke cigarette", "smoked cigarette", "vape nicotine", "vaped", "chewing tobacco"], quantificationUnit: "Cigarettes", commonTriggers: ['Stress / Anxiety', 'Social situations (seeing others smoke/vape)', 'Routines (after meals, with coffee, driving)', 'Boredom', 'Emotional distress (sadness, anger)', 'Alcohol consumption', 'Cravings / Withdrawal symptoms'], chemicalRelease: 'none' },
    { name: "Food Addiction", shortName: "Food", type: "Habit / Addiction", points: -6, icon: Pizza, keywords: ["overeat", "overate", "binge eating", "ate too much food", "uncontrolled eating"], quantificationUnit: "Calories", commonTriggers: ['Stress / Emotional distress (sadness, anxiety, anger)', 'Boredom', 'Sight/smell of certain foods', 'Social events / Peer pressure', 'Loneliness', 'Restrictive dieting (leading to binging)', 'Fatigue / Low energy', 'Watching TV / Distracted eating'], chemicalRelease: 'none' },
    { name: "Pornography Addiction", shortName: "Pornography", type: "Habit / Addiction", points: -7, icon: ScreenShareOff, keywords: ["porn", "pornography use", "adult content consumption", "viewed porn"], quantificationUnit: "Minutes", commonTriggers: ['Stress / Anxiety', 'Loneliness / Boredom', 'Relationship dissatisfaction / Lack of intimacy', 'Easy accessibility online', 'Habit / Routine', 'Escapism / Avoiding emotions', 'Curiosity / Fantasy seeking'], chemicalRelease: 'none' },
    { name: "Social Media Addiction", shortName: "Social Media", type: "Habit / Addiction", points: -6, icon: Share2, keywords: ["social media overuse", "facebook too much", "instagram scrolling", "tiktok addiction", "twitter obsession", "too much screen time on social"], quantificationUnit: "Minutes", commonTriggers: ['Fear Of Missing Out (FOMO)', 'Boredom / Loneliness', 'Notifications / Alerts', 'Seeking validation (likes, comments, shares)', 'Habit / Compulsive checking', 'Procrastination', 'Social pressure to stay updated', 'Escapism'], chemicalRelease: 'none' },
    { name: "Work Addiction (Workaholism)", shortName: "Workaholism", type: "Habit / Addiction", points: -7, icon: Briefcase, keywords: ["workaholic", "overwork", "worked too much hours", "neglected life for work"], quantificationUnit: "Hours", commonTriggers: ['Fear of failure / Insecurity', 'Desire for approval/validation', 'Feeling indispensable / Difficulty delegating', 'Company culture / Pressure to overwork', 'Avoiding personal problems / Using work as escape', 'Perfectionism', 'Difficulty saying "no"'], chemicalRelease: 'none' },
];

export const affirmationsList: string[] = [
  "I am stronger than my cravings.", "I choose peace over temporary relief.", "My mind is clear and focused.",
  "I am resilient and can overcome any challenge.", "Each day, I am healing and growing.", "I am worthy of love and happiness.",
  "I forgive myself for past mistakes.", "I am in control of my actions and choices.", "I create positive habits that support my well-being.",
  "I am grateful for my journey of recovery.", "My body is strong and capable.", "I embrace a healthy lifestyle.",
  "I am building a future filled with joy and purpose.", "I trust the process of my growth.", "I am surrounded by support and love.",
  "I choose thoughts that empower me.", "I am a source of positivity and light.", "My potential is limitless.",
  "I celebrate my progress, no matter how small.", "I am deserving of a peaceful mind.", "I release all negativity.",
  "I am committed to my well-being.", "I attract positive energy into my life.", "My inner strength guides me.",
  "I am creating a life I love.", "I am proud of who I am becoming.", "I honor my needs and set healthy boundaries.",
  "I let go of what no longer serves me.", "I am filled with hope and optimism.", "My future is bright and full of possibilities.",
  "I am capable of making positive changes.", "I choose health and vitality.", "I am at peace with myself and the world.",
  "I am dedicated to my personal growth.", "I value myself and my journey.", "I treat myself with kindness and compassion.",
  "I am open to receiving all good things.", "Every day is a new opportunity for growth.", "I am becoming the best version of myself.",
  "I focus on solutions, not problems.", "I trust my intuition to guide me.", "I am creating a balanced and fulfilling life.",
  "I have the power to change my life.", "I am worthy of all the good life has to offer.", "I am grateful for the lessons I learn.",
  "I choose to be happy and content.", "My spirit is strong and unwavering.", "I am a beacon of hope and inspiration.",
  "I live in the present moment with joy.", "I am creating a beautiful story for my life."
];

export const chemicalLegend: { name: string; chemical: NonNullable<KarmaActivity['chemicalRelease']>; colorClass: string; description: string }[] = [
    { name: "Endorphins", chemical: "endorphins", colorClass: "bg-orange-500", description: "Pain relief, pleasure, well-being (e.g., exercise, laughter)." },
    { name: "Serotonin", chemical: "serotonin", colorClass: "bg-green-500", description: "Mood, sleep, appetite, confidence (e.g., sunlight, mindfulness, helping others)." },
    { name: "Dopamine", chemical: "dopamine", colorClass: "bg-purple-500", description: "Reward, motivation, pleasure (e.g., achieving goals, learning)." },
    { name: "Oxytocin", chemical: "oxytocin", colorClass: "bg-pink-500", description: "Bonding, trust, love (e.g., social connection, physical touch)." },
];

export const moodOptions: AppMoodOption[] = [
  { id: 'rad', label: 'Rad', icon: Laugh, color: 'text-lime-500 dark:text-lime-400', bgColor: 'bg-lime-100 dark:bg-lime-900' },
  { id: 'good', label: 'Good', icon: Smile, color: 'text-green-500 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900' },
  { id: 'meh', label: 'Meh', icon: Meh, color: 'text-yellow-500 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'bad', label: 'Bad', icon: Frown, color: 'text-orange-500 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900' },
  { id: 'awful', label: 'Awful', icon: Angry, color: 'text-red-500 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900' },
];

export const badgeDefinitions: Badge[] = [
  { id: 'first-reflection', name: 'First Step', description: 'Logged your very first reflection. Welcome to the journey!', icon: NotebookText, criteriaType: 'reflections', criteriaCount: 1 },
  { id: 'three-reflections', name: 'Budding Journaler', description: 'Completed 3 reflection entries. Keep those thoughts flowing!', icon: Award, criteriaType: 'reflections', criteriaCount: 3 },
  { id: 'seven-reflections', name: 'Weekly Wordsmith', description: 'Consistently reflected for 7 entries. You\'re building a habit!', icon: Medal, criteriaType: 'reflections', criteriaCount: 7 },
  { id: 'thirty-reflections', name: 'Monthly Maven', description: 'Dedicated a month to reflections (30 entries). Incredible commitment!', icon: BrainCog, criteriaType: 'reflections', criteriaCount: 30 },
  { id: 'consistent-mood-tracker', name: 'Mood Monitor', description: 'Tracked your mood for 5 days in a single week. Great self-awareness!', icon: Activity, criteriaType: 'moodsTrackedWeek', criteriaCount: 5 },
  { id: 'affirmation-explorer', name: 'Affirmation Explorer', description: 'Favorited 3 affirmations. Positive thoughts empower!', icon: StarIcon, criteriaType: 'favoriteAffirmations', criteriaCount: 3 },
  { id: 'seven-day-streak', name: 'Streak Starter', description: 'Achieved a 7-day journaling streak! Consistency is key.', icon: Flame, criteriaType: 'journalStreak', criteriaCount: 7 },
  { id: 'neuro-balance-achiever', name: 'Neuro Balance Achiever', description: 'Achieved a balanced score (70+) across all four happy chemicals in a single day!', icon: BrainCog, criteriaType: 'neuroBalanceDay' },
  { id: 'serotonin-sustainer', name: 'Serotonin Sustainer', description: 'Boosted Serotonin levels on 5 separate days in a week. Well done!', icon: Smile, criteriaType: 'serotoninSustainerWeek' },
];

export const chemicalInfos = {
  dopamine: {
    displayName: 'Dopamine',
    icon: Target,
    description: 'The "Reward Chemical." Plays a role in motivation, pleasure, and learning. Boosted by achieving goals, learning new things, and completing tasks.',
    boostingActivities: ['Achieve a goal', 'Learn something new', 'Exercise', 'Listen to music', 'Eat a healthy meal'],
    reflectionPrompt: 'What small task can you complete today for a sense of accomplishment?',
    textColor: 'text-purple-600 dark:text-purple-400',
    baseBgClass: 'bg-purple-50 dark:bg-purple-900/30',
    borderClass: 'border-purple-300 dark:border-purple-600',
    headerBgClass: 'bg-purple-100 dark:bg-purple-800/50',
    progressColorClass: 'bg-purple-500',
    iconColor: 'text-purple-500',
    lineChartColor: 'hsl(var(--chart-3))',
    focusArea: 'motivation and achievement',
  },
  serotonin: {
    displayName: 'Serotonin',
    icon: Smile,
    description: 'The "Mood Stabilizer." Influences mood, well-being, and happiness. Boosted by sunlight, mindfulness, gratitude, and helping others.',
    boostingActivities: ['Practice gratitude', 'Mindfulness/Meditation', 'Get sunlight exposure', 'Help someone', 'Recall happy memories'],
    reflectionPrompt: 'What are three things you are grateful for right now?',
    textColor: 'text-green-600 dark:text-green-400',
    baseBgClass: 'bg-green-50 dark:bg-green-900/30',
    borderClass: 'border-green-300 dark:border-green-600',
    headerBgClass: 'bg-green-100 dark:bg-green-800/50',
    progressColorClass: 'bg-green-500',
    iconColor: 'text-green-500',
    lineChartColor: 'hsl(var(--chart-2))',
    focusArea: 'well-being and contentment',
  },
  oxytocin: {
    displayName: 'Oxytocin',
    icon: Users,
    description: 'The "Love Hormone." Important for social bonding, trust, and empathy. Boosted by physical affection, social interaction, and acts of kindness.',
    boostingActivities: ['Spend time with loved ones', 'Help someone / Volunteer', 'Give a compliment', 'Pet an animal', 'Listen actively'],
    reflectionPrompt: 'Who can you connect with or show appreciation for today?',
    textColor: 'text-pink-600 dark:text-pink-400',
    baseBgClass: 'bg-pink-50 dark:bg-pink-900/30',
    borderClass: 'border-pink-300 dark:border-pink-600',
    headerBgClass: 'bg-pink-100 dark:bg-pink-800/50',
    progressColorClass: 'bg-pink-500',
    iconColor: 'text-pink-500',
    lineChartColor: 'hsl(var(--chart-4))',
    focusArea: 'social connection and trust',
  },
  endorphins: {
    displayName: 'Endorphins',
    icon: Zap,
    description: 'The "Pain Reliever." Released in response to stress or discomfort, leading to feelings of pleasure and well-being. Boosted by exercise, laughter, and eating dark chocolate.',
    boostingActivities: ['Exercise (running, dancing)', 'Laugh out loud', 'Listen to uplifting music', 'Watch a funny movie', 'Eat spicy food (in moderation)'],
    reflectionPrompt: 'What activity brings you natural joy or a sense of release?',
    textColor: 'text-orange-600 dark:text-orange-400',
    baseBgClass: 'bg-orange-50 dark:bg-orange-900/30',
    borderClass: 'border-orange-300 dark:border-orange-600',
    headerBgClass: 'bg-orange-100 dark:bg-orange-800/50',
    progressColorClass: 'bg-orange-500',
    iconColor: 'text-orange-500',
    lineChartColor: 'hsl(var(--chart-1))',
    focusArea: 'stress reduction and pleasure',
  },
};

    
