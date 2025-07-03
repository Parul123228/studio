'use server';

import { generateImage, GenerateImageInput, GenerateImageOutput } from '@/ai/flows/generate-image';
import { suggestTool, SuggestToolOutput } from '@/ai/flows/suggest-tool';

export async function suggestToolsAction(): Promise<SuggestToolOutput[]> {
  try {
    const topics = ['photo realistic images', 'logos and icons', 'sci-fi concept art'];
    const suggestions = await Promise.all(
      topics.map(topic => suggestTool({ userNeeds: `A tool for ${topic}` }))
    );
    return suggestions;
  } catch (error) {
    console.error("Error suggesting tools:", error);
    return [];
  }
}

export async function generateImageAction(input: GenerateImageInput): Promise<{ output: GenerateImageOutput | null, error: string | null }> {
    try {
        const output = await generateImage(input);
        if (!output || !output.media) {
            return { output: null, error: 'Image generation failed. Please try again.' };
        }
        return { output, error: null };
    } catch (error) {
        console.error("Error generating image:", error);
        return { output: null, error: 'An unexpected error occurred during image generation.' };
    }
}
