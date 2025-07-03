'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { approveUserAction, getPendingApprovalsAction } from '@/app/actions';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface SubscriptionRequest {
  id: string;
  userEmail: string;
  transactionId: string;
  userId: string;
  planName: 'Premium' | 'Ultra Premium';
  createdAt: Date;
}

const AdminDashboard = () => {
    const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRequests = async () => {
            setIsLoading(true);
            const pendingRequests = await getPendingApprovalsAction();
            // @ts-ignore
            setRequests(pendingRequests.map(r => ({...r, createdAt: new Date(r.createdAt)})));
            setIsLoading(false);
        };
        fetchRequests();
    }, []);

    const handleApprove = async (requestId: string) => {
        const result = await approveUserAction(requestId);
        if (result.success) {
            setRequests(prev => prev.filter(req => req.id !== requestId));
            toast({ title: 'Success', description: `Request approved. The user's plan must be updated manually if not using a real database.`});
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive'});
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve premium plan requests.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending requests.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.userEmail}</TableCell>
                                    <TableCell><Badge variant={req.planName === 'Premium' ? 'default' : 'secondary'}>{req.planName}</Badge></TableCell>
                                    <TableCell>{req.transactionId}</TableCell>
                                    <TableCell>{req.createdAt.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleApprove(req.id)}>Approve</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}


export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'parul123#@') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  if (isAuthenticated) {
    return (
        <div className="container mx-auto px-4 py-16 sm:py-24">
            <AdminDashboard />
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter the password to access the admin panel.</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                    <Input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
