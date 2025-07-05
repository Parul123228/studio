"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice: string;
}

const UPI_ID = "khanparul79@ybl";
const UPI_NAME = "NextGenAI";

export default function PaymentModal({ open, onOpenChange, planName, planPrice }: PaymentModalProps) {
  const router = useRouter();
  const [hasCopied, setHasCopied] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(UPI_ID);
    setHasCopied(true);
    toast({ title: "Copied!", description: "UPI ID has been copied to your clipboard." });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const handleDone = () => {
    setIsRedirecting(true);
    onOpenChange(false);
    router.push('/profile');
  };
  
  if (!planName || !planPrice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to {planName}</DialogTitle>
          <DialogDescription>
            Pay ₹{planPrice} using any UPI app to get started.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 text-center">
            <div className="inline-block p-4 bg-white rounded-lg border">
                 <Image 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${UPI_ID}%26pn=${UPI_NAME}%26am=${planPrice}%26cu=INR`}
                    width={150}
                    height={150}
                    alt="UPI QR Code"
                    data-ai-hint="qr code"
                 />
            </div>
            <p className="mt-4 font-semibold text-lg">Scan to Pay</p>
            <p className="text-muted-foreground">OR</p>
            <div className="flex items-center justify-center gap-2 mt-2">
                <p className="font-mono text-sm bg-muted p-2 rounded-md">{UPI_ID}</p>
                <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>

        <DialogFooter className="flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground text-center">
                After payment, go to your Profile page and submit the UPI Transaction ID to activate your plan.
            </p>
            <Button onClick={handleDone} className="w-full" disabled={isRedirecting}>
              {isRedirecting ? (
                  <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                  </>
              ) : (
                  "I have paid, take me to my Profile"
              )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
