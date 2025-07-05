'use server';

import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image';
import { generateSpeech, GenerateSpeechInput, GenerateSpeechOutput } from '@/ai/flows/generate-speech';
import { suggestTool, SuggestToolOutput } from '@/ai/flows/suggest-tool';
import { revalidatePath } from 'next/cache';

// --- Mock Database for Subscription Requests ---
interface SubscriptionRequest {
  id: string;
  userEmail: string;
  transactionId: string;
  userId: string;
  planName: 'Premium' | 'Ultra Premium';
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
  const planName = formData.get('planName') as 'Premium' | 'Ultra Premium';

  if (!transactionId || !userEmail || !userId || !planName) {
    return { error: 'Missing required fields.' };
  }
  
  if (pendingRequests.some(req => req.userId === userId)) {
    return { error: 'You already have a pending submission.' };
  }

  const newRequest: SubscriptionRequest = {
    id: (nextId++).toString(),
    userEmail,
    userId,
    transactionId,
    planName,
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
        // In a real application, you would update the user's plan in your main database here.
        // For this mock application, we are just removing the request from the pending list.
        // The user's plan will not be automatically upgraded on the client-side.
        pendingRequests.splice(requestIndex, 1);
        revalidatePath('/admin');
        return { success: true };
    }
    return { success: false, error: 'Request not found.' };
}


// Existing actions...
export async function suggestToolsAction(): Promise<SuggestToolOutput[]> {
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY.includes('YOUR_')) {
    console.warn("Google API Key not configured. Skipping tool suggestions.");
    return [];
  }
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

export async function generateImageAction(input: GenerateImageInput): Promise<{ imageUrl?: string; error?: string }> {
  // Handle case where API key is not configured
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY.includes('YOUR_')) {
    console.warn('AI features are disabled. GOOGLE_API_KEY is not configured. Returning a placeholder.');
    // To avoid breaking the UI, we return a placeholder image instead of an error.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate generation time
    return { imageUrl: 'https://placehold.co/1024x1024.png' };
  }

  // Handle case where API key is configured
  try {
    const output = await generateImage(input);

    if (!output || !output.media || !output.media.startsWith('data:image')) {
       return { error: 'The AI model did not return a valid image. Please try a different prompt.' };
    }

    // Return the media URL directly on success
    return { imageUrl: output.media };
    
  } catch (error) {
    console.error('Error in generateImageAction:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred during image generation.';
    return { error: errorMessage };
  }
}

export async function generateSpeechAction(input: GenerateSpeechInput): Promise<{ output: GenerateSpeechOutput | null, error: string | null }> {
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY.includes('YOUR_')) {
        const error = 'AI features are disabled because the Google API Key is not configured.';
        console.warn(error);
        return { output: null, error };
    }

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
