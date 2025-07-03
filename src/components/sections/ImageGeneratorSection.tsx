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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { generateImageAction } from "@/app/actions";
import { Loader, Wand2, Download, Save, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
  style: z.enum(["Cyberpunk", "Dreamy", "Oil Paint"]),
  size: z.enum(["1:1", "9:16", "4:3"]),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratedImage = {
  id: number;
  prompt: string;
  url: string;
};

const initialImages = [
  { id: 1, prompt: "A futuristic city skyline at dusk", url: "https://placehold.co/1024x1024.png", hint: "futuristic city" },
  { id: 2, prompt: "A mystical forest with glowing mushrooms", url: "https://placehold.co/1024x1024.png", hint: "glowing forest" },
  { id: 3, prompt: "A robot reading a book in a library", url: "https://placehold.co/1024x1024.png", hint: "robot library" },
  { id: 4, prompt: "An astronaut floating in space with nebulae", url: "https://placehold.co/1024x1024.png", hint: "astronaut space" },
  { id: 5, prompt: "A dragon flying over a mountain range", url: "https://placehold.co/1024x1024.png", hint: "dragon mountain" },
  { id: 6, prompt: "A serene beach with bioluminescent waves", url: "https://placehold.co/1024x1024.png", hint: "bioluminescent beach" },
];

const ImageGeneratorSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(
    initialImages.map(img => ({...img, url: img.url}))
  );
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
      setGeneratedImages(prev => [{ id: Date.now(), prompt: data.prompt, url: result.output!.media }, ...prev]);
      toast({
        title: "Image Generated Successfully!",
        description: "Your creation has come to life.",
      });
    }
    
    setIsLoading(false);
  };
  
  const handleSave = () => {
    toast({
        title: "Coming Soon!",
        description: "The ability to save images to your profile is coming soon."
    })
  }

  return (
    <section className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 glowing-text-accent">Create with AI</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Bring your imagination to life. Describe anything you can think of.
        </p>
        <div className="mt-4 inline-block glowing-underline-short bg-accent shadow-accent/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 p-0">
          <Card className="glass-card p-6 border-accent/30">
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
        </div>

        <div className="lg:col-span-2">
            <AnimatePresence>
                <div className="grid grid-cols-2 gap-4">
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-2"
                        >
                            <Card className="glass-card w-full aspect-square p-4 flex items-center justify-center border-dashed border-primary/20">
                                <div className="text-center">
                                    <Loader className="mx-auto h-16 w-16 text-primary/50 mb-4 animate-spin"/>
                                    <h3 className="text-xl font-headline mb-2">Generating masterpiece...</h3>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                    {generatedImages.map((image, index) => (
                    <motion.div 
                        key={image.id} 
                        className="group relative overflow-hidden rounded-lg aspect-square glowing-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                         <Image
                            src={image.url}
                            alt={image.prompt}
                            width={512}
                            height={512}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={(initialImages.find(i => i.id === image.id)?.hint) || "ai art"}
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                            <div className="flex justify-end gap-1">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="ghost" className="text-white h-8 w-8 hover:bg-white/20 hover:text-white">
                                            <ZoomIn className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl p-0 bg-transparent border-0">
                                        <DialogHeader className="sr-only">
                                          <DialogTitle>Zoomed Image</DialogTitle>
                                          <DialogDescription>{image.prompt}</DialogDescription>
                                        </DialogHeader>
                                        <Image
                                            src={image.url}
                                            alt={image.prompt}
                                            width={1024}
                                            height={1024}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </DialogContent>
                                </Dialog>
                                <Button asChild size="icon" variant="ghost" className="text-white h-8 w-8 hover:bg-white/20 hover:text-white">
                                    <a href={image.url} download={`${image.prompt.slice(0, 30).replace(/\s/g, '_') || 'ai-generated-image'}.png`}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button onClick={handleSave} size="icon" variant="ghost" className="text-white h-8 w-8 hover:bg-white/20 hover:text-white">
                                    <Save className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
                        </div>
                    </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorSection;
