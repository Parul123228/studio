"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, BarChart, Users, LogOut, CheckCircle } from "lucide-react";
import { getPendingVerifications, Subscription } from "@/lib/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "../ui/badge";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [pending, setPending] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingVerifications().then(data => {
      setPending(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = (userId: string) => {
    // In a real app, this would trigger a Firebase function to update the user's plan.
    alert(`Approving user: ${userId}. This will be a backend function.`);
    // You would then refetch the pending list or remove the approved item from state.
  };
  
  // Placeholder data
  const totalUsers = 1337;
  const aiRequests = 42069;

  return (
    <Card className="w-full max-w-4xl border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-3xl">Admin Dashboard</CardTitle>
            <CardDescription>Welcome, Admin Parul.</CardDescription>
        </div>
        <Button variant="destructive" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4"/>
            Logout
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+10.2% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{aiRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+25.1% from last month</p>
            </CardContent>
        </Card>
         <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
                <CardDescription>Review and approve manual UPI payments.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Loader className="animate-spin" /> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pending.length > 0 ? pending.map((item) => (
                        <TableRow key={item.userId}>
                          <TableCell className="font-medium truncate max-w-[100px]">{item.userId}</TableCell>
                          <TableCell><Badge variant="outline">{item.planType}</Badge></TableCell>
                          <TableCell className="font-mono">{item.transactionId}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => handleApprove(item.userId)}>
                              <CheckCircle className="mr-2 h-4 w-4"/> Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">No pending verifications.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Admin Access</CardTitle>
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
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6" variant="destructive">
              {isLoading && <Loader className="mr-2 h-5 w-5 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
