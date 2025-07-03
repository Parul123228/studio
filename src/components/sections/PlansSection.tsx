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
    features: ["Limited Art Generation", "Basic Chatbot Access", "Community Support"],
  },
  {
    name: "Premium",
    price: "₹199",
    description: "For power users and professionals.",
    features: [
      "All Free features",
      "Full Access to All Tools",
      "Priority Support",
      "Higher Generation Limits",
    ],
  },
  {
    name: "Business",
    price: "Contact Us",
    description: "For teams and businesses.",
    features: [
      "All Premium features",
      "Team Management",
      "API Access",
      "Dedicated Support",
    ],
  },
];

const PlansSection = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCtaClick = (planName: string) => {
        if (!user) {
            // Handled by the button's Link component
            return;
        }
        if (planName === 'Premium') {
            setIsModalOpen(true);
        }
        if (planName === 'Business') {
            // In a real app, this would open a contact form or mailto link
            alert("Please contact us for business pricing.");
        }
    };

    const getButton = (planName: string) => {
        if (!user) {
             if (planName !== 'Free') {
                return (
                    <Button asChild className="w-full" variant={planName === "Premium" ? "default" : "outline"}>
                        <Link href="/signup">Sign Up to Upgrade</Link>
                    </Button>
                );
             }
            return (
                <Button asChild className="w-full" variant="outline">
                    <Link href="/signup">Get Started</Link>
                </Button>
            );
        }
        
        if (user.plan === planName) {
            return <Button className="w-full" disabled>Your Current Plan</Button>;
        }

        if (user.plan === 'Free' && planName === 'Premium') {
            return <Button onClick={() => handleCtaClick('Premium')} className="w-full">Upgrade to Premium</Button>;
        }
        
        if (planName === 'Free') {
             return <Button className="w-full" variant="outline" disabled>Get Started</Button>
        }

        return <Button onClick={() => handleCtaClick(planName)} className="w-full" variant="outline">Get Started</Button>
    }

    return (
        <>
            <PaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
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
                            className={`flex flex-col ${plan.name === "Premium" ? "border-primary shadow-primary/20 shadow-lg" : ""}`}
                        >
                            <CardHeader>
                                <CardTitle>{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div>
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== 'Contact Us' && <span className="text-muted-foreground"> / month</span>}
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
                                {getButton(plan.name)}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </>
    );
};

export default PlansSection;
