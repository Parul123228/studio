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
import { Loader, Wand2, Download, Save, Image as ImageIcon } from "lucide-react";

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

  // This cleans up the generated Object URLs to prevent memory leaks.
  useEffect(() => {
    return () => {
      generatedImages.forEach(image => {
        // Only revoke if it's a blob URL
        if (image.url.startsWith('blob:')) {
            URL.revokeObjectURL(image.url)
        }
      });
    };
  }, [generatedImages]);

  // Converts a base64 data URI to a Blob object
  const dataURIToBlob = (dataURI: string) => {
    if (typeof atob === 'undefined') {
        return null;
    }
    try {
        const splitDataURI = dataURI.split(',');
        if (splitDataURI.length < 2) return null;

        const byteString = atob(splitDataURI[1]);
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    } catch(e) {
        console.error("Error converting data URI to Blob:", e);
        return null;
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    
    const result = await generateImageAction({
        prompt: data.prompt,
        style: data.style
    });

    if (result.error || !result.output || !result.output.media) {
      toast({
        title: "Error Generating Image",
        description: result.error || "The AI returned an empty image. Please try again.",
        variant: "destructive",
      });
    } else {
      try {
        const mediaUrl = result.output.media;
        let finalImageUrl = mediaUrl;

        // If it's a data URI, convert it to a blob URL for performance and reliability
        if (mediaUrl.startsWith('data:image')) {
            const blob = dataURIToBlob(mediaUrl);
            if (blob) {
                finalImageUrl = URL.createObjectURL(blob);
            } else {
                // This error is critical, it means the data from the AI is corrupt
                throw new Error("Failed to process image data from AI. The data might be corrupt.");
            }
        } 
        // If it's not a data URI (e.g., https://placehold.co/...), we use it directly.

        setGeneratedImages(prev => [{ id: Date.now(), prompt: data.prompt, url: finalImageUrl }, ...prev]);
        toast({
            title: "Image Generated Successfully!",
            description: "Your creation has come to life.",
        });
        
      } catch (e) {
        console.error("Failed to process image data:", e);
        toast({
          title: "Error Displaying Image",
          description: e instanceof Error ? e.message : "Could not display the generated image.",
          variant: "destructive",
        });
      }
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
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Create with AI</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Bring your imagination to life. Describe anything you can think of.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 p-0">
          <Card className="p-6">
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

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Aspect Ratio</FormLabel>
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
                              <Label htmlFor={size} className="block w-full p-4 text-center rounded-lg border-2 border-input cursor-pointer transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:text-primary">
                                {size}
                              </Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoading && (
                    <div className="col-span-full">
                        <Card className="w-full aspect-square p-4 flex items-center justify-center border-dashed">
                            <div className="text-center">
                                <Loader className="mx-auto h-16 w-16 text-muted-foreground mb-4 animate-spin"/>
                                <h3 className="text-xl mb-2">Generating masterpiece...</h3>
                            </div>
                        </Card>
                    </div>
                )}
                {!isLoading && generatedImages.length === 0 && (
                    <div className="col-span-full">
                        <Card className="w-full min-h-[400px] lg:aspect-square p-4 flex items-center justify-center border-dashed bg-muted/20">
                            <div className="text-center text-muted-foreground">
                                <ImageIcon className="mx-auto h-16 w-16 mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-foreground">Creations will appear here</h3>
                                <p>Your generated images will be displayed in this space.</p>
                            </div>
                        </Card>
                    </div>
                )}
                {generatedImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                        <div className="aspect-square bg-muted">
                           <img
                              src={image.url}
                              alt={image.prompt}
                              className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 h-10">{image.prompt}</p>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button asChild size="icon" variant="ghost">
                                    <a href={image.url} download={`${image.prompt.slice(0, 30).replace(/\s/g, '_') || 'ai-generated-image'}.png`}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button onClick={handleSave} size="icon" variant="ghost">
                                    <Save className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorSection;
