"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, BarChart, Users, LogOut } from "lucide-react";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  // Placeholder data
  const totalUsers = 1337;
  const aiRequests = 42069;

  return (
    <Card className="w-full max-w-2xl glass-card glowing-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-3xl font-headline glowing-text-primary">Admin Dashboard</CardTitle>
            <CardDescription>Welcome, Admin Parul.</CardDescription>
        </div>
        <Button variant="destructive" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4"/>
            Logout
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+10.2% from last month</p>
            </CardContent>
        </Card>
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{aiRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+25.1% from last month</p>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};


export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    // This is a simple, insecure check. In a real app, use a proper backend authentication system.
    if (values.password === "parul123#@") {
      toast({ title: "Admin Login Successful" });
      setIsLoggedIn(true);
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
  
  if (isLoggedIn) {
      return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <Card className="w-full max-w-md glass-card glowing-border border-red-500/50">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center glowing-text-destructive">Admin Access</CardTitle>
        <CardDescription className="text-center">Enter the admin password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 glowing-border" variant="destructive">
              {isLoading && <Loader className="mr-2 h-5 w-5 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
