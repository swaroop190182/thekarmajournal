
'use server';
/**
 * @fileOverview An AI flow to analyze a user's journal entries and map them to predefined karma activities.
 *
 * - analyzeJournalEntries - A function that takes journal text and a list of activities,
 *   and returns a list of identified activities with optional quantities.
 * - JournalAnalysisInput - The input type for the analyzeJournalEntries function.
 * - JournalAnalysisOutput - The return type for the analyzeJournalEntries function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import type { FlowActivity as AppFlowActivity } from '@/app/types'; // Use the new FlowActivity type

// Define the schema for the simplified activity list passed to the AI
const FlowActivityInputSchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()).optional(),
  quantificationUnit: z.string().optional(),
});

// Define the input schema for the flow
const JournalAnalysisInputSchema = z.object({
  journalText: z.string().describe("The user's combined journal entries for the day."),
  activityList: z.array(FlowActivityInputSchema).describe("A list of predefined karma activities with their names, keywords, and quantification units (if applicable)."),
  currentDate: z.string().describe("The current date for context, in YYYY-MM-DD format."),
});
export type JournalAnalysisInput = z.infer<typeof JournalAnalysisInputSchema>;

// Define the output schema for the flow
const IdentifiedActivitySchema = z.object({
  name: z.string().describe("The exact name of the identified activity from the predefined list."),
  quantity: z.number().nullable().optional().describe("The extracted quantity if the activity is quantifiable and a quantity was mentioned by the user."),
});

const JournalAnalysisOutputSchema = z.object({
  identifiedActivities: z.array(IdentifiedActivitySchema).describe("A list of activities identified from the journal text."),
});
export type JournalAnalysisOutput = z.infer<typeof JournalAnalysisOutputSchema>;


export async function analyzeJournalEntries(input: JournalAnalysisInput): Promise<JournalAnalysisOutput> {
  return journalToActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalToActivitiesPrompt',
  input: { schema: JournalAnalysisInputSchema },
  output: { schema: JournalAnalysisOutputSchema },
  prompt: `You are an AI assistant that analyzes a user's journal entry and maps it to a predefined list of activities.
Today's date is {{{currentDate}}}.

User's Journal Entry:
---
{{{journalText}}}
---

Predefined Activities (Name - Keywords - Quantification Unit if applicable):
{{#each activityList}}
- {{this.name}}{{#if this.keywords.length}} (Keywords: {{#each this.keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}{{#if this.quantificationUnit}} (Unit: {{this.quantificationUnit}}){{/if}}
{{/each}}

Based on the journal entry, identify which of the predefined activities the user performed or experienced.
- Your primary goal is to match the user's descriptions to the *exact names* in the "Predefined Activities" list.
- If an activity has a "Quantification Unit" (e.g., ML, Grams, Cigarettes, Minutes, Currency, Times, Calories), and the user mentions a specific quantity related to that activity, extract that numerical quantity. If no quantity is mentioned for a quantifiable activity, set quantity to null.
- For activities without a "Quantification Unit", the quantity should always be null.
- Be conservative. Only list activities you are reasonably sure about based on the text. Do not infer activities that are not explicitly mentioned or strongly implied.
- For example, if the user says "I had a cup of coffee", map it to "Caffeine" and quantity should be 1 if "Times" is its unit, or null if it's ambiguous. If they say "I smoked 5 cigarettes", map it to "Nicotine" with quantity 5. If they say "I helped my neighbor", map it to "Help Someone".

Output a JSON object containing a list called "identifiedActivities". Each item in the list should be an object with:
1.  'name': The exact name of the activity from the "Predefined Activities" list.
2.  'quantity': The numerical quantity if extracted, otherwise null.

Example output format:
{
  "identifiedActivities": [
    { "name": "Exercise", "quantity": null },
    { "name": "Nicotine", "quantity": 5 },
    { "name": "Help Someone", "quantity": null }
  ]
}

If no activities are clearly identified, return an empty list:
{
  "identifiedActivities": []
}
`,
});

const journalToActivitiesFlow = ai.defineFlow(
  {
    name: 'journalToActivitiesFlow',
    inputSchema: JournalAnalysisInputSchema,
    outputSchema: JournalAnalysisOutputSchema,
  },
  async (input) => {
    if (!input.activityList || input.activityList.length === 0) {
      console.warn("[Journal Flow] Activity list provided to flow was empty.");
      return { identifiedActivities: [] };
    }
    
    try {
      const { output } = await prompt(input); // Call the ai.definePrompt instance
      
      if (!output) {
        console.error("[Journal Flow] Journal analysis prompt did not return a valid Zod-parsed output. LLM output might be malformed or model call failed.");
        return { identifiedActivities: [] };
      }
      return output;
    } catch (flowError) {
      console.error("[Journal Flow] Error during prompt execution:", flowError);
      // Re-throw the error so it can be caught by the client-side caller
      throw flowError;
    }
  }
);

