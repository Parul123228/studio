// src/app/dashboard/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIcon, LineChart, Star, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const UsageChart = dynamic(() => import('@/components/shared/UsageChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});


const mockCreations = [
  { id: 1, prompt: "A cyberpunk city in the rain", url: "https://placehold.co/512x512.png", hint: "cyberpunk rain" },
  { id: 2, prompt: "A robot meditating on a mountaintop", url: "https://placehold.co/512x512.png", hint: "robot mountain" },
  { id: 3, prompt: "A magical forest with glowing fauna", url: "https://placehold.co/512x512.png", hint: "glowing forest" },
  { id: 4, prompt: "An astronaut playing guitar on the moon", url: "https://placehold.co/512x512.png", hint: "astronaut moon" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  const getPlanVariant = () => {
    switch (user.plan) {
      case 'Premium': return 'default';
      case 'Ultra Premium': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user.displayName || 'User'}!</h1>
        <p className="text-lg text-muted-foreground">Here's a summary of your activity and current plan.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creations Made</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Saved</CardTitle>
            <Save className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
            <p className="text-xs text-muted-foreground">+80 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getPlanVariant()} className="text-lg">{user.plan}</Badge>
            <p className="text-xs text-muted-foreground mt-2">
                {user.plan !== "Ultra Premium" ? "Upgrade for more credits!" : "You have the best plan!"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,450</div>
            <p className="text-xs text-muted-foreground">Resets in 15 days</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Usage Chart */}
        <div className="lg:col-span-3">
            <UsageChart />
        </div>

        {/* Recent Creations */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Recent Creations</CardTitle>
                    <CardDescription>A glimpse of your latest works.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {mockCreations.map(img => (
                            <div key={img.id} className="group relative overflow-hidden rounded-lg">
                                <Image 
                                    src={img.url}
                                    alt={img.prompt}
                                    width={200}
                                    height={200}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    data-ai-hint={img.hint}
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                                    <p className="text-white text-xs line-clamp-2">{img.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href="/generate">
                            View All Your Creations <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
