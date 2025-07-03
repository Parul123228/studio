"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "For individuals starting out.",
    features: ["Art Generation", "Limited Access", "Community Support"],
    cta: "Get Started",
    ctaLoggedIn: "Your Current Plan",
    href: "/signup",
  },
  {
    name: "Premium",
    price: "Coming Soon",
    description: "For power users and professionals.",
    features: [
      "All Free features",
      "Full Access to All Tools",
      "Priority Support",
      "Higher Generation Limits",
    ],
    cta: "Coming Soon",
    href: "#",
  },
  {
    name: "Business",
    price: "Coming Soon",
    description: "For teams and businesses.",
    features: [
      "All Premium features",
      "Team Management",
      "API Access",
      "Dedicated Support",
    ],
    cta: "Coming Soon",
    href: "#",
  },
];

const PlansSection = () => {
    const { user } = useAuth();
    return (
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
                                {plan.name === 'Free' && <span className="text-muted-foreground"> / month</span>}
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
                           <Button asChild className="w-full" disabled={plan.name !== "Free" || !!user} variant={plan.name === "Premium" ? "default" : "outline"}>
                             <Link href={plan.href}>
                               {user ? 'Your Current Plan' : plan.cta}
                             </Link>
                           </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default PlansSection;
