"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <p>Please log in to view your profile.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">My Profile</CardTitle>
          <CardDescription>View your account details and current plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email || 'No email associated'} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label>Current Plan</Label>
            <Input value="Free Plan" readOnly disabled />
            <p className="text-sm text-muted-foreground">
                You are currently on the Free Plan. Premium plans are coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
