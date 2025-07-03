"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import { Loader, Wand2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
  style: z.enum(["Cyberpunk", "Dreamy", "Oil Paint"]),
  size: z.enum(["1:1", "9:16", "4:3"]),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratedImage = {
  prompt: string;
  url: string;
};

const ImageGeneratorSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "Cyberpunk",
      size: "1:1",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedImages([]);
    
    const result = await generateImageAction({
        prompt: data.prompt,
        style: data.style
    });

    if (result.error || !result.output) {
      toast({
        title: "Error Generating Image",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    } else {
      setGeneratedImages([{ prompt: data.prompt, url: result.output.media }]);
      toast({
        title: "Image Generated Successfully!",
        description: "Your creation has come to life.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <section id="generate" className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-accent">Create with AI</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Bring your imagination to life. Describe anything you can think of.
        </p>
        <div className="mt-4 inline-block glowing-underline-short bg-accent shadow-accent/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 glass-card p-6 border-accent/30">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A glowing jellyfish floating in a futuristic city"
                        className="min-h-[120px] glass-card !bg-background/30 focus:border-accent"
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
                    <FormLabel className="text-lg font-headline">Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-card !bg-background/30 focus:border-accent">
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-card">
                        <SelectItem value="Cyberpunk">Cyberpunk</SelectItem>
                        <SelectItem value="Dreamy">Dreamy</SelectItem>
                        <SelectItem value="Oil Paint">Oil Paint</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-headline">Aspect Ratio</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        {["1:1", "9:16", "4:3"].map((size) => (
                          <FormItem key={size}>
                            <FormControl>
                              <RadioGroupItem value={size} id={size} className="sr-only" />
                            </FormControl>
                            <Label htmlFor={size} className="block w-full p-4 text-center rounded-lg border-2 border-input cursor-pointer transition-all glass-card !bg-background/30 hover:border-accent has-[:checked]:border-accent has-[:checked]:glowing-border has-[:checked]:text-accent">
                              {size}
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 glowing-border bg-accent/20 text-accent-foreground hover:bg-accent/30">
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
            </form>
          </Form>
        </Card>

        <div className="lg:col-span-2">
            <Card className="glass-card w-full min-h-[500px] lg:min-h-full p-4 flex items-center justify-center border-dashed border-primary/20">
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 w-full h-full">
                    <Skeleton className="w-full aspect-square bg-primary/10" />
                </div>
            ) : generatedImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 w-full">
                    {generatedImages.map((image, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-lg">
                        <Image
                            src={image.url}
                            alt={image.prompt}
                            width={1024}
                            height={1024}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint="futuristic cyberpunk"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <p className="text-white text-sm">{image.prompt}</p>
                        </div>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">
                    <Wand2 className="mx-auto h-16 w-16 text-primary/50 mb-4"/>
                    <h3 className="text-xl font-headline mb-2">Your creations will appear here</h3>
                    <p>Fill out the form and let our AI bring your ideas to life.</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorSection;
