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
import { useToast } from "@/hooks/use-toast";

type AuthFormProps = {
  type: "login" | "signup" | "forgot-password";
};

// Map Firebase error codes to user-friendly messages
const getAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password. Please try again.";
        case "auth/email-already-in-use":
            return "An account with this email already exists. Please log in.";
        case "auth/weak-password":
            return "Password is too weak. It should be at least 6 characters long.";
        case "auth/operation-not-allowed":
            return "This sign-in method is not enabled. Please contact support.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}

export default function AuthForm({ type }: AuthFormProps) {
  const { login, signup, sendPasswordReset } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        buttonText: "Create Account",
        footerText: "Already have an account?",
        footerLink: "/login",
        footerLinkText: "Login"
    },
    'forgot-password': {
        title: "Forgot Password",
        description: "Enter your email to receive a password reset link.",
        buttonText: "Send Reset Link",
        footerText: "Remembered your password?",
        footerLink: "/login",
        footerLinkText: "Login"
    }
  };
  
  const config = titles[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        if (type === 'login') {
            await login(email, password);
            router.push('/dashboard');
        } else if (type === 'signup') {
            await signup(displayName, email, password);
            router.push('/dashboard');
        } else if (type === 'forgot-password') {
            await sendPasswordReset(email);
            toast({
                title: "Check your email",
                description: "If an account with that email exists, a password reset link has been sent.",
            });
            router.push('/login');
        }
    } catch (err: any) {
        console.error(err);
        setError(getAuthErrorMessage(err.code));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                    id="displayName" 
                    type="text" 
                    placeholder="Parul" 
                    required 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)}
                    disabled={isLoading}
                />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                type="email" 
                placeholder="parul@example.com" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
            />
          </div>
          {type !== 'forgot-password' && (
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    required 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                </>
            ) : (
                config.buttonText
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {config.footerText}{" "}
            <Link href={config.footerLink} className="text-primary hover:underline">
              {config.footerLinkText}
            </Link>
          </p>
          {type === 'login' && (
             <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
            </Link>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
