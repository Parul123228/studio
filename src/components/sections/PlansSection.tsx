
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Globe, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

const plans = [
  {
    name: "Free",
    price: "₹0",
    priceNum: 0,
    description: "For individuals starting out.",
    features: ["Art Generation", "Limited Access", "Community Support"],
    cta: "Your Current Plan",
    disabled: true,
  },
  {
    name: "Premium",
    price: "₹499",
    priceNum: 499,
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
    price: "₹999",
    priceNum: 999,
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
const UPI_NAME = "NextGenAI";

const GPayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M10.18,10.15H7.83V12.5h2.35v-2.35Z"
      fill="#34A853"
    />
    <path
      d="M12.5,7.82c0-.52-.05-1-.13-1.48H7.83v2.35h3.18c-.13,.66-.52,1.2-1.07,1.57v1.49h1.48c.83-.91,1.22-2.1,1.22-3.41Z"
      fill="#4285F4"
    />
    <path
      d="M6.76,13.24a3.7,3.7,0,0,0,2.5,1,3.79,3.79,0,0,0,2.59-1.37L10.37,11.4a2,2,0,0,1-1.22.65,2.1,2.1,0,0,1-2.1-2.1,1.75,1.75,0,0,1,.13-.76L5.3,7.63a3.84,3.84,0,0,0,0,4.28,3.63,3.63,0,0,0,1.46,1.33Z"
      fill="#FBBC04"
    />
    <path
      d="M6.76,6.29,8.23,7.77a2.11,2.11,0,0,1,3.36,1.48h1.48A3.72,3.72,0,0,0,6.76,6.29Z"
      fill="#EA4335"
    />
    <path
      d="M18.84,10.64a4.34,4.34,0,0,0-4.34-4.34,4.2,4.2,0,0,0-3.1,1.27l1.24,1.24a2.53,2.53,0,0,1,1.86-.76,2.6,2.6,0,0,1,2.6,2.6,2.53,2.53,0,0,1-2.6,2.6,2.39,2.39,0,0,1-1.87-.77L12.4,14a4.2,4.2,0,0,0,3.1,1.27,4.34,4.34,0,0,0,3.34-7.63Z"
      fill="#5F6368"
    />
  </svg>
);

const PhonePeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 256 256"
  >
    <path
      fill="#5F259F"
      d="M128 0c70.7 0 128 57.3 128 128s-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0"
    />
    <path
      fill="#FFF"
      d="M178.5 76.9c-23-14.8-51.5-12.8-72.3 5.8-25.2 22.5-27.6 59.9-5.8 85.1 21.8 25.2 59.9 27.6 85.1 5.8 25.2-21.8 27.6-59.9 5.8-85.1-12.8-15.1-31.1-23.4-49.8-23.4-1.9 0-3.8.1-5.7.3-9.5 1.1-18.7 4.5-26.8 9.9l11.4 17.6c11.7-7.9 26.6-9.9 39.7-5.1 14.8 5.4 24.9 19 25.7 34.4h-35.3c-23 0-41.6 18.6-41.6 41.6s18.6 41.6 41.6 41.6h55.6c23 0 41.6-18.6 41.6-41.6-.1-22-14.4-40-34.9-44.5zM121.7 186.2H92.2c-5.4 0-9.8-4.4-9.8-9.8s4.4-9.8 9.8-9.8h29.5c5.4 0 9.8 4.4 9.8 9.8s-4.4 9.8-9.8 9.8z"
    />
  </svg>
);

const PaytmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 206.3 62.3"><path fill="#00baf2" d="M121.2 38.3V1.6H98.6v60.7h29.3v-9.3H105v-7.1h15.8v-8.9H105v-7.2zM206.3 1.6l-20.9 60.7h-11L153.5 1.6h11.2l15.1 46.1 15.1-46.1zM58.7 49.2l-8.9-17.5-8.9 17.5H29.6l20-37.4 8.7 17.2 8.7-17.2 20 37.4zM128.3 1.6h32.4v9.2h-21.2v10.1h20.7v9.2h-20.7v10.3h21.2v9.2H128.3z"></path><path fill="#002970" d="M19.1 1.6H0v60.7h25.8v-9.3H6.4v-14h19.4v-9.2H6.4v-14h19.4v-9.3H6.4V11h12.7zM89.3 1.6l-20.9 60.7H57.1L36.2 1.6h11.2l15.1 46.1L78.1 1.6z"></path></svg>
);


const PlansSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(
    null
  );
  const { toast } = useToast();

  const handleChoosePlan = (plan: (typeof plans)[0]) => {
    if (plan.disabled) return;
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

  const upiUrl = selectedPlan
  ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedPlan.priceNum}.00&cu=INR&tn=Payment for ${selectedPlan.name} plan`
  : "";

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
                plan.name === "Premium" ? "border-primary shadow-primary/20 shadow-lg" : ""
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
                  onClick={() => handleChoosePlan(plan)}
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Upgrade to {selectedPlan.name}
              </DialogTitle>
              <DialogDescription>
                Pay <span className="font-bold text-primary">{selectedPlan.price}</span> to activate your plan.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="upi" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upi">Indian Payments (UPI)</TabsTrigger>
                <TabsTrigger value="international">International</TabsTrigger>
              </TabsList>
              <TabsContent value="upi" className="py-4">
                 <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Scan the QR or use a payment app.
                    </p>
                    <div className="p-2 border rounded-lg bg-white">
                        <Image
                        src="/upi-qr-code.png"
                        width={180}
                        height={180}
                        alt="UPI QR Code"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = 'https://placehold.co/200x200.png';
                            target.alt = 'QR Code placeholder - Add upi-qr-code.png to /public folder';
                        }}
                        data-ai-hint="qr code"
                        />
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-sm">OR</p>
                      <p className="text-sm text-muted-foreground">Click to Pay (Mobile only)</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <Button variant="outline" asChild>
                        <a href={upiUrl}><GPayIcon/></a>
                      </Button>
                       <Button variant="outline" asChild>
                        <a href={upiUrl}><PhonePeIcon/></a>
                      </Button>
                       <Button variant="outline" asChild>
                        <a href={upiUrl}><PaytmIcon/></a>
                      </Button>
                    </div>
                     <div className="flex items-center space-x-2 w-full border rounded-md p-2">
                        <p className="font-mono text-sm flex-grow">{UPI_ID}</p>
                        <Button variant="ghost" size="icon" onClick={handleCopyUpi}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="international" className="py-4">
                  <div className="flex flex-col items-center justify-center text-center space-y-4 p-4 border rounded-lg">
                      <Globe className="h-10 w-10 text-primary"/>
                      <h3 className="font-semibold">International Payments</h3>
                      <p className="text-muted-foreground text-sm">
                        For payments outside of India, please contact us directly. We will provide you with a secure payment link.
                      </p>
                      <Button asChild>
                         <a href="mailto:wantedgamingyt12@gmail.com">
                            <Mail className="mr-2 h-4 w-4"/> Contact Support
                         </a>
                      </Button>
                  </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="text-center sm:text-center flex-col items-center space-y-2">
              <p className="text-sm text-muted-foreground px-4">
                After payment, go to your profile and submit the transaction ID for verification.
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
