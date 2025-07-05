"use client";

import { useState } from "react";
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
import { Loader, Wand2, Download, Save, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
  style: z.enum(["Cyberpunk", "Dreamy", "Oil Paint"]),
});

type FormValues = z.infer<typeof formSchema>;

const ImageGeneratorSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; prompt: string } | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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

    try {
        const imageUrl = await generateImageAction({
            prompt: data.prompt,
            style: data.style,
        });

        setGeneratedImage({ url: imageUrl, prompt: data.prompt });
        toast({
            title: "Image Generated Successfully!",
            description: "Your creation has appeared.",
        });

    } catch (e) {
        console.error("An unexpected error occurred:", e);
        const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
        toast({
            title: "Error Generating Image",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSave = () => {
    toast({
        title: "Coming Soon!",
        description: "The ability to save images to your profile is coming soon."
    })
  }

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
            <Card className="w-full min-h-[500px] p-4 border-dashed bg-muted/20 flex items-center justify-center">
                {isLoading ? (
                    <div className="text-center text-muted-foreground">
                        <Loader className="mx-auto h-16 w-16 mb-4 animate-spin"/>
                        <h3 className="text-xl mb-2 text-foreground">Generating masterpiece...</h3>
                    </div>
                ) : generatedImage ? (
                    <div className="group relative overflow-hidden rounded-lg aspect-square max-w-full max-h-full">
                        <img
                            src={generatedImage.url}
                            alt={generatedImage.prompt}
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                            <p className="text-white text-xs line-clamp-3 mb-2">{generatedImage.prompt}</p>
                            <div className="flex justify-end gap-2">
                                <Button asChild size="icon" className="h-9 w-9">
                                    <a href={generatedImage.url} download={`${generatedImage.prompt.slice(0, 30).replace(/\s/g, '_') || 'ai-generated-image'}.png`}>
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
