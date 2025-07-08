"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { submitTransactionAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useRef, useEffect } from "react";
import { Loader } from "lucide-react";

const UpgradeForm = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        if (!formData.get('planName')) {
            toast({ title: 'Submission Failed', description: 'Please select a plan.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitTransactionAction(formData);

            if (result.error) {
                toast({ title: 'Submission Failed', description: result.error, variant: 'destructive' });
            } else {
                toast({ title: 'Submission Successful', description: 'Your request is being processed. Please allow up to 24 hours for your plan to be upgraded.' });
                formRef.current?.reset();
            }
        } catch (e) {
             toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mt-8 border-primary">
            <CardHeader>
                <CardTitle>Upgrade to a New Plan</CardTitle>
                <CardDescription>
                    After completing a payment from the Plans page, select the plan you paid for and submit your UPI Transaction ID below.
                </CardDescription>
            </CardHeader>
            <form ref={formRef} onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <input type="hidden" name="userId" value={user?.uid || ''} />
                    <input type="hidden" name="userEmail" value={user?.email || ''} />
                    <div className="space-y-2">
                        <Label>1. Select Plan</Label>
                        <RadioGroup name="planName" required className="flex gap-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Premium" id="r-premium" />
                                <Label htmlFor="r-premium">Premium (₹499)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Ultra Premium" id="r-ultra" />
                                <Label htmlFor="r-ultra">Ultra Premium (₹999)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="transactionId">2. UPI Transaction ID</Label>
                        <Input id="transactionId" name="transactionId" placeholder="Enter your transaction ID" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit for Approval"
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <p>Loading profile...</p>
        </div>
    )
  }
  
  const getPlanVariant = () => {
    switch (user.plan) {
      case 'Premium':
        return 'default';
      case 'Ultra Premium':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-3xl">My Profile</CardTitle>
                <CardDescription>View your account details and manage your subscription.</CardDescription>
            </div>
            <Badge variant={getPlanVariant()}>{user.plan}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email || 'No email associated'} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input value={user.displayName || 'User'} readOnly disabled />
          </div>
        </CardContent>
        <CardFooter>
            <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </CardFooter>
      </Card>

      {user.plan !== 'Ultra Premium' && <UpgradeForm />}
    </div>
  );
}
