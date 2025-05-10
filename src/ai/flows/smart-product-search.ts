// src/ai/flows/smart-product-search.ts
'use server';

/**
 * @fileOverview Implements a smart product search flow using Genkit and Gemini.
 *
 * - smartProductSearch - An async function that takes a search query and returns a list of relevant product names.
 * - SmartProductSearchInput - The input type for the smartProductSearch function, which is a search query string.
 * - SmartProductSearchOutput - The output type for the smartProductSearch function, which is a list of product names.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartProductSearchInputSchema = z.object({
  query: z.string().describe('The search query provided by the user.'),
  availableProducts: z
    .array(z.string())
    .describe('A list of available product names to search through.'),
});
export type SmartProductSearchInput = z.infer<typeof SmartProductSearchInputSchema>;

const SmartProductSearchOutputSchema = z.array(z.string()).describe('A list of relevant product names.');
export type SmartProductSearchOutput = z.infer<typeof SmartProductSearchOutputSchema>;

export async function smartProductSearch(input: SmartProductSearchInput): Promise<SmartProductSearchOutput> {
  return smartProductSearchFlow(input);
}

const smartProductSearchPrompt = ai.definePrompt({
  name: 'smartProductSearchPrompt',
  input: {schema: SmartProductSearchInputSchema},
  output: {schema: SmartProductSearchOutputSchema},
  prompt: `You are a helpful shopping assistant. The user is searching for products, and you must return a list of the names of the products that are most relevant to the user's query.

  Here are the available products:
  {{#each availableProducts}}- {{{this}}}
  {{/each}}

  User's query: {{{query}}}

  Return ONLY the product names that are relevant to the user's query, in a JSON array of strings. If no products are relevant, return an empty array. Do not include any additional text.`,
});

const smartProductSearchFlow = ai.defineFlow(
  {
    name: 'smartProductSearchFlow',
    inputSchema: SmartProductSearchInputSchema,
    outputSchema: SmartProductSearchOutputSchema,
  },
  async input => {
    const {output} = await smartProductSearchPrompt(input);
    return output!;
  }
);
