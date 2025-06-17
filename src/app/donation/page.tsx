
'use client';

import React, {useState, useEffect} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {ActivityList} from '@/app/constants';
import { HeartHandshake } from 'lucide-react'; 
import type { SelectedKarmaActivity } from '@/app/types';

// Dummy data for charitable institutions
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


const DonationPage = () => {
  const [category, setCategory] = useState('');
  const [institution, setInstitution] = useState('');
  const [amount, setAmount] = useState('');
  const {toast} = useToast();
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [dailyQuote, setDailyQuote] = useState<{text: string; author: string} | null>(null);
  
  const donationActivityDetails = ActivityList.find(a => a.name === 'Donate');
  const donationPoints = donationActivityDetails?.points || 0;

  useEffect(() => {
    // Load transaction history from local storage
    const storedHistory = localStorage.getItem('donationHistory');
    if (storedHistory) {
      setTransactionHistory(JSON.parse(storedHistory));
    }

    // Select daily quote
    const today = new Date();
    const dayOfYear = Math.floor((today.valueOf() - new Date(today.getFullYear(), 0, 0).valueOf()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % inspirationalQuotes.length;
    setDailyQuote(inspirationalQuotes[quoteIndex]);

  }, []);

  const handleDonation = () => {
    if (!category || !institution || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all the fields.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate donation process
    const transactionNumber = Math.floor(Math.random() * 1000000);
    const newTransaction = {
      transactionNumber,
      date: new Date().toLocaleDateString(),
      category,
      institution,
      amount,
    };

    // Update transaction history
    const updatedHistory = [...transactionHistory, newTransaction];
    setTransactionHistory(updatedHistory);
    localStorage.setItem('donationHistory', JSON.stringify(updatedHistory));

    // Generate receipt
    const receiptText = `
      Transaction Number: ${transactionNumber}
      Date: ${new Date().toLocaleDateString()}
      Category: ${category}
      Institution: ${institution}
      Amount: $${amount}
    `;
    setReceipt(receiptText);

    // Assign Karma score
    assignKarmaScore();

    toast({
      title: 'Donation Successful',
      description: `Thank you for your donation of $${amount} to ${institution} under ${category}. Your Transaction ID is ${transactionNumber}.`,
    });

    // Reset form fields
    setCategory('');
    setInstitution('');
    setAmount('');
  };

  const assignKarmaScore = () => {
    const donationActivity = ActivityList.find(
      activity => activity.name === 'Donate'
    );

    if (donationActivity) {
      const today = new Date().toISOString().slice(0, 10);
      const existingActivities =
        JSON.parse(localStorage.getItem(`karma-${today}`) || '[]') || [];
      
      const activityWithDetails: SelectedKarmaActivity = {
        ...donationActivity,
        quantity: parseFloat(amount) || null, 
        mediaDataUri: null, 
        mediaType: null,
      };

      localStorage.setItem(
        `karma-${today}`,
        JSON.stringify([...existingActivities, activityWithDetails])
      );
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-xl">
        <CardHeader className="bg-muted/30 p-6 rounded-t-xl">
          <div className="flex items-center space-x-3 mb-2">
            <HeartHandshake className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Make a Donation</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Support a cause close to your heart by donating to a charitable institution.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start space-x-3 text-sm text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-600 dark:text-emerald-200 shadow-sm">
            <HeartHandshake className="h-6 w-6 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-medium">Ready to make a difference? ✨</p>
              <p className="mt-1">Every donation you make here brightens your Karma Journal by automatically adding a 'Donate' activity (+{donationPoints} points) and its positive impact to your daily score. Your kindness creates ripples!</p>
            </div>
          </div>

           {dailyQuote && (
            <blockquote className="mt-2 p-4 border-l-4 border-primary bg-secondary/60 rounded-r-md shadow-sm">
              <p className="italic text-sm text-secondary-foreground/90">"{dailyQuote.text}"</p>
              <footer className="text-xs text-secondary-foreground/70 mt-1 text-right">- {dailyQuote.author}</footer>
            </blockquote>
          )}

          <div className="grid gap-2">
            <label htmlFor="category" className="font-semibold text-sm">Category</label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full sm:w-[250px] shadow-sm">
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

          {category && (
            <div className="grid gap-2">
              <label htmlFor="institution" className="font-semibold text-sm">Institution</label>
              <Select
                onValueChange={setInstitution}
                value={institution}
              >
                <SelectTrigger className="w-full sm:w-[350px] shadow-sm">
                  <SelectValue placeholder="Select an institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutions[category]?.map(inst => (
                    <SelectItem key={inst} value={inst}>
                      {inst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {institution && (
            <div className="grid gap-2">
              <label htmlFor="amount" className="font-semibold text-sm">Amount ($)</label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="shadow-sm w-full sm:w-[200px]"
              />
            </div>
          )}

          <Button onClick={handleDonation} disabled={!institution || !amount} className="w-full sm:w-auto shadow-md">
            Complete Donation
          </Button>

          {receipt && (
            <Card className="mt-6 shadow-md rounded-md">
              <CardHeader className="bg-muted/20">
                <CardTitle className="text-xl">Donation Receipt</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <pre className="p-4 border rounded bg-background/50 text-sm whitespace-pre-wrap">{receipt}</pre>
              </CardContent>
            </Card>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Donation History</h3>
            {transactionHistory.length > 0 ? (
              <div className="space-y-3">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationPage;

