
'use client';

import React, {useState, useEffect} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {ActivityList} from '@/app/constants';
import { HeartHandshake, Sparkles, Users as UsersIcon, Coins as CoinsIcon, Newspaper } from 'lucide-react'; 
import type { SelectedKarmaActivity } from '@/app/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from '@/components/ui/scroll-area';

// Data from Donation Page (institutions, inspirationalQuotes) remains the same
const institutions = {
  Education: [
    'Teach for India',
    'Pratham',
    'CRY - Child Rights and You',
  ],
  Orphanage: [
    'SOS Childrens Villages',
    'Bal Sahyog',
    'Udayan Care',
  ],
  Healthcare: [
    'American Indian Foundation',
    'Goonj',
    'Smile Train',
  ],
  'Women Empowerment': [
    'Give India Foundation',
    'Action Aid',
    'Dasra',
  ],
  'Old Age Homes': [
    'HelpAge India',
    'The Earth Saviours Foundation',
    'Aashiana Trust',
  ],
  'Temple Trust': [
    'Tirumala Tirupati Devasthanams',
    'Shri Saibaba Sansthan Trust',
    'Shree Siddhivinayak Temple Trust',
  ],
};

const inspirationalQuotes = [
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "No one has ever become poor by giving.", author: "Anne Frank" },
  { text: "The meaning of life is to find your gift. The purpose of life is to give it away.", author: "Pablo Picasso" },
  { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" }
];

