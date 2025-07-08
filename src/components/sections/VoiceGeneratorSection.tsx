'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateSpeechAction } from '@/app/actions';
import { Loader, Mic, Rocket, Volume2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

const formSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters long.').max(500, 'Text cannot exceed 500 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

const VoiceGenerator = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: '',
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setAudioUrl(null);

        const { output, error } = await generateSpeechAction({ text: data.text });

        setIsLoading(false);

        if (error) {
            toast({
                title: 'Error Generating Speech',
                description: error,
                variant: 'destructive',
            });
        } else if (output?.media) {
            setAudioUrl(output.media);
            toast({
                title: 'Speech Generated Successfully!',
                description: 'Your audio is ready to be played.',
            });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">Text to Convert</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., Welcome to NextGenAI, where innovation meets imagination."
                                                className="min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                                {isLoading ? (
                                    <>
                                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Mic className="mr-2 h-5 w-5" />
                                        Generate Speech
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="w-full min-h-[400px] p-4 border-dashed bg-muted/20 flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground">
                            <Loader className="mx-auto h-16 w-16 mb-4 animate-spin"/>
                            <h3 className="text-xl mb-2 text-foreground">Synthesizing audio...</h3>
                        </div>
                    ) : audioUrl ? (
                        <div className="w-full px-4">
                            <h3 className="text-center text-xl font-semibold mb-4">Your Audio is Ready</h3>
                            <audio controls src={audioUrl} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <Volume2 className="mx-auto h-16 w-16 mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-foreground">Generated audio will appear here</h3>
                            <p>Enter some text and click "Generate Speech" to begin.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

const PremiumPlaceholder = () => (
    <div className="flex-grow flex items-center justify-center min-h-[300px]">
        <div className="text-center p-8 border-dashed border-2 rounded-lg max-w-lg mx-auto">
            <Rocket className="mx-auto h-16 w-16 text-secondary mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Upgrade to Unlock</h3>
            <p className="text-muted-foreground mb-6">
                Join our premium members to access this and many other powerful tools.
            </p>
            <Button asChild size="lg" variant="secondary">
                <Link href="/plans">View Plans & Upgrade</Link>
            </Button>
        </div>
    </div>
);


const VoiceGeneratorSection = () => {
    const { user, loading } = useAuth();
    
    // During initial load, don't show anything to prevent flicker
    if (loading) {
        return <div className="text-center"><p>Loading tool...</p></div>;
    }

    const isPremium = user && (user.plan === 'Premium' || user.plan === 'Ultra Premium');

    return (
        <section className="w-full">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-secondary">AI Voice Generator</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {isPremium ? 
                        "Convert your text into high-quality, natural-sounding audio." :
                        "This is a premium feature. Upgrade your plan to use the voice generator."
                    }
                </p>
                <div className="mt-4 inline-block glowing-underline-short" />
            </div>
            
            {isPremium ? <VoiceGenerator /> : <PremiumPlaceholder />}
        </section>
    );
};

export default VoiceGeneratorSection;
