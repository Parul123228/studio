"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateImageAction } from "@/app/actions";
import { Loader, Wand2, Download, Save, Image as ImageIcon, ArrowLeft, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
  style: z.enum(["Cyberpunk", "Dreamy", "Oil Paint"]),
});

type FormValues = z.infer<typeof formSchema>;

const FREE_GENERATION_LIMIT = 4;

const PremiumPlaceholder = () => (
    <div className="text-center p-8 border-dashed border-2 rounded-lg max-w-lg mx-auto">
        <Rocket className="mx-auto h-16 w-16 text-primary mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Free Limit Reached</h3>
        <p className="text-muted-foreground mb-6">
            You've used all your free image generations. Upgrade to create unlimited art.
        </p>
        <Button asChild size="lg">
            <Link href="/plans">View Plans & Upgrade</Link>
        </Button>
    </div>
);


const ImageGeneratorSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const isFreePlan = user?.plan === 'Free' || !user;
  const isLocked = isFreePlan && generationCount >= FREE_GENERATION_LIMIT;

  useEffect(() => {
    if (isFreePlan) {
      const storedCount = localStorage.getItem('nextgenai-free-generations');
      setGenerationCount(storedCount ? parseInt(storedCount, 10) : 0);
    }
  }, [isFreePlan]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "Cyberpunk",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedImage(null); // Clear previous image

    const result = await generateImageAction({
        prompt: data.prompt,
        style: data.style,
    });

    setIsLoading(false);

    if (result.error) {
        toast({
            title: "Error Generating Image",
            description: result.error,
            variant: "destructive",
        });
    } else if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast({
            title: "Image Generated Successfully!",
            description: "Your creation has appeared.",
        });

        if (isFreePlan) {
          const newCount = generationCount + 1;
          setGenerationCount(newCount);
          localStorage.setItem('nextgenai-free-generations', newCount.toString());
        }
    }
  };
  
  const handleSave = () => {
    toast({
        title: "Coming Soon!",
        description: "The ability to save images to your profile is coming soon."
    })
  }
  
  const currentPrompt = form.getValues("prompt");

  return (
    <section className="w-full">
      <div className="relative mb-12">
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="absolute -left-4 -top-8 md:-left-2 md:-top-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Create with AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bring your imagination to life. Describe anything you can think of.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 p-0">
          <Card className="p-6">
            { isLocked ? (
              <PremiumPlaceholder />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Your Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A glowing jellyfish floating in a futuristic city"
                            className="min-h-[120px] focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:border-primary">
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cyberpunk">Cyberpunk</SelectItem>
                            <SelectItem value="Dreamy">Dreamy</SelectItem>
                            <SelectItem value="Oil Paint">Oil Paint</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                      {isLoading ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" />
                          Generate
                        </>
                      )}
                    </Button>
                    {isFreePlan && (
                      <p className="text-center text-sm text-muted-foreground">
                        {Math.max(0, FREE_GENERATION_LIMIT - generationCount)} free generations remaining.
                      </p>
                    )}
                  </div>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="w-full min-h-[500px] p-4 border-dashed bg-muted/20 flex items-center justify-center">
                {isLoading ? (
                    <div className="text-center text-muted-foreground">
                        <Loader className="mx-auto h-16 w-16 mb-4 animate-spin"/>
                        <h3 className="text-xl mb-2 text-foreground">Generating masterpiece...</h3>
                    </div>
                ) : generatedImage ? (
                    <div className="group relative overflow-hidden rounded-lg aspect-square max-w-full max-h-full">
                        <img
                            src={generatedImage}
                            alt={currentPrompt}
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                            <p className="text-white text-xs line-clamp-3 mb-2">{currentPrompt}</p>
                            <div className="flex justify-end gap-2">
                                <Button asChild size="icon" className="h-9 w-9">
                                    <a href={generatedImage} download={`${currentPrompt.slice(0, 30).replace(/\s/g, '_') || 'ai-generated-image'}.png`}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button onClick={handleSave} size="icon" className="h-9 w-9">
                                    <Save className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-16 w-16 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-foreground">Creations will appear here</h3>
                        <p>Your generated images will be displayed in this space.</p>
                    </div>
                )}
            </Card>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorSection;