// Data from Volunteer Page (countries, cities, baseVolunteeringCategories, volunteerPlaces, saiBabaQuotes) remains the same
const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'India', 'Japan', 'China', 'Australia', 'Brazil'];
const cities: {[key: string]: string[]} = {
  USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  Canada: ['Toronto', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg', 'Mississauga', 'Vancouver', 'Brampton', 'Hamilton'],
  UK: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Sheffield', 'Liverpool', 'Bristol', 'Coventry', 'Leicester'],
  Germany: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund', 'Essen', 'Leipzig'],
  France: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  India: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
  Japan: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kawasaki', 'Kyoto', 'Saitama', 'Hiroshima'],
  China: ['Shanghai', 'Beijing', 'Chongqing', 'Tianjin', 'Guangzhou', 'Shenzhen', 'Dongguan', 'Wuhan', 'Chengdu', 'Hangzhou'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Geelong'],
  Brazil: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
};

const baseVolunteeringCategories = [
  'Animal Welfare', 'Arts & Culture', 'Children & Youth', 'Community Development',
  'Crisis Support', 'Disaster Relief', 'Education & Literacy', 'Elderly Care', 'Environment & Conservation',
  'Health & Medicine', 'Homelessness & Housing', 'Human Rights', 'Hunger & Food Security',
  'Sports & Recreation', 'Technology & IT Support', "Women's Empowerment",
];


interface VolunteerOpportunity {
  name: string;
  date: string;
  contact: string;
  category: string;
  description?: string;
}

const volunteerPlaces: {[key: string]: VolunteerOpportunity[]} = {
  'New York': [
    {name: 'Central Park Maintenance Crew', date: '2024-07-20', contact: 'park.volunteer@nyc.gov', category: 'Environment & Conservation', description: 'Help maintain the beauty of Central Park. Tasks include gardening, path clearing, and seasonal planting.'},
    {name: 'NYC Soup Kitchen Helper', date: '2024-07-22', contact: 'food.support@nycares.org', category: 'Hunger & Food Security', description: 'Assist with meal preparation, serving, and cleanup at a local soup kitchen.'},
  ],
  Toronto: [
    {name: 'Toronto Park Cleanup Initiative', date: '2024-07-21', contact: 'parks@toronto.ca', category: 'Environment & Conservation', description: 'Participate in regular park cleanup events, removing litter and improving green spaces.'},
    {name: 'Toronto Food Bank Sorter', date: '2024-07-23', contact: 'volunteer@dailybread.ca', category: 'Hunger & Food Security', description: 'Help sort donations and prepare food hampers for individuals and families facing hunger.'},
  ],
   London: [
    {name: 'River Thames Cleanup Crew', date: '2024-07-22', contact: 'cleanup@thames21.org.uk', category: 'Environment & Conservation', description: 'Join efforts to clean and improve the River Thames and its tributaries, removing plastic and debris.'},
    {name: 'London Food Rescue Volunteer', date: '2024-07-24', contact: 'volunteer@felixproject.org', category: 'Hunger & Food Security', description: 'Help rescue surplus food from suppliers and deliver it to charities and schools.'},
  ],
   Berlin: [
    {name: 'Berliner Tafel Food Distribution', date: '2024-07-23', contact: 'info@berliner-tafel.de', category: 'Hunger & Food Security', description: 'Assist in collecting and distributing food to socially and economically disadvantaged people.'},
    {name: 'Urban Gardening Project Berlin', date: '2024-07-25', contact: 'garten@gruen-berlin.de', category: 'Environment & Conservation', description: 'Contribute to the care and development of Berlin\'s urban gardens and green spaces.'},
  ],
  Paris: [
    {name: 'Secours Populaire Event Volunteer', date: '2024-07-24', contact: 'benevolat@secourspopulaire.fr', category: 'Community Development', description: 'Help organize and run fundraising events, collection drives, and awareness campaigns.'},
    {name: 'Red Cross First Aid Paris', date: '2024-07-26', contact: 'benevolat.paris@croix-rouge.fr', category: 'Health & Medicine', description: 'Volunteer at public events providing first aid services (requires specific training).'},
  ],
  Mumbai: [
    {name: 'Community Health Awareness Volunteer', date: '2024-07-25', contact: 'volunteer@apnalaya.org', category: 'Health & Medicine', description: 'Work with urban poor communities on health awareness, hygiene promotion, and access to services.'},
    {name: 'School Meal Serving Program', date: '2024-07-27', contact: 'volunteer@akshayapatra.org', category: 'Hunger & Food Security', description: 'Assist in serving mid-day meals to children in government schools, ensuring they receive nutritious food.'},
  ],
  Tokyo: [
    {name: 'Diverse Community Projects Tokyo', date: '2024-07-26', contact: 'info@handsontokyo.org', category: 'Community Development', description: 'Participate in diverse volunteer projects supporting local NPOs, including park cleanups and elderly home visits.'},
    {name: 'Food Pantry Volunteer Tokyo', date: '2024-07-28', contact: 'info@2hj.org', category: 'Hunger & Food Security', description: 'Help sort and distribute food to those in need at a local food pantry.'},
  ],
  Shanghai: [
    {name: 'Affordable Housing Build Shanghai', date: '2024-07-27', contact: 'volunteer@habitatchina.org', category: 'Homelessness & Housing', description: 'Participate in house building or renovation projects for low-income families.'},
    {name: 'Environmental Education Assistant', date: '2024-07-29', contact: 'info@srs.org.cn', category: 'Environment & Conservation', description: 'Assist with environmental education programs for youth, promoting sustainability.'},
  ],
  Sydney: [
    {name: 'Bush Regeneration Crew Sydney', date: '2024-07-28', contact: 'sydney@conservationvolunteers.com.au', category: 'Environment & Conservation', description: 'Help restore natural habitats and protect biodiversity by removing invasive species and planting native flora.'},
    {name: 'Foodbank Warehouse Support NSW', date: '2024-07-30', contact: 'volunteer@foodbanknsw.org.au', category: 'Hunger & Food Security', description: 'Assist with packing and sorting food in the warehouse for distribution to charities.'},
  ],
  'Sao Paulo': [
    {name: 'Social Gastronomy Kitchen Helper', date: '2024-07-29', contact: 'voluntariado@gastromotiva.org', category: 'Hunger & Food Security', description: 'Support social gastronomy projects by assisting in kitchen operations and training programs for vulnerable individuals.'},
    {name: 'Food Collection Drive Assistant', date: '2024-07-31', contact: 'contato@bancodealimentos.org.br', category: 'Hunger & Food Security', description: 'Help organize and run food collection drives at supermarkets to support local food banks.'},
  ],
  'Los Angeles': [
    {name: 'LA Community Project Volunteer', date: '2024-07-20', contact: 'info@laworks.com', category: 'Community Development', description: 'Connects volunteers with a wide range of non-profits needing support for various short-term projects.'},
    {name: 'Midnight Mission Meal Service', date: '2024-07-22', contact: 'volunteer@midnightmission.org', category: 'Homelessness & Housing', description: 'Serve meals to individuals experiencing homelessness in Skid Row.'},
  ],
  Calgary: [
    {name: 'Calgary Food Bank Volunteer', date: '2024-07-21', contact: 'volunteer@calgaryfoodbank.com', category: 'Hunger & Food Security', description: 'Help organize food donations, sort items, and pack hampers for distribution to those in need.'},
    {name: 'Habitat for Humanity Build Site Calgary', date: '2024-07-23', contact: 'volunteer@habitatsouthernab.ca', category: 'Homelessness & Housing', description: 'Assist with construction tasks on new affordable housing projects for low-income families.'},
  ],
  Birmingham: [
    {name: 'Birmingham Tree Planting Day', date: '2024-07-22', contact: 'trees@btfl.org.uk', category: 'Environment & Conservation', description: 'Get involved in planting trees in various locations around Birmingham to enhance green spaces.'},
    {name: 'Community Meal Preparation Birmingham', date: '2024-07-24', contact: 'birmingham@foodcycle.org.uk', category: 'Hunger & Food Security', description: 'Help cook and serve nutritious meals using surplus food for vulnerable community members.'},
  ],
   Delhi: [
    {name: 'Goonj Community Drives & Sorting', date: '2024-07-25', contact: 'mail@goonj.org', category: 'Community Development', description: 'Assist with collection drives for clothes, household items, and other essentials, and help in sorting centers.'},
    {name: 'Uday Foundation Health Camp Volunteer', date: '2024-07-27', contact: 'info@udayfoundation.org', category: 'Health & Medicine', description: 'Volunteer at health camps organized for underserved communities, assisting with logistics and patient guidance.'},
  ],
  Chicago: [
    {name: 'Chicago River Cleanup Day', date: '2024-09-01', contact: 'volunteer@chicagoriver.org', category: 'Environment & Conservation', description: 'Join the Friends of the Chicago River for a day of cleaning up sections of the riverbanks.'},
    {name: 'Greater Chicago Food Depository', date: '2024-09-05', contact: 'volunteers@chicagosfoodbank.org', category: 'Hunger & Food Security', description: 'Help repack bulk food into family-sized portions for distribution across Cook County.'},
  ],
  Houston: [
    {name: 'Houston Arboretum & Nature Center', date: '2024-09-03', contact: 'volunteer@houstonarboretum.org', category: 'Environment & Conservation', description: 'Help with trail maintenance, habitat restoration, and educational programs.'},
    {name: 'Houston Food Bank', date: '2024-09-07', contact: 'volunteer@houstonfoodbank.org', category: 'Hunger & Food Security', description: 'Sort and pack food, assist at distribution sites, or help in the community garden.'},
  ],
  Munich: [
    {name: 'Isar River Cleanup Initiative', date: '2024-09-02', contact: 'info@isar-verein.de', category: 'Environment & Conservation', description: 'Participate in cleaning up the banks of the Isar river.'},
    {name: 'Münchner Tafel Food Sorting', date: '2024-09-06', contact: 'info@muenchner-tafel.de', category: 'Hunger & Food Security', description: 'Help sort donated food items for distribution to those in need.'},
  ],
  Bangalore: [
    {name: 'The Ugly Indian Spotfixing', date: '2024-09-04', contact: 'info@theuglyindian.com', category: 'Community Development', description: 'Join anonymous citizen initiatives to clean and beautify public spaces.'},
    {name: 'Let\'s Be The Change Park Cleanup', date: '2024-09-08', contact: 'contact@letsbethechange.in', category: 'Environment & Conservation', description: 'Participate in lake and park cleaning drives across Bangalore.'},
  ],
};

const saiBabaQuotes = [
  { text: "Hands that help are holier than lips that pray." },
  { text: "Service to man is service to God." },
  { text: "The best way to love God is to love all and serve all." },
  { text: "Love all, serve all. Help ever, hurt never." },
  { text: "Life is a challenge, meet it! Life is a dream, realize it! Life is a game, play it! Life is love, enjoy it!" },
  { text: "What is the mark of a good man? He is one who never causes fear in others, and who is never afraid of others."}
];

// News Ticker Data and Component
interface NewsItem {
  headline: string;
  sourceName: string;
  url: string;
  date: string;
}

const newsData: NewsItem[] = [
  {
    headline: "Grief Counsellors to Help Families of AI Crash Victims",
    sourceName: "Rediff News",
    url: "https://www.rediff.com/news/report/grief-counsellors-to-help-families-of-ai-crash-victims/20250615.htm",
    date: "June 15, 2025", // Assuming future date from URL
  },
  {
    headline: "Hyderabad Marks World Blood Donor Day with Awareness Drives, Donation Camps",
    sourceName: "The Hindu",
    url: "https://www.thehindu.com/news/cities/Hyderabad/hyderabad-marks-world-blood-donor-day-with-awareness-drives-donations-camps/article69694494.ece",
    date: "July 28, 2024", // Example, extract from URL if possible or use current
  },
  {
    headline: "People’s Planet Launches One Million Tree Initiative in Bengaluru",
    sourceName: "Deccan Herald",
    url: "https://www.deccanherald.com/india/karnataka/bengaluru/people-s-planet-launches-one-million-tree-initiative-3379347",
    date: "July 27, 2024",
  },
  {
    headline: "Support Swabhimaan: Help Feed the Hungry via DonateKart",
    sourceName: "DonateKart",
    url: "https://www.donatekart.com/Hunger/Support-Swabhimaan?utm_source=Website&utm_medium=ExploreCampaigns&utm_campaign=ExploreCampaigns",
    date: "July 26, 2024",
  },
  {
    headline: "Food Bank Van Drives Change by Feeding Needy in Mumbai Slums",
    sourceName: "Times of India",
    url: "https://timesofindia.indiatimes.com/city/mumbai/food-bank-van-drives-change-by-feeding-needy-in-slums/articleshow/116971306.cms",
    date: "July 25, 2024",
  },
  {
    headline: "Volunteering Opportunities: Bear Rescue to Educating Disadvantaged Children Around Bengaluru",
    sourceName: "The Hindu",
    url: "https://www.thehindu.com/news/cities/bangalore/from-bear-rescue-centres-to-education-of-disadvantaged-children-here-are-four-volunteering-opportunities-around-bengaluru/article69597173.ece",
    date: "July 24, 2024",
  },
  {
    headline: "Mizoram Marks YMA Day with Widespread Community Service",
    sourceName: "Times of India",
    url: "https://timesofindia.indiatimes.com/city/guwahati/mizoram-marks-yma-day-with-community-service/articleshow/121853222.cms",
    date: "July 23, 2024",
  },
  {
    headline: "Dying Texas Man Completes Community Service, Inspires Many",
    sourceName: "The Guardian",
    url: "https://www.theguardian.com/us-news/2025/apr/09/dying-man-community-service-texas",
    date: "April 09, 2025", // Assuming future date from URL
  },
];


const ScrollingNewsTicker: React.FC<{ newsItems: NewsItem[] }> = ({ newsItems }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!newsItems || newsItems.length === 0) return;

    const intervalId = setInterval(() => {
      setIsVisible(false); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        setIsVisible(true); // Start fade-in
      }, 500); // Duration of fade-out animation, should match CSS
    }, 7000); // Change headline every 7 seconds

    return () => clearInterval(intervalId);
  }, [newsItems]);

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  const currentNewsItem = newsItems[currentIndex];

  return (
    <div className="bg-secondary/50 p-4 rounded-lg shadow-md my-6 overflow-hidden">
      <div className="flex items-center mb-2">
        <Newspaper className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Latest Impact News</h3>
      </div>
      <div className="relative h-16"> {/* Container to manage height during transitions */}
        <a
          href={currentNewsItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute inset-0 flex flex-col justify-center text-md font-medium text-foreground hover:text-primary transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {currentNewsItem.headline}
           <span className="text-xs text-muted-foreground mt-1 block">
            {currentNewsItem.sourceName} - {currentNewsItem.date}
          </span>
        </a>
      </div>
    </div>
  );
};


