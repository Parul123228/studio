"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PaymentModal from "../shared/PaymentModal";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "For individuals starting out.",
    features: ["Limited Art Generation", "Community Support"],
  },
  {
    name: "Premium",
    price: "₹499",
    description: "For power users and professionals.",
    features: [
      "Everything in Free",
      "Full Access to All Tools",
      "Higher Generation Limits",
      "Priority Support",
    ],
  },
  {
    name: "Ultra Premium",
    price: "₹999",
    description: "For teams and businesses.",
    features: [
      "Everything in Premium",
      "Highest Generation Limits",
      "API Access",
      "Dedicated Support",
    ],
  },
];

const PlansSection = () => {
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

    const handleUpgradeClick = (plan: { name: string; price: string }) => {
        setSelectedPlan(plan);
    };

    const getButton = (plan: typeof plans[0]) => {
        if (!user) {
            return (
                <Button asChild className="w-full" variant={plan.name === "Premium" ? "default" : "outline"}>
                    <Link href="/signup">Sign Up to Upgrade</Link>
                </Button>
            );
        }

        if (user.plan === plan.name) {
            return <Button className="w-full" disabled>Your Current Plan</Button>;
        }

        if (plan.name === 'Free') {
            return <Button className="w-full" variant="outline" disabled>Your Current Plan</Button>
        }
        
        if (user.plan === 'Premium' && plan.name === 'Ultra Premium') {
             return <Button onClick={() => handleUpgradeClick(plan)} className="w-full" variant="secondary">Upgrade</Button>;
        }
        
        if (user.plan === 'Ultra Premium') {
            return <Button className="w-full" disabled>N/A</Button>;
        }

        return <Button onClick={() => handleUpgradeClick(plan)} className="w-full" variant={plan.name === "Premium" ? "default" : "secondary"}>Upgrade</Button>
    }

    return (
        <>
            <PaymentModal 
                open={!!selectedPlan} 
                onOpenChange={() => setSelectedPlan(null)}
                planName={selectedPlan?.name || ''}
                planPrice={selectedPlan?.price.replace('₹', '') || ''}
            />
            <section id="plans" className="w-full">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Choose Your Plan</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Unlock more features and power with our premium plans.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`flex flex-col ${plan.name === "Premium" ? "border-primary shadow-primary/20 shadow-lg" : ""} ${plan.name === "Ultra Premium" ? "border-secondary shadow-secondary/20 shadow-lg" : ""}`}
                        >
                            <CardHeader>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div>
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.name !== 'Free' && <span className="text-muted-foreground"> / month</span>}
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
                                {getButton(plan)}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
};

export default PlansSection;
