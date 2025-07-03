"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateSpeechAction } from "@/app/actions";
import { Loader, Mic, Download, Play, Pause } from "lucide-react";

const formSchema = z.object({
  text: z.string().min(5, "Text must be at least 5 characters long.").max(500, "Text cannot exceed 500 characters."),
});

type FormValues = z.infer<typeof formSchema>;

const VoiceGeneratorSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const handlePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setAudioUrl(null);
    setIsPlaying(false);
    
    const result = await generateSpeechAction({ text: data.text });

    if (result.error || !result.output) {
      toast({
        title: "Error Generating Speech",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    } else {
      setAudioUrl(result.output.media);
      toast({
        title: "Speech Generated Successfully!",
        description: "Your audio is ready to be played.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-secondary">AI Voice Generator</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Convert your text into high-quality, natural-sounding audio in seconds.
        </p>
        <div className="mt-4 inline-block glowing-underline-short" />
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="glass-card p-6 border-secondary/30">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Your Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hello, welcome to the future of AI-powered voice generation."
                        className="min-h-[150px] glass-card !bg-background/30 focus:border-secondary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 glowing-border bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Generate Audio
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Card>

        {audioUrl && (
            <Card className="mt-8 glass-card p-6 border-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button size="icon" onClick={handlePlayPause} className="glowing-border">
                        {isPlaying ? <Pause/> : <Play/>}
                    </Button>
                    <p className="font-semibold">Listen to your audio</p>
                </div>
                <a href={audioUrl} download="generated_speech.wav">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </a>
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
            </Card>
        )}
      </div>
    </section>
  );
};

export default VoiceGeneratorSection;
