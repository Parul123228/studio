"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address."),
});

type AuthFormProps = {
  type: "login" | "signup" | "forgot-password";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getSchema = () => {
    switch (type) {
      case "signup":
        return signupSchema;
      case "forgot-password":
        return forgotPasswordSchema;
      case "login":
      default:
        return loginSchema;
    }
  };
  
  const form = useForm<z.infer<typeof loginSchema | typeof signupSchema | typeof forgotPasswordSchema>>({
    resolver: zodResolver(getSchema()),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof form.control.getValues>) => {
    setIsLoading(true);

    if (!isFirebaseConfigured || !auth) {
      toast({
        title: "Configuration Error",
        description: "Firebase is not configured. Please contact the site administrator.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (type === "login") {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Login Successful", description: "Welcome back!" });
        router.push("/");
      } else if (type === "signup") {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Signup Successful", description: "Welcome to NextGenAI!" });
        router.push("/");
      } else if (type === "forgot-password") {
        await sendPasswordResetEmail(auth, values.email);
        toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions." });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    login: { title: "Welcome Back", description: "Sign in to continue to NextGenAI" },
    signup: { title: "Create an Account", description: "Join the future of AI with us" },
    "forgot-password": { title: "Forgot Password", description: "Enter your email to receive a reset link" },
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl text-center">{titles[type].title}</CardTitle>
        <CardDescription className="text-center">{titles[type].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type !== "forgot-password" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      {type === "login" && (
                        <Link href="/forgot-password" passHref>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                            Forgot password?
                          </Button>
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading && <Loader className="mr-2 h-5 w-5 animate-spin" />}
              {type === "login" && "Login"}
              {type === "signup" && "Create Account"}
              {type === "forgot-password" && "Send Reset Link"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          {type === "login" && (
            <p>
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          )}
          {type === "signup" && (
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
