"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";

type AuthFormProps = {
  type: "login" | "signup";
};

export default function AuthForm({ type }: AuthFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const titles = {
    login: { 
        title: "Welcome Back!",
        description: "Log in to access your dashboard and projects.",
        buttonText: "Login",
        footerText: "Don't have an account?",
        footerLink: "/signup",
        footerLinkText: "Sign Up"
    },
    signup: { 
        title: "Create an Account",
        description: "Join NextGenAI to start creating with the future of AI.",
        buttonText: "Sign Up",
        footerText: "Already have an account?",
        footerLink: "/login",
        footerLinkText: "Login"
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, you'd handle form data. Here, we just log in the mock user.
    login();
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">{titles[type].title}</CardTitle>
        <CardDescription>{titles[type].description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="parul@example.com" required defaultValue="parul@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required defaultValue="password123" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                </>
            ) : (
                titles[type].buttonText
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {titles[type].footerText}{" "}
            <Link href={titles[type].footerLink} className="text-primary hover:underline">
              {titles[type].footerLinkText}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
