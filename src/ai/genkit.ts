import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GOOGLE_API_KEY) {
  // Console warning instead of throwing an error to prevent the server from crashing.
  // The actions will handle the missing key gracefully.
  console.warn(
    'GOOGLE_API_KEY environment variable not found. AI features will not work correctly.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
