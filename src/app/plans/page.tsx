"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals starting out.",
    features: [
      "Art Generation",
      "Limited Access",
      "Community Support",
    ],
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

export default function PlansPage() {

  const handleChoosePlan = (planName: string) => {
    // In a real app, this would redirect to a checkout page.
    // For now, it will alert the user with payment instructions.
    alert(`To get the ${planName} plan, please pay the respective amount to our UPI ID: khanparul79@ybl
You can use GPay, PhonePe, or Paytm.
After payment, go to your profile and submit the transaction ID for verification.`);
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Choose Your Plan</h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Unlock more features and power with our premium plans.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.name === 'Premium' ? 'border-primary' : ''}`}>
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
                variant={plan.name === 'Premium' ? 'default' : 'outline'}
                onClick={() => !plan.disabled && handleChoosePlan(plan.name)}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