const ImpactPage = () => {
  const {toast} = useToast();

  // Donation States
  const [donationCategory, setDonationCategory] = useState('');
  const [donationInstitution, setDonationInstitution] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [donationReceipt, setDonationReceipt] = useState<string | null>(null);
  const [dailyDonationQuote, setDailyDonationQuote] = useState<{text: string; author: string} | null>(null);
  const donationActivityDetails = ActivityList.find(a => a.name === 'Donate');
  const donationPoints = donationActivityDetails?.points || 0;

  // Volunteer States
  const [volunteerCountry, setVolunteerCountry] = useState('');
  const [volunteerCity, setVolunteerCity] = useState('');
  const [selectedVolunteerCategories, setSelectedVolunteerCategories] = useState<string[]>([]);
  const [allOpportunitiesInCity, setAllOpportunitiesInCity] = useState<VolunteerOpportunity[]>([]);
  const [filteredVolunteerOpportunities, setFilteredVolunteerOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [dailyVolunteerQuote, setDailyVolunteerQuote] = useState<{text: string} | null>(null);
  const commitmentActivityDetails = ActivityList.find(a => a.name === 'Committed to Volunteer');
  const commitmentPoints = commitmentActivityDetails?.points || 0;


  // Combined useEffect for daily quotes and loading donation history
  useEffect(() => {
    const storedHistory = localStorage.getItem('donationHistory');
    if (storedHistory) {
      setTransactionHistory(JSON.parse(storedHistory));
    }

    const today = new Date();
    const dayOfYear = Math.floor((today.valueOf() - new Date(today.getFullYear(), 0, 0).valueOf()) / (1000 * 60 * 60 * 24));
    
    const donationQuoteIndex = dayOfYear % inspirationalQuotes.length;
    setDailyDonationQuote(inspirationalQuotes[donationQuoteIndex]);

    const volunteerQuoteIndex = dayOfYear % saiBabaQuotes.length;
    setDailyVolunteerQuote(saiBabaQuotes[volunteerQuoteIndex]);

  }, []);

  // Volunteer useEffect for filtering
   useEffect(() => {
    if (volunteerCity) {
      const opportunities = volunteerPlaces[volunteerCity] || [];
      setAllOpportunitiesInCity(opportunities);
      if (selectedVolunteerCategories.length === 0) { // If no categories selected, show all
        setFilteredVolunteerOpportunities(opportunities);
      } else {
        setFilteredVolunteerOpportunities(
          opportunities.filter(op => selectedVolunteerCategories.includes(op.category))
        );
      }
    } else {
      setAllOpportunitiesInCity([]);
      setFilteredVolunteerOpportunities([]);
    }
  }, [volunteerCity, selectedVolunteerCategories]);


  // Donation Functions
  const handleDonation = () => {
    if (!donationCategory || !donationInstitution || !donationAmount) {
      toast({
        title: 'Error',
        description: 'Please fill in all the fields for donation.',
        variant: 'destructive',
      });
      return;
    }

    const transactionNumber = Math.floor(Math.random() * 1000000);
    const newTransaction = {
      transactionNumber,
      date: new Date().toLocaleDateString(),
      category: donationCategory,
      institution: donationInstitution,
      amount: donationAmount,
    };

    const updatedHistory = [...transactionHistory, newTransaction];
    setTransactionHistory(updatedHistory);
    localStorage.setItem('donationHistory', JSON.stringify(updatedHistory));

    const receiptText = `
      Transaction Number: ${transactionNumber}
      Date: ${new Date().toLocaleDateString()}
      Category: ${donationCategory}
      Institution: ${donationInstitution}
      Amount: $${donationAmount}
    `;
    setDonationReceipt(receiptText);
    assignKarmaScoreForDonation();

    toast({
      title: 'Donation Successful',
      description: `Thank you for your donation of $${donationAmount} to ${donationInstitution}. Your Transaction ID is ${transactionNumber}. (+${donationPoints} Karma Points)`,
    });

    setDonationCategory('');
    setDonationInstitution('');
    setDonationAmount('');
  };

  const assignKarmaScoreForDonation = () => {
    if (donationActivityDetails) {
      const today = new Date().toISOString().slice(0, 10);
      const existingActivities = JSON.parse(localStorage.getItem(`karma-${today}`) || '[]') || [];
      const activityWithDetails: SelectedKarmaActivity = {
        ...donationActivityDetails,
        quantity: parseFloat(donationAmount) || null, 
        mediaDataUri: null, 
        mediaType: null,
      };
      localStorage.setItem(
        `karma-${today}`,
        JSON.stringify([...existingActivities, activityWithDetails])
      );
    }
  };

  // Volunteer Functions
  const handleVolunteerCountryChange = (value: string) => {
    setVolunteerCountry(value);
    setVolunteerCity('');
    setSelectedVolunteerCategories([]);
    setAllOpportunitiesInCity([]);
    setFilteredVolunteerOpportunities([]);
  };

  const handleVolunteerCityChange = (value: string) => {
    setVolunteerCity(value);
    setSelectedVolunteerCategories([]); 
  };
  
  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedVolunteerCategories(baseVolunteeringCategories);
    } else {
      setSelectedVolunteerCategories([]);
    }
  };

  const handleCategoryCheckboxChange = (category: string, checked: boolean) => {
    setSelectedVolunteerCategories(prev => {
      if (checked) {
        return [...prev, category];
      } else {
        return prev.filter(c => c !== category);
      }
    });
  };


  const logCommitmentActivityForVolunteer = () => {
    if (commitmentActivityDetails) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const storageKey = `karma-${todayStr}`;
      const existingActivities: SelectedKarmaActivity[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (!existingActivities.some(act => act.name === commitmentActivityDetails.name)) {
        const activityToLog: SelectedKarmaActivity = {
          ...commitmentActivityDetails,
          mediaDataUri: null, mediaType: null, quantity: null,
        };
        localStorage.setItem(storageKey, JSON.stringify([...existingActivities, activityToLog]));
      }
    }
  };

  const handleVolunteerRegistration = (opportunityName: string) => {
    logCommitmentActivityForVolunteer();
    toast({
      title: 'Registration Successful!',
      description: `We appreciate your interest to volunteer for "${opportunityName}". A confirmation email shall be sent to your registered email ID. A "Committed to Volunteer" activity (+${commitmentPoints} points) has been logged in your Karma Journal.`,
    });
  };

  const isSelectAllChecked = baseVolunteeringCategories.length > 0 && selectedVolunteerCategories.length === baseVolunteeringCategories.length;


  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader className="bg-muted/30 p-6 rounded-t-xl">
          <div className="flex items-center space-x-3 mb-2">
            <HeartHandshake className="h-8 w-8 text-primary" /> 
            <CardTitle className="text-3xl font-bold text-primary">Make an Impact</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Choose how you'd like to contribute today: make a donation or find volunteer opportunities. Your positive actions will be reflected in your Karma Journal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollingNewsTicker newsItems={newsData} />

          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="donate">
                <CoinsIcon className="mr-2 h-5 w-5" /> Make a Donation
              </TabsTrigger>
              <TabsTrigger value="volunteer">
                <UsersIcon className="mr-2 h-5 w-5" /> Volunteer
              </TabsTrigger>
            </TabsList>

            {/* Donation Tab Content */}
            <TabsContent value="donate" className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start space-x-3 text-sm text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-200 shadow-sm">
                <HeartHandshake className="h-6 w-6 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium">Ready to make a difference? ✨</p>
                  <p className="mt-1">Every donation you make here brightens your Karma Journal by automatically adding a 'Donate' activity (+{donationPoints} points) and its positive impact to your daily score. Your kindness creates ripples!</p>
                </div>
              </div>

              {dailyDonationQuote && (
                <blockquote className="mt-2 p-4 border-l-4 border-primary bg-secondary/60 rounded-r-md shadow-sm">
                  <p className="italic text-sm text-secondary-foreground/90">"{dailyDonationQuote.text}"</p>
                  <footer className="text-xs text-secondary-foreground/70 mt-1 text-right">- {dailyDonationQuote.author}</footer>
                </blockquote>
              )}

              <div className="grid gap-2">
                <label htmlFor="donation-category" className="font-semibold text-sm">Category</label>
                <Select onValueChange={setDonationCategory} value={donationCategory}>
                  <SelectTrigger id="donation-category" className="w-full sm:w-[250px] shadow-sm">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(institutions).map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {donationCategory && (
                <div className="grid gap-2">
                  <label htmlFor="donation-institution" className="font-semibold text-sm">Institution</label>
                  <Select onValueChange={setDonationInstitution} value={donationInstitution}>
                    <SelectTrigger id="donation-institution" className="w-full sm:w-[350px] shadow-sm">
                      <SelectValue placeholder="Select an institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions[donationCategory as keyof typeof institutions]?.map(inst => (
                        <SelectItem key={inst} value={inst}>
                          {inst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {donationInstitution && (
                <div className="grid gap-2">
                  <label htmlFor="donation-amount" className="font-semibold text-sm">Amount ($)</label>
                  <Input
                    type="number" id="donation-amount" placeholder="Enter amount" value={donationAmount}
                    onChange={e => setDonationAmount(e.target.value)} className="shadow-sm w-full sm:w-[200px]"
                  />
                </div>
              )}

              <Button onClick={handleDonation} disabled={!donationInstitution || !donationAmount} className="w-full sm:w-auto shadow-md">
                Complete Donation
              </Button>

              {donationReceipt && (
                <Card className="mt-6 shadow-md rounded-md">
                  <CardHeader className="bg-muted/20"><CardTitle className="text-xl">Donation Receipt</CardTitle></CardHeader>
                  <CardContent className="pt-4">
                    <pre className="p-4 border rounded bg-background/50 text-sm whitespace-pre-wrap">{donationReceipt}</pre>
                  </CardContent>
                </Card>
              )}

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Donation History</h3>
                {transactionHistory.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {transactionHistory.slice().reverse().map((transaction, index) => (
                      <Card key={index} className="p-4 shadow-sm bg-secondary/30 rounded-lg">
                        <p className="text-sm"><span className="font-semibold">Transaction ID:</span> {transaction.transactionNumber}</p>
                        <p className="text-sm"><span className="font-semibold">Date:</span> {transaction.date}</p>
                        <p className="text-sm"><span className="font-semibold">Amount:</span> ${transaction.amount}</p>
                        <p className="text-sm"><span className="font-semibold">Institution:</span> {transaction.institution} ({transaction.category})</p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No donation history available.</p>
                )}
              </div>
            </TabsContent>

            {/* Volunteer Tab Content */}
            <TabsContent value="volunteer" className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start space-x-3 text-sm text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-200 shadow-sm">
                <Sparkles className="h-6 w-6 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium">Ready to lend a hand? 🙌</p>
                  <p className="mt-1">Committing to volunteer is a wonderful way to boost your Karma! This positive step will be automatically recorded as 'Committed to Volunteer' (+{commitmentPoints} points) in your daily journal. Your time and effort truly matter!</p>
                </div>
              </div>

              {dailyVolunteerQuote && (
                <blockquote className="mt-2 p-4 border-l-4 border-primary bg-secondary/60 rounded-r-md shadow-sm">
                  <p className="italic text-sm text-secondary-foreground/90">"{dailyVolunteerQuote.text}"</p>
                  <footer className="text-xs text-secondary-foreground/70 mt-1 text-right">- Sathya Sai Baba</footer>
                </blockquote>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <label htmlFor="volunteer-country" className="font-semibold text-sm">Country</label>
                  <Select onValueChange={handleVolunteerCountryChange} value={volunteerCountry}>
                    <SelectTrigger id="volunteer-country" className="w-full shadow-sm">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                {volunteerCountry && (
                  <div className="grid gap-2">
                    <label htmlFor="volunteer-city" className="font-semibold text-sm">City</label>
                    <Select onValueChange={handleVolunteerCityChange} value={volunteerCity} disabled={!volunteerCountry}>
                      <SelectTrigger id="volunteer-city" className="w-full shadow-sm">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities[volunteerCountry]?.map(ct => (<SelectItem key={ct} value={ct}>{ct}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {volunteerCity && (
                <div className="grid gap-4 mt-4">
                  <div>
                    <label className="font-semibold text-sm mb-2 block">Category of Interest</label>
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="select-all-categories"
                        checked={isSelectAllChecked}
                        onCheckedChange={(checked) => handleSelectAllCategories(Boolean(checked))}
                      />
                      <Label htmlFor="select-all-categories" className="font-medium">
                        Select All Categories
                      </Label>
                    </div>
                    <ScrollArea className="h-40 w-full rounded-md border p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        {baseVolunteeringCategories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.replace(/\s+/g, '-')}`}
                              checked={selectedVolunteerCategories.includes(category)}
                              onCheckedChange={(checked) => handleCategoryCheckboxChange(category, Boolean(checked))}
                            />
                            <Label htmlFor={`category-${category.replace(/\s+/g, '-')}`} className="text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}


              {volunteerCity && filteredVolunteerOpportunities.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-primary">
                    Volunteer Opportunities in {volunteerCity}
                    {selectedVolunteerCategories.length > 0 ? ` (Filtered)` : ''}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {filteredVolunteerOpportunities.map((place, index) => (
                      <Card key={index} className="shadow-md hover:shadow-lg transition-shadow bg-card flex flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-accent">{place.name}</CardTitle>
                          <CardDescription className="text-xs pt-1">Category: {place.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1 flex-grow">
                          <p><strong>Date:</strong> {place.date}</p>
                          <p><strong>Contact:</strong> {place.contact}</p>
                          {place.description && <p className="mt-1 text-muted-foreground italic">"{place.description}"</p>}
                        </CardContent>
                        <CardFooter className="mt-auto pt-3 border-t">
                          <Button onClick={() => handleVolunteerRegistration(place.name)} size="sm" className="w-full">Register</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
                {volunteerCity && allOpportunitiesInCity.length > 0 && selectedVolunteerCategories.length > 0 && filteredVolunteerOpportunities.length === 0 && (
                <p className="mt-6 text-muted-foreground text-center">
                    No volunteer opportunities found for the selected categories in {volunteerCity}. Try adjusting your selection.
                </p>
                )}
                {volunteerCity && allOpportunitiesInCity.length === 0 && (
                <p className="mt-6 text-muted-foreground text-center">
                    No volunteer opportunities listed for {volunteerCity} at the moment. Please check back later or select a different city.
                </p>
                )}

            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactPage;

