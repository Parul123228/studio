'use server';
/**
 * @fileOverview Suggests a trending AI tool with a short description.
 *
 * - suggestTool - A function that suggests an AI tool.
 * - SuggestToolInput - The input type for the suggestTool function.
 * - SuggestToolOutput - The return type for the suggestTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestToolInputSchema = z.object({
  userNeeds: z.string().describe('The user need or problem.'),
});
export type SuggestToolInput = z.infer<typeof SuggestToolInputSchema>;

const SuggestToolOutputSchema = z.object({
  toolName: z.string().describe('The name of the suggested AI tool.'),
  description: z.string().describe('A short description of the AI tool.'),
  category: z.string().describe('The category of the tool (e.g., AI, Art, Speech).'),
});
export type SuggestToolOutput = z.infer<typeof SuggestToolOutputSchema>;

export async function suggestTool(input: SuggestToolInput): Promise<SuggestToolOutput> {
  return suggestToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestToolPrompt',
  input: {schema: SuggestToolInputSchema},
  output: {schema: SuggestToolOutputSchema},
  prompt: `You are an expert in AI tools and their capabilities.

  A user has the following need: {{{userNeeds}}}

  Suggest a trending AI tool that can help the user with this need. Provide a short description of the tool and its category.
  Your response must be a single, valid JSON object with the following fields: "toolName", "description", and "category". Do not include any other text, explanation, or markdown formatting.
  `,
});

const suggestToolFlow = ai.defineFlow(
  {
    name: 'suggestToolFlow',
    inputSchema: SuggestToolInputSchema,
    outputSchema: SuggestToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a valid suggestion from the AI model.');
    }
    return output;
  }
);
