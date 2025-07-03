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

const UpgradeForm = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const result = await submitTransactionAction(formData);

        if (result.error) {
            toast({ title: 'Submission Failed', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Submission Successful', description: 'Your request is being processed. Please allow up to 24 hours for your plan to be upgraded.' });
            // Optionally clear form or give other feedback
        }
    };

    return (
        <Card className="mt-8 border-primary">
            <CardHeader>
                <CardTitle>Upgrade to Premium</CardTitle>
                <CardDescription>
                    After completing the payment, submit your UPI Transaction ID below to upgrade your plan.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <input type="hidden" name="userId" value={user?.uid || ''} />
                    <input type="hidden" name="userEmail" value={user?.email || ''} />
                    <div className="space-y-2">
                        <Label htmlFor="transactionId">UPI Transaction ID</Label>
                        <Input id="transactionId" name="transactionId" placeholder="Enter your transaction ID" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Submit for Approval</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <p>Loading profile...</p>
        </div>
    )
  }

  if (!user) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
    return null;
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
            <Badge variant={user.plan === 'Premium' ? 'default' : 'secondary'}>{user.plan}</Badge>
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
            <Button variant="outline" onClick={() => { logout(); router.push('/')}}>Log Out</Button>
        </CardFooter>
      </Card>

      {user.plan === 'Free' && <UpgradeForm />}
    </div>
  );
}
