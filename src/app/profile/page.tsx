"use client";

import { useAuth } from "@/contexts/auth-context";
import { useSubscription } from "@/contexts/subscription-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
            <p>Please log in to view your profile.</p>
        </div>
    )
  }

  const handleSubmitTransaction = async () => {
    if (!isFirebaseConfigured || !db || !user) {
        toast({ title: "Error", description: "Feature not available. Firebase is not configured.", variant: "destructive" });
        return;
    }
    if (!transactionId) {
        toast({ title: "Error", description: "Please enter a transaction ID.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        await setDoc(doc(db, "subscriptions", user.uid), {
            userId: user.uid,
            transactionId,
            paymentStatus: "pending",
            // This is a simplified version. You'd also set the plan type based on what they paid for.
            planType: "Premium", 
        }, { merge: true });
        toast({ title: "Success", description: "Transaction ID submitted for verification."});
        setTransactionId("");
    } catch (error) {
        toast({ title: "Submission Failed", description: "Could not submit transaction ID. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const planName = subscription?.planType || 'Free';
  const planStatus = subscription?.paymentStatus;

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">My Profile</CardTitle>
          <CardDescription>View your account details and manage your subscription.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email || 'No email associated'} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label>Current Plan</Label>
            {subLoading ? <Loader className="animate-spin"/> : (
                 <Input value={`${planName} ${planStatus ? `(${planStatus})` : ''}`} readOnly disabled />
            )}
          </div>
          
          {planName === 'Free' && (
             <Card className="p-4 border-primary">
                <CardHeader className="p-0 pb-4">
                    <CardTitle>Upgrade Your Plan</CardTitle>
                    <CardDescription>
                        Paid via UPI? Submit your transaction ID for verification. It may take up to 24 hours.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input 
                            id="transactionId" 
                            placeholder="Enter your UPI transaction ID" 
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            disabled={!isFirebaseConfigured}
                        />
                    </div>
                    <Button onClick={handleSubmitTransaction} disabled={isSubmitting || !isFirebaseConfigured}>
                        {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                        Submit for Verification
                    </Button>
                </CardContent>
             </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
