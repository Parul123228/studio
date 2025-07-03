"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Construction } from "lucide-react";

type AuthFormProps = {
  type: "login" | "signup" | "forgot-password";
};

export default function AuthForm({ type }: AuthFormProps) {
  const titles = {
    login: { title: "Login" },
    signup: { title: "Create an Account" },
    "forgot-password": { title: "Forgot Password" },
  };

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-3xl">{titles[type].title}</CardTitle>
        <CardDescription>This feature is currently under development.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <Construction className="h-16 w-16 text-primary/50" />
        <p className="text-muted-foreground">
            We're working hard to bring this feature to you. Please check back later!
        </p>
        <Button asChild>
            <Link href="/">Go back to Home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
