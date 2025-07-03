'use server';

import { generateImage, GenerateImageInput, GenerateImageOutput } from '@/ai/flows/generate-image';
import { generateSpeech, GenerateSpeechInput, GenerateSpeechOutput } from '@/ai/flows/generate-speech';
import { suggestTool, SuggestToolOutput } from '@/ai/flows/suggest-tool';
import { revalidatePath } from 'next/cache';

// --- Mock Database for Subscription Requests ---
interface SubscriptionRequest {
  id: string;
  userEmail: string;
  transactionId: string;
  userId: string;
  createdAt: Date;
}

// In-memory store. In a real app, use a database like Firestore.
let pendingRequests: SubscriptionRequest[] = [];
let nextId = 1;
// --- End Mock Database ---

export async function submitTransactionAction(formData: FormData) {
  const transactionId = formData.get('transactionId') as string;
  const userEmail = formData.get('userEmail') as string;
  const userId = formData.get('userId') as string;

  if (!transactionId || !userEmail || !userId) {
    return { error: 'Missing required fields.' };
  }
  
  // Prevent duplicate submissions
  if (pendingRequests.some(req => req.userId === userId)) {
    return { error: 'You already have a pending submission.' };
  }

  const newRequest: SubscriptionRequest = {
    id: (nextId++).toString(),
    userEmail,
    userId,
    transactionId,
    createdAt: new Date(),
  };

  pendingRequests.push(newRequest);
  
  revalidatePath('/admin'); // To refresh the data on the admin page
  return { success: 'Your request has been submitted successfully!' };
}

export async function getPendingApprovalsAction(): Promise<SubscriptionRequest[]> {
  // Return a copy to avoid direct mutation
  return [...pendingRequests];
}

export async function approveUserAction(requestId: string) {
    const requestIndex = pendingRequests.findIndex(req => req.id === requestId);
    if (requestIndex > -1) {
        // Remove the request from the pending list
        pendingRequests.splice(requestIndex, 1);
        revalidatePath('/admin');
        return { success: true };
    }
    return { success: false, error: 'Request not found.' };
}


// Existing actions...
export async function suggestToolsAction(): Promise<SuggestToolOutput[]> {
  try {
    const topics = [
      'photo realistic images',
      'logos and icons',
      'sci-fi concept art',
      'ai-powered video creation',
      'unique music composition',
      'automated code generation',
      'summarizing long texts',
      'detecting ai-generated content',
      'real-time ai chat assistants',
    ];
    const results = await Promise.allSettled(
      topics.map(topic => suggestTool({ userNeeds: `A tool for ${topic}` }))
    );

    const suggestions = results
      .filter((result): result is PromiseFulfilledResult<SuggestToolOutput> => {
        if (result.status === 'rejected') {
          console.error("A tool suggestion failed:", result.reason);
          return false;
        }
        return true;
      })
      .map(result => result.value);

    return suggestions;
  } catch (error) {
    console.error("Error suggesting tools:", error);
    return [];
  }
}

export async function generateImageAction(input: GenerateImageInput): Promise<{ output: GenerateImageOutput | null, error: string | null }> {
    try {
        if (!process.env.GOOGLE_API_KEY) {
          return { output: null, error: 'The GOOGLE_API_KEY is not configured correctly. Please check your .env file.'}
        }
        const output = await generateImage(input);
        if (!output || !output.media) {
            return { output: null, error: 'Image generation failed. Please try again.' };
        }
        return { output, error: null };
    } catch (error) {
        console.error("Error generating image:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during image generation.';
        return { output: null, error: errorMessage };
    }
}

export async function generateSpeechAction(input: GenerateSpeechInput): Promise<{ output: GenerateSpeechOutput | null, error: string | null }> {
    try {
        const output = await generateSpeech(input);
        if (!output || !output.media) {
            return { output: null, error: 'Speech generation failed. Please try again.' };
        }
        return { output, error: null };
    } catch (error) {
        console.error("Error generating speech:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during speech generation.';
        return { output: null, error: errorMessage };
    }
}
