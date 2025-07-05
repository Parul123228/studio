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

type GeneratedImage = {
  id: number;
  prompt: string;
  url: string;
};

const ImageGeneratorSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
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

    try {
        const result = await generateImageAction({
            prompt: data.prompt,
            style: data.style,
        });

        if (result.error || !result.output || !result.output.media) {
            toast({
                title: "Error Generating Image",
                description: result.error || "The AI returned an empty or invalid image. Please try a different prompt.",
                variant: "destructive",
            });
        } else {
            const newImage: GeneratedImage = { id: Date.now(), prompt: data.prompt, url: result.output.media };
            setGeneratedImages(prevImages => [newImage, ...prevImages]);
            toast({
                title: "Image Generated Successfully!",
                description: "Your creation has been added to the gallery.",
            });
        }
    } catch (e) {
        console.error("An unexpected error occurred:", e);
        toast({
            title: "An Unexpected Error Occurred",
            description: "Something went wrong on our end. Please try again later.",
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
            <Card className="w-full min-h-[500px] max-h-[70vh] p-4 border-dashed bg-muted/20">
                {generatedImages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        {isLoading ? (
                            <div className="text-center text-muted-foreground">
                                <Loader className="mx-auto h-16 w-16 mb-4 animate-spin"/>
                                <h3 className="text-xl mb-2 text-foreground">Generating masterpiece...</h3>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <ImageIcon className="mx-auto h-16 w-16 mb-4" />
                                <h3 className="text-xl font-semibold mb-2 text-foreground">Creations will appear here</h3>
                                <p>Your generated images will be displayed in this space.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isLoading && (
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                    <Loader className="h-10 w-10 animate-spin text-muted-foreground"/>
                                </div>
                            )}
                            {generatedImages.map((image) => (
                                <div key={image.id} className="group relative overflow-hidden rounded-lg aspect-square">
                                    <img
                                        src={image.url}
                                        alt={image.prompt}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                      <p className="text-white text-xs line-clamp-3 mb-2">{image.prompt}</p>
                                      <div className="flex justify-end gap-2">
                                        <Button asChild size="icon" className="h-9 w-9">
                                            <a href={image.url} download={`${image.prompt.slice(0, 30).replace(/\s/g, '_') || 'ai-generated-image'}.png`}>
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button onClick={handleSave} size="icon" className="h-9 w-9">
                                            <Save className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
      </div>
    </section>
  );
};

export default ImageGeneratorSection;
