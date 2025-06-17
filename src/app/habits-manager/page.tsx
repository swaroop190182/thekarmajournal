
import React, { Suspense } from 'react';
import HabitsManagerClient from './habits-manager-client';
import { Skeleton } from '@/components/ui/skeleton'; // Using Skeleton for a nicer fallback

// Basic loading skeleton component
const LoadingFallback = () => (
  <div className="container mx-auto py-10">
    <Skeleton className="h-12 w-1/2 mb-4" />
    <Skeleton className="h-8 w-3/4 mb-8" />
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Skeleton className="h-[350px] w-full rounded-lg" />
        <Skeleton className="h-[350px] w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  </div>
);

export default function HabitManagerPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HabitsManagerClient />
    </Suspense>
  );
}
