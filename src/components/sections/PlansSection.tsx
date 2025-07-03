"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals starting out.",
    features: ["Art Generation", "Limited Access", "Community Support"],
    cta: "Your Current Plan",
    disabled: true,
  },
  {
    name: "Premium",
    price: "$10",
    description: "For power users and professionals.",
    features: [
      "All Free features",
      "Full Access to All Tools",
      "Priority Support",
      "Higher Generation Limits",
    ],
    cta: "Choose Premium",
  },
  {
    name: "Business",
    price: "$25",
    description: "For teams and businesses.",
    features: [
      "All Premium features",
      "Team Management",
      "API Access",
      "Dedicated Support",
    ],
    cta: "Choose Business",
  },
];

const UPI_ID = "khanparul79@ybl";

const PlansSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
    null
  );
  const { toast } = useToast();

  const handleChoosePlan = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(UPI_ID);
      toast({
        title: "Copied to Clipboard!",
        description: `UPI ID: ${UPI_ID}`,
      });
    }
  };

  return (
    <>
      <section id="plans" className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Choose Your Plan
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Unlock more features and power with our premium plans.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.name === "Premium" ? "border-primary" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={plan.disabled}
                  variant={plan.name === "Premium" ? "default" : "outline"}
                  onClick={() => !plan.disabled && handleChoosePlan(plan)}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {selectedPlan && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Upgrade to {selectedPlan.name}
              </DialogTitle>
              <DialogDescription>
                To complete your purchase, please pay{" "}
                <span className="font-bold text-primary">
                  {selectedPlan.price}
                </span>{" "}
                using the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="p-2 border rounded-lg">
                <Image
                  src="/upi-qr-code.png"
                  width={200}
                  height={200}
                  alt="UPI QR Code"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = 'https://placehold.co/200x200.png';
                    target.alt = 'QR Code placeholder - Add upi-qr-code.png to /public folder';
                  }}
                  data-ai-hint="qr code"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan the QR code with any UPI app
              </p>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-lg">{UPI_ID}</p>
                <Button variant="ghost" size="icon" onClick={handleCopyUpi}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter className="text-center sm:text-center flex-col items-center space-y-2">
              <p className="text-sm text-muted-foreground">
                After payment, go to your profile and submit the transaction ID
                for verification.
              </p>
              <Button asChild onClick={() => setDialogOpen(false)}>
                <Link href="/profile">Go to Profile</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PlansSection;
