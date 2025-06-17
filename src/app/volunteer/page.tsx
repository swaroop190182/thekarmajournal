
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import { Users, Sparkles } from 'lucide-react'; 
import { ActivityList } from '@/app/constants';
import type { SelectedKarmaActivity } from '@/app/types';

// Dummy data for countries, cities, and volunteer places
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

const volunteeringCategories = [
  'All Categories',
  'Animal Welfare',
  'Arts & Culture',
  'Children & Youth',
  'Community Development',
  'Crisis Support',
  'Disaster Relief',
  'Education & Literacy',
  'Elderly Care',
  'Environment & Conservation',
  'Health & Medicine',
  'Homelessness & Housing',
  'Human Rights',
  'Hunger & Food Security',
  'Sports & Recreation',
  'Technology & IT Support',
  "Women's Empowerment",
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
    {name: 'Youth Tutoring Program NYC', date: '2024-08-01', contact: 'education@volunteerny.org', category: 'Education & Literacy', description: 'Provide academic support and mentorship to K-12 students in various subjects after school.'},
    {name: 'Animal Shelter Companion NY', date: '2024-08-05', contact: 'pets@aspca.org', category: 'Animal Welfare', description: 'Care for animals by walking dogs, socializing cats, and assisting with adoption events.'},
    {name: 'Senior Center Activity Assistant', date: '2024-08-10', contact: 'seniors@nycvol.org', category: 'Elderly Care', description: 'Assist with recreational activities, social events, and companionship for seniors.'},
    {name: 'Community Garden Volunteer', date: '2024-08-15', contact: 'greenthumb@nyc.gov', category: 'Community Development', description: 'Help cultivate and maintain a community garden, growing food for local distribution.'},
  ],
  Toronto: [
    {name: 'Toronto Park Cleanup Initiative', date: '2024-07-21', contact: 'parks@toronto.ca', category: 'Environment & Conservation', description: 'Participate in regular park cleanup events, removing litter and improving green spaces.'},
    {name: 'Toronto Food Bank Sorter', date: '2024-07-23', contact: 'volunteer@dailybread.ca', category: 'Hunger & Food Security', description: 'Help sort donations and prepare food hampers for individuals and families facing hunger.'},
    {name: 'Youth Mentorship Toronto', date: '2024-08-10', contact: 'mentor@youthlink.ca', category: 'Children & Youth', description: 'Become a mentor for at-risk youth, providing guidance, support, and positive role modeling.'},
    {name: 'Toronto Humane Society Volunteer', date: '2024-08-12', contact: 'volunteer@torontohumanesociety.com', category: 'Animal Welfare', description: 'Assist with animal care, cleaning, and socialization at the shelter.'},
    {name: 'Cultural Festival Assistant', date: '2024-08-18', contact: 'events@torontoarts.org', category: 'Arts & Culture', description: 'Help with setup, guest services, and operations at a local cultural festival.'},
  ],
  London: [
    {name: 'River Thames Cleanup Crew', date: '2024-07-22', contact: 'cleanup@thames21.org.uk', category: 'Environment & Conservation', description: 'Join efforts to clean and improve the River Thames and its tributaries, removing plastic and debris.'},
    {name: 'London Food Rescue Volunteer', date: '2024-07-24', contact: 'volunteer@felixproject.org', category: 'Hunger & Food Security', description: 'Help rescue surplus food from suppliers and deliver it to charities and schools.'},
    {name: 'Elderly Befriending Service UK', date: '2024-08-12', contact: 'friends@ageuk.org.uk', category: 'Elderly Care', description: 'Provide companionship and support to isolated older people in your community through visits or calls.'},
    {name: 'Crisis Hotline Support Volunteer', date: '2024-08-15', contact: 'support@samaritans.org', category: 'Crisis Support', description: 'Offer emotional support to individuals in distress via phone or online chat (requires training).'},
    {name: 'Community Tech Helper', date: '2024-08-20', contact: 'digital@goodthingsfoundation.org', category: 'Technology & IT Support', description: 'Help individuals learn basic digital skills at a local community center.'},
  ],
   Berlin: [
    {name: 'Berliner Tafel Food Distribution', date: '2024-07-23', contact: 'info@berliner-tafel.de', category: 'Hunger & Food Security', description: 'Assist in collecting and distributing food to socially and economically disadvantaged people.'},
    {name: 'Urban Gardening Project Berlin', date: '2024-07-25', contact: 'garten@gruen-berlin.de', category: 'Environment & Conservation', description: 'Contribute to the care and development of Berlin\'s urban gardens and green spaces.'},
    {name: 'Refugee Language Support', date: '2024-08-15', contact: 'welcome@gsbtb.org', category: 'Community Development', description: 'Help newcomers practice German or English in a friendly, informal setting at a language cafe.'},
    {name: 'Homeless Shelter Assistant Berlin', date: '2024-08-22', contact: 'hilfe@berliner-stadtmission.de', category: 'Homelessness & Housing', description: 'Support operations at a homeless shelter, helping with meal service, and distributing essentials.'},
  ],
  Paris: [
    {name: 'Secours Populaire Event Volunteer', date: '2024-07-24', contact: 'benevolat@secourspopulaire.fr', category: 'Community Development', description: 'Help organize and run fundraising events, collection drives, and awareness campaigns.'},
    {name: 'Red Cross First Aid Paris', date: '2024-07-26', contact: 'benevolat.paris@croix-rouge.fr', category: 'Health & Medicine', description: 'Volunteer at public events providing first aid services (requires specific training).'},
    {name: 'Emmaüs Shelter Support Paris', date: '2024-08-18', contact: 'contact@emmaus-solidarite.org', category: 'Homelessness & Housing', description: 'Support operations at a shelter, helping with meal service, sorting donations, and daily tasks.'},
    {name: 'Literacy Tutor for Adults', date: '2024-08-25', contact: 'lireetfairelire@education.fr', category: 'Education & Literacy', description: 'Help adults improve their reading and writing skills in a supportive environment.'},
  ],
  Mumbai: [
    {name: 'Community Health Awareness Volunteer', date: '2024-07-25', contact: 'volunteer@apnalaya.org', category: 'Health & Medicine', description: 'Work with urban poor communities on health awareness, hygiene promotion, and access to services.'},
    {name: 'School Meal Serving Program', date: '2024-07-27', contact: 'volunteer@akshayapatra.org', category: 'Hunger & Food Security', description: 'Assist in serving mid-day meals to children in government schools, ensuring they receive nutritious food.'},
    {name: 'Classroom Assistant for Underserved Schools', date: '2024-08-20', contact: 'volunteer@teachforindia.org', category: 'Education & Literacy', description: 'Support Teach For India fellows in classrooms in under-resourced schools, assisting with activities.'},
    {name: 'Beach Cleanup Drive Mumbai', date: '2024-08-28', contact: 'cleanup@mumbaiclean.org', category: 'Environment & Conservation', description: 'Participate in regular beach cleanups to remove plastic and waste from Mumbai\'s coastline.'},
    {name: 'Women\'s Skill Development Workshop', date: '2024-09-05', contact: 'empower@snehamumbai.org', category: "Women's Empowerment", description: 'Assist in workshops teaching vocational skills to women from marginalized communities.'},
  ],
  Tokyo: [
    {name: 'Diverse Community Projects Tokyo', date: '2024-07-26', contact: 'info@handsontokyo.org', category: 'Community Development', description: 'Participate in diverse volunteer projects supporting local NPOs, including park cleanups and elderly home visits.'},
    {name: 'Food Pantry Volunteer Tokyo', date: '2024-07-28', contact: 'info@2hj.org', category: 'Hunger & Food Security', description: 'Help sort and distribute food to those in need at a local food pantry.'},
    {name: 'Children\'s Activity Leader', date: '2024-08-22', contact: 'info@placetogrow.org', category: 'Children & Youth', description: 'Organize and run recreational and educational activities for children in temporary housing or community centers.'},
    {name: 'Disaster Relief Preparedness Drill', date: '2024-09-10', contact: 'bousai@tokyovolunteer.jp', category: 'Disaster Relief', description: 'Participate in community disaster preparedness drills and awareness campaigns.'},
  ],
  Shanghai: [
    {name: 'Affordable Housing Build Shanghai', date: '2024-07-27', contact: 'volunteer@habitatchina.org', category: 'Homelessness & Housing', description: 'Participate in house building or renovation projects for low-income families.'},
    {name: 'Environmental Education Assistant', date: '2024-07-29', contact: 'info@srs.org.cn', category: 'Environment & Conservation', description: 'Assist with environmental education programs for youth, promoting sustainability.'},
    {name: 'Hospital Playroom Volunteer Shanghai', date: '2024-08-25', contact: 'volunteer@heart2heartsha.net', category: 'Children & Youth', description: 'Volunteer in hospital playrooms, providing comfort and activities for children undergoing medical treatment.'},
    {name: 'Human Rights Advocacy Support', date: '2024-09-12', contact: 'info@chinarights.org', category: 'Human Rights', description: 'Assist with research, translation, or event organization for a human rights NPO (may require specific skills).'},
  ],
  Sydney: [
    {name: 'Bush Regeneration Crew Sydney', date: '2024-07-28', contact: 'sydney@conservationvolunteers.com.au', category: 'Environment & Conservation', description: 'Help restore natural habitats and protect biodiversity by removing invasive species and planting native flora.'},
    {name: 'Foodbank Warehouse Support NSW', date: '2024-07-30', contact: 'volunteer@foodbanknsw.org.au', category: 'Hunger & Food Security', description: 'Assist with packing and sorting food in the warehouse for distribution to charities.'},
    {name: 'Creative Writing Tutor for Youth', date: '2024-08-28', contact: 'volunteer@storyfactory.org.au', category: 'Education & Literacy', description: 'Help young people from under-resourced communities develop their writing skills and creativity.'},
    {name: 'Crisis Support Line Volunteer (Training Provided)', date: '2024-09-15', contact: 'volunteer@lifeline.org.au', category: 'Crisis Support', description: 'Provide confidential support to individuals in crisis (requires extensive training).'},
  ],
  'Sao Paulo': [
    {name: 'Social Gastronomy Kitchen Helper', date: '2024-07-29', contact: 'voluntariado@gastromotiva.org', category: 'Hunger & Food Security', description: 'Support social gastronomy projects by assisting in kitchen operations and training programs for vulnerable individuals.'},
    {name: 'Food Collection Drive Assistant', date: '2024-07-31', contact: 'contato@bancodealimentos.org.br', category: 'Hunger & Food Security', description: 'Help organize and run food collection drives at supermarkets to support local food banks.'},
    {name: 'Child Cancer Support Center Volunteer', date: '2024-08-30', contact: 'voluntariado@graacc.org.br', category: 'Health & Medicine', description: 'Provide support, recreational activities, and companionship for children undergoing cancer treatment.'},
    {name: 'Sports Program Coach for Youth', date: '2024-09-18', contact: 'esportes@comunidade.org', category: 'Sports & Recreation', description: 'Coach or assist with sports programs for children in underserved communities.'},
  ],
  'Los Angeles': [
    {name: 'LA Community Project Volunteer', date: '2024-07-20', contact: 'info@laworks.com', category: 'Community Development', description: 'Connects volunteers with a wide range of non-profits needing support for various short-term projects.'},
    {name: 'Midnight Mission Meal Service', date: '2024-07-22', contact: 'volunteer@midnightmission.org', category: 'Homelessness & Housing', description: 'Serve meals to individuals experiencing homelessness in Skid Row.'},
    {name: 'Heal the Bay Beach Cleanup LA', date: '2024-08-03', contact: 'volunteer@healthebay.org', category: 'Environment & Conservation', description: 'Participate in regular beach cleanup events along the LA coastline to protect marine life.'},
    {name: 'After-School Arts Program Helper', date: '2024-08-14', contact: 'arts@lacreates.org', category: 'Arts & Culture', description: 'Assist with art workshops and creative activities for children in local community centers.'},
  ],
  Calgary: [
    {name: 'Calgary Food Bank Volunteer', date: '2024-07-21', contact: 'volunteer@calgaryfoodbank.com', category: 'Hunger & Food Security', description: 'Help organize food donations, sort items, and pack hampers for distribution to those in need.'},
    {name: 'Habitat for Humanity Build Site Calgary', date: '2024-07-23', contact: 'volunteer@habitatsouthernab.ca', category: 'Homelessness & Housing', description: 'Assist with construction tasks on new affordable housing projects for low-income families.'},
    {name: 'Calgary Humane Society Animal Care', date: '2024-08-07', contact: 'volunteer@calgaryhumane.ca', category: 'Animal Welfare', description: 'Support animal care, including walking dogs, socializing cats, and assisting with shelter upkeep.'},
    {name: 'Seniors Companion Program Calgary', date: '2024-08-19', contact: 'connect@calgaryseniors.org', category: 'Elderly Care', description: 'Provide companionship and social support to seniors living independently or in care facilities.'},
  ],
  Birmingham: [
    {name: 'Birmingham Tree Planting Day', date: '2024-07-22', contact: 'trees@btfl.org.uk', category: 'Environment & Conservation', description: 'Get involved in planting trees in various locations around Birmingham to enhance green spaces.'},
    {name: 'Community Meal Preparation Birmingham', date: '2024-07-24', contact: 'birmingham@foodcycle.org.uk', category: 'Hunger & Food Security', description: 'Help cook and serve nutritious meals using surplus food for vulnerable community members.'},
    {name: 'Youth Mentoring Birmingham', date: '2024-08-11', contact: 'volunteer@stbasils.org.uk', category: 'Children & Youth', description: 'Mentor young people at risk of homelessness, providing guidance and positive engagement.'},
    {name: 'Museum Exhibit Guide', date: '2024-08-21', contact: 'volunteer@birminghammuseums.org.uk', category: 'Arts & Culture', description: 'Volunteer as a guide or assistant for exhibitions at local museums and art galleries.'},
  ],
   Delhi: [
    {name: 'Goonj Community Drives & Sorting', date: '2024-07-25', contact: 'mail@goonj.org', category: 'Community Development', description: 'Assist with collection drives for clothes, household items, and other essentials, and help in sorting centers.'},
    {name: 'Uday Foundation Health Camp Volunteer', date: '2024-07-27', contact: 'info@udayfoundation.org', category: 'Health & Medicine', description: 'Volunteer at health camps organized for underserved communities, assisting with logistics and patient guidance.'},
    {name: 'Friendicoes Animal Shelter Helper Delhi', date: '2024-08-14', contact: 'friendicoes@gmail.com', category: 'Animal Welfare', description: 'Assist with feeding, grooming, and caring for rescued animals at the shelter.'},
    {name: 'Street Children Education Support', date: '2024-08-24', contact: 'contact@salaambaalaktrust.com', category: 'Education & Literacy', description: 'Support educational activities and workshops for street children at a local trust.'},
  ],
  Chicago: [
    {name: 'Chicago River Cleanup Day', date: '2024-09-01', contact: 'volunteer@chicagoriver.org', category: 'Environment & Conservation', description: 'Join the Friends of the Chicago River for a day of cleaning up sections of the riverbanks.'},
    {name: 'Greater Chicago Food Depository', date: '2024-09-05', contact: 'volunteers@chicagosfoodbank.org', category: 'Hunger & Food Security', description: 'Help repack bulk food into family-sized portions for distribution across Cook County.'},
    {name: 'Big Brothers Big Sisters of Metro Chicago', date: '2024-09-10', contact: 'enroll@bbbschgo.org', category: 'Children & Youth', description: 'Become a mentor and make a positive impact on a child\'s life.'},
    {name: 'PAWS Chicago Animal Shelter', date: '2024-09-15', contact: 'volunteer@pawschicago.org', category: 'Animal Welfare', description: 'Assist with animal care, adoption events, or administrative tasks at this no-kill shelter.'}
  ],
  Houston: [
    {name: 'Houston Arboretum & Nature Center', date: '2024-09-03', contact: 'volunteer@houstonarboretum.org', category: 'Environment & Conservation', description: 'Help with trail maintenance, habitat restoration, and educational programs.'},
    {name: 'Houston Food Bank', date: '2024-09-07', contact: 'volunteer@houstonfoodbank.org', category: 'Hunger & Food Security', description: 'Sort and pack food, assist at distribution sites, or help in the community garden.'},
    {name: 'Kids\' Meals Houston', date: '2024-09-12', contact: 'volunteer@kidsmealshtx.org', category: 'Children & Youth', description: 'Prepare and deliver free, healthy meals to preschool-aged children living in poverty.'}
  ],
  Munich: [
    {name: 'Isar River Cleanup Initiative', date: '2024-09-02', contact: 'info@isar-verein.de', category: 'Environment & Conservation', description: 'Participate in cleaning up the banks of the Isar river.'},
    {name: 'Münchner Tafel Food Sorting', date: '2024-09-06', contact: 'info@muenchner-tafel.de', category: 'Hunger & Food Security', description: 'Help sort donated food items for distribution to those in need.'},
    {name: 'Reading Buddy for Children (Lesefuchs)', date: '2024-09-11', contact: 'info@lesefuechse.org', category: 'Education & Literacy', description: 'Read to children in kindergartens and schools to promote literacy.'}
  ],
  Bangalore: [
    {name: 'The Ugly Indian Spotfixing', date: '2024-09-04', contact: 'info@theuglyindian.com', category: 'Community Development', description: 'Join anonymous citizen initiatives to clean and beautify public spaces.'},
    {name: 'Let\'s Be The Change Park Cleanup', date: '2024-09-08', contact: 'contact@letsbethechange.in', category: 'Environment & Conservation', description: 'Participate in lake and park cleaning drives across Bangalore.'},
    {name: 'Akshaya Patra Kitchen Volunteer', date: '2024-09-13', contact: 'volunteer@akshayapatra.org', category: 'Hunger & Food Security', description: 'Assist in the massive kitchens preparing mid-day meals for school children.'}
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


const VolunteerPage = () => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allOpportunitiesInCity, setAllOpportunitiesInCity] = useState<VolunteerOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<VolunteerOpportunity[]>([]);
  const {toast} = useToast();
  const [dailyQuote, setDailyQuote] = useState<{text: string} | null>(null);

  const commitmentActivityDetails = ActivityList.find(a => a.name === 'Committed to Volunteer');
  const commitmentPoints = commitmentActivityDetails?.points || 0;


  useEffect(() => {
    if (city) {
      const opportunities = volunteerPlaces[city] || [];
      setAllOpportunitiesInCity(opportunities);
      if (selectedCategory && selectedCategory !== 'All Categories') {
        setFilteredOpportunities(opportunities.filter(op => op.category === selectedCategory));
      } else {
        setFilteredOpportunities(opportunities);
      }
    } else {
      setAllOpportunitiesInCity([]);
      setFilteredOpportunities([]);
    }
    
    // Select daily quote
    const today = new Date();
    const dayOfYear = Math.floor((today.valueOf() - new Date(today.getFullYear(), 0, 0).valueOf()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % saiBabaQuotes.length;
    setDailyQuote(saiBabaQuotes[quoteIndex]);

  }, [city, selectedCategory]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCity('');
    setSelectedCategory('');
    setAllOpportunitiesInCity([]);
    setFilteredOpportunities([]);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setSelectedCategory('');
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const logCommitmentActivity = () => {
    const commitmentActivity = ActivityList.find(activity => activity.name === 'Committed to Volunteer');
    if (commitmentActivity) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const storageKey = `karma-${todayStr}`;
      const existingActivities: SelectedKarmaActivity[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (!existingActivities.some(act => act.name === commitmentActivity.name)) {
        const activityToLog: SelectedKarmaActivity = {
          ...commitmentActivity,
          mediaDataUri: null,
          mediaType: null,
          quantity: null,
        };
        localStorage.setItem(storageKey, JSON.stringify([...existingActivities, activityToLog]));
      }
    }
  };

  const handleVolunteerRegistration = (opportunityName: string) => {
    logCommitmentActivity();
    toast({
      title: 'Registration Successful!',
      description: `We appreciate your interest to volunteer for "${opportunityName}". A confirmation email shall be sent to your registered email ID. A "Committed to Volunteer" activity (+${commitmentPoints} points) has been logged in your Karma Journal.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader className="bg-muted/30 p-6 rounded-t-xl">
          <div className="flex items-center space-x-3 mb-2">
             <Users className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Volunteer Opportunities</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Find volunteer opportunities in your area. Committing to volunteer will be noted in your Karma Journal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start space-x-3 text-sm text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-200 shadow-sm">
            <Sparkles className="h-6 w-6 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div>
                <p className="font-medium">Ready to lend a hand? 🙌</p>
                <p className="mt-1">Committing to volunteer is a wonderful way to boost your Karma! This positive step will be automatically recorded as 'Committed to Volunteer' (+{commitmentPoints} points) in your daily journal. Your time and effort truly matter!</p>
            </div>
          </div>

          {dailyQuote && (
            <blockquote className="mt-2 p-4 border-l-4 border-primary bg-secondary/60 rounded-r-md shadow-sm">
              <p className="italic text-sm text-secondary-foreground/90">"{dailyQuote.text}"</p>
              <footer className="text-xs text-secondary-foreground/70 mt-1 text-right">- Sathya Sai Baba</footer>
            </blockquote>
          )}


          <div className="grid sm:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label htmlFor="country" className="font-semibold text-sm">Country</label>
              <Select onValueChange={handleCountryChange} value={country}>
                <SelectTrigger id="country" className="w-full shadow-sm">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {country && (
              <div className="grid gap-2">
                <label htmlFor="city" className="font-semibold text-sm">City</label>
                <Select onValueChange={handleCityChange} value={city} disabled={!country}>
                  <SelectTrigger id="city" className="w-full shadow-sm">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities[country]?.map(ct => (
                      <SelectItem key={ct} value={ct}>
                        {ct}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {city && (
            <div className="grid gap-2 mt-2">
              <label htmlFor="category" className="font-semibold text-sm">Category of Interest</label>
              <Select onValueChange={handleCategoryChange} value={selectedCategory} disabled={!city}>
                <SelectTrigger id="category" className="w-full sm:w-[300px] shadow-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {volunteeringCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {city && filteredOpportunities.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-primary">
                Volunteer Opportunities in {city}
                {selectedCategory && selectedCategory !== 'All Categories' ? ` (Category: ${selectedCategory})` : ''}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredOpportunities.map((place, index) => (
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

          {city && selectedCategory && selectedCategory !== 'All Categories' && filteredOpportunities.length === 0 && (
             <p className="mt-6 text-muted-foreground text-center">
                No volunteer opportunities found for "{selectedCategory}" in {city}. Try selecting "All Categories" or a different city.
            </p>
          )}

          {city && !selectedCategory && allOpportunitiesInCity.length === 0 && (
            <p className="mt-6 text-muted-foreground text-center">
                No volunteer opportunities listed for {city} at the moment. Please check back later or select a different city.
            </p>
          )}
           {city && selectedCategory === 'All Categories' && filteredOpportunities.length === 0 && (
            <p className="mt-6 text-muted-foreground text-center">
              No volunteer opportunities found in {city}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerPage;

