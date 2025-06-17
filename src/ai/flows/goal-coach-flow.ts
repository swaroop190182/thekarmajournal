

'use server';
/**
 * @fileOverview An AI coach that analyzes user's karma and goal progress.
 *
 * - getGoalCoachFeedback - A function that provides analysis and suggestions.
 * - GoalCoachInput - The input type for the getGoalCoachFeedback function.
 * - GoalCoachOutput - The return type for the getGoalCoachFeedback function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import type { AiFlowDailyKarmaLog as AppDailyKarmaLog, Goal as AppGoal } from '@/app/types';


const KarmaActivitySchema = z.object({
  name: z.string(),
  type: z.string(),
  points: z.number(),
  keywords: z.array(z.string()).optional(),
  requiresPhoto: z.boolean().optional(),
  quantificationUnit: z.string().optional(),
  mediaDataUri: z.string().nullable().optional().describe("Data URI of the uploaded media, if any."),
  mediaType: z.string().nullable().optional().describe("Type of media: 'image' or 'video', if any."),
  quantity: z.number().nullable().optional(),
  triggers: z.string().optional().describe("User-noted triggers for the activity, if applicable (especially for habits/addictions)."),
});

const DailyKarmaLogSchema = z.object({
  date: z.string().describe("Date of the log in YYYY-MM-DD format."),
  activities: z.array(KarmaActivitySchema).describe("List of karma activities for the day."),
  score: z.number().describe("Total karma score for the day."),
});

const GoalSchema = z.object({
  id: z.string(),
  name: z.string().describe("Name of the goal."),
  type: z.literal('binary').describe("Type of the goal, currently only 'binary' (did it/didn't do it)."),
  createdAt: z.string().describe("ISO date string when the goal was created."),
  lastCompletedDate: z.string().nullable().optional().describe("ISO date string of the last day it was marked complete."),
  streak: z.number().describe("Current streak of consecutive days the goal was completed."),
  isCompletedToday: z.boolean().describe("Indicates if the goal is marked as completed for the current day/last logged day relevant to the analysis period."),
});

const GoalCoachInputSchema = z.object({
  karmaHistory: z.array(DailyKarmaLogSchema).describe("User's karma activity history, typically for the last 30 days. Each entry includes the date, a list of activities performed (with their names, types, points, any quantification like quantity and unit for addictions, and any user-noted triggers), and the total karma score for that day."),
  goalStatus: z.array(GoalSchema).describe("User's current goals, including their names, completion streaks, and whether they were completed recently."),
  currentDate: z.string().describe("The current date in YYYY-MM-DD format, for context.")
});
export type GoalCoachInput = z.infer<typeof GoalCoachInputSchema>;

const GoalCoachOutputSchema = z.object({
  feedbackText: z.string().describe("Personalized feedback, analysis, and suggestions from the AI coach based on the user's karma and goal progress. This should be encouraging and constructive, formatted for display with clear paragraph breaks using \\n\\n where appropriate."),
});
export type GoalCoachOutput = z.infer<typeof GoalCoachOutputSchema>;

export async function getGoalCoachFeedback(input: GoalCoachInput): Promise<GoalCoachOutput> {
  return goalCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalCoachPrompt',
  input: {schema: GoalCoachInputSchema},
  output: {schema: GoalCoachOutputSchema},
  prompt: `You are Aura, a friendly and insightful AI wellness coach. Your purpose is to help users understand their progress, identify patterns, and offer actionable advice based on their logged karma activities and goals. Your tone should be supportive, empathetic, and motivational.

Today's date is {{{currentDate}}}.

Here's a summary of the user's recent karma activities:
{{#if karmaHistory.length}}
{{#each karmaHistory}}
On {{this.date}}:
  Score: {{this.score}}
  Activities:
  {{#each this.activities}}
  - {{this.name}} ({{this.points}} points{{#if this.quantity}}, Quantity: {{this.quantity}}{{#if this.quantificationUnit}} {{this.quantificationUnit}}{{/if}}{{/if}}{{#if this.triggers}}, Triggers: "{{this.triggers}}"{{/if}}) - Type: {{this.type}}
  {{else}}
  No specific activities logged for this day.
  {{/each}}

{{/each}}
{{else}}
The user hasn't logged any karma activities in the provided history.
{{/if}}

Here's a summary of the user's current goals:
{{#if goalStatus.length}}
{{#each goalStatus}}
- Goal: "{{this.name}}"
  Streak: {{this.streak}} day(s)
  {{#if this.lastCompletedDate}}Last completed: {{this.lastCompletedDate}}.{{else}}Not completed yet.{{/if}}
  {{#if this.isCompletedToday}} (Marked as completed for today/latest relevant day).{{/if}}
{{/each}}
{{else}}
The user hasn't set any goals yet, or no goals were provided for analysis.
{{/if}}

Based on this information, please provide a concise and helpful analysis (around 3-5 paragraphs, using \\n\\n for paragraph breaks):
1.  **Overall Sentiment & Progress**: Briefly comment on the user's overall karma trend (e.g., average daily score, consistency of positive/negative days) and goal adherence. Are they generally making positive choices? Are they consistent with their goals?
2.  **Positive Highlights & Strengths**: Specifically acknowledge positive actions and consistent goal achievements. For instance, if they meditated or donated, mention that. "It's wonderful to see you consistently working on '{{goalStatus.0.name}}' and that you took time for '{{karmaHistory.0.activities.0.name}}' – these actions truly build positive momentum!" (Use actual examples from karmaHistory and goalStatus if available, otherwise generalize. Be specific about the types of positive activities if possible e.g. mindfulness, helping others, etc.).
3.  **Areas for Gentle Reflection/Improvement**: If there are negative karma patterns (especially recurring negative activities or addictions with quantities and/or triggers) or consistently missed goals, gently bring them to the user's attention. Frame this as an opportunity for growth, not criticism. For example, "I notice '{{karmaHistory.0.activities.1.name}}' (Quantity: {{karmaHistory.0.activities.1.quantity}}{{#if karmaHistory.0.activities.1.triggers}}, Triggers: '{{karmaHistory.0.activities.1.triggers}}'{{/if}}) has appeared. Reflecting on triggers for this could be helpful." or "It seems '{{goalStatus.1.name}}' has been a bit challenging lately. What small step could make it easier to tackle?" (Use actual examples, quantities, and triggers if available).
4.  **Actionable Suggestions (1-2 specific tips)**: Offer concrete, actionable advice. This could be related to managing a specific addiction (perhaps suggesting ways to avoid noted triggers), achieving a goal, or improving overall karma. For instance, "For your goal of '{{goalStatus.0.name}}', maybe try breaking it down into smaller steps?" or "To build on your positive actions, consider incorporating a short mindfulness exercise daily."
5.  **Encouragement**: End with a positive and encouraging note, reinforcing the value of their efforts. "Remember, every positive step, no matter how small, contributes to your well-being and the positive energy you bring to the world."

Keep your feedback friendly, conversational, and empathetic. Focus on empowering the user. If there's very little data, acknowledge that and offer general encouragement.
`,
});

const goalCoachFlow = ai.defineFlow(
  {
    name: 'goalCoachFlow',
    inputSchema: GoalCoachInputSchema,
    outputSchema: GoalCoachOutputSchema,
  },
  async (input) => {
    // Map triggers to an empty string if undefined before sending to the prompt,
    // or handle it in the prompt template if Handlebars supports that well for optional fields.
    // For now, ensuring it's at least an empty string if not present.
    const processedInput = {
        ...input,
        karmaHistory: input.karmaHistory.map(kh => ({
            ...kh,
            activities: kh.activities.map(act => ({
                ...act,
                triggers: act.triggers || '', // Ensure triggers is a string for the prompt
            })),
        })),
    };


    if (processedInput.karmaHistory.length === 0 && processedInput.goalStatus.length === 0) {
        return { feedbackText: "Hi there! I'm Aura, your AI wellness coach. I see you haven't logged many activities or goals yet for me to analyze. Once you start tracking your journey, I can offer more personalized feedback and support. Keep up the great work by starting small!" };
    }

    const {output} = await prompt(processedInput);
    if (!output) {
        return { feedbackText: "I'm having a little trouble generating feedback right now. Please try again in a moment!" };
    }
    return output;
  }
);

