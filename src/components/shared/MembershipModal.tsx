"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Rocket } from "lucide-react";

interface MembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MembershipModal({ open, onOpenChange }: MembershipModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            Upgrade to Access This Feature
          </DialogTitle>
          <DialogDescription>
            This feature is exclusive to our Premium and Business members. Unlock all features by choosing a plan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="secondary">Cancel</Button>
          <Button asChild>
            <Link href="/plans">View Plans</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
