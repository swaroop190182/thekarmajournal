
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Info } from 'lucide-react';

const USER_PROFILE_KEY = 'karmaJournalUser';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const existingProfile = localStorage.getItem(USER_PROFILE_KEY);
    if (existingProfile) {
      try {
        const profile = JSON.parse(existingProfile);
        if (profile.username) {
          setUsername(profile.username);
          setHasProfile(true);
        }
      } catch (e) {
        console.error("Failed to parse existing profile", e);
      }
    }
  }, []);

  const handleSaveProfile = () => {
    if (!username.trim()) {
      toast({
        title: 'Username Required',
        description: 'Please enter a name or nickname.',
        variant: 'destructive',
      });
      return;
    }

    const userProfile = { username: username.trim() };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
    toast({
      title: hasProfile ? 'Profile Updated!' : 'Profile Created!',
      description: `Welcome, ${username.trim()}! Your journey begins now.`,
    });
    router.push('/home'); // Redirect to the main journaling page
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-2xl font-bold">
            {hasProfile ? 'Update Your Profile' : 'Welcome to Karma Journal!'}
          </CardTitle>
          <CardDescription>
            {hasProfile 
              ? `You can update your name below, ${username}.`
              : 'Let\'s get you set up. What should we call you?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Your Name / Nickname</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g., Alex, Mindful Explorer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start space-x-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Privacy Note:</strong> All your journal data, including this name, is stored
              locally in your browser and is not sent to any server.
            </p>
          </div>

          <Button onClick={handleSaveProfile} className="w-full text-lg py-3">
            {hasProfile ? 'Update & Go to Journal' : 'Save & Get Started'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
    