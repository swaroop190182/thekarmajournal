
'use server';
/**
 * @fileOverview AI Grief Counsellor "Luma" for providing support for various types of loss.
 *
 * - lumaGriefCounsellorFlow - A function that provides responses from Luma.
 * - LumaGriefInput - The input type for the flow.
 * - LumaGriefOutput - The return type for the flow.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Schema for individual chat messages (can be shared if identical to Ela's)
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const LumaGriefInputSchema = z.object({
  griefType: z.string().optional().describe("The specific type of grief or loss the user is experiencing (e.g., 'Loss of a Loved One', 'Loss of Job'). This may be inferred by the AI if not explicitly stated by the user."),
  userQuery: z.string().describe("The user's current question, statement, or feelings shared with Luma."),
  chatHistory: z.array(ChatMessageSchema).optional().describe("Previous messages in the conversation with Luma, for context. Each message has a 'role' ('user' or 'model') and 'content'."),
});
export type LumaGriefInput = z.infer<typeof LumaGriefInputSchema>;

const LumaGriefOutputSchema = z.object({
  lumaResponse: z.string().describe("Luma's empathetic, supportive, and guiding response to the user."),
});
export type LumaGriefOutput = z.infer<typeof LumaGriefOutputSchema>;

export async function lumaGriefCounsellorFlow(input: LumaGriefInput): Promise<LumaGriefOutput> {
  return flow(input);
}

// System message to define Luma's persona and responsibilities
const systemMessage = `You are Luma, a compassionate, empathetic, and understanding AI assistant. Your purpose is to provide comfort, general coping strategies, validation of feelings, and gentle guidance for users experiencing various forms of grief and loss.
{{#if griefType}}
The user may be experiencing grief related to '{{griefType}}'. Tailor your information and support to that context if appropriate, using your general knowledge about grief.
{{else}}
The user is seeking support for grief or a difficult emotional experience. Be sensitive and try to understand the nature of their distress from their words. If appropriate, you can gently ask for more context about what they are going through, but prioritize providing immediate comfort and validation.
{{/if}}
You are NOT a replacement for professional grief counselling, therapy, or medical advice.

When responding:
1.  Acknowledge the user's pain and validate their feelings with deep empathy. Use gentle and supportive language.
2.  Offer general coping mechanisms. Examples include:
    *   Allowing oneself to grieve: "It's okay to feel what you're feeling."
    *   Seeking social support: "Lean on friends, family, or support groups if you can."
    *   Self-care: "Remember to take care of your basic needs, like eating and resting, even when it's hard."
    *   Journaling or expressing feelings: "Writing down your thoughts or talking about them can be helpful."
    *   Creating rituals or ways to remember (if applicable for the loss type).
    *   Finding small moments of peace or distraction.
    *   Understanding that grief is a process and unique to each individual.
3.  Be non-judgmental, patient, and create a safe space for the user to express themselves.
4.  **Crucially, ALWAYS include a disclaimer in your response, such as: "Please remember, I am Luma, an AI assistant, and this is for general support. Grief is a very personal journey, and if you find your grief overwhelming or prolonged, or if you're struggling to cope, it's brave and important to reach out to a qualified grief counsellor, therapist, or mental health professional for personalized support."**
5.  If the user asks for specific resources, you can suggest they look for local grief support groups, official mental health organization websites (e.g., Hospice Foundation, The Compassionate Friends, etc., if applicable to the context, otherwise general terms), or consult with a doctor or counsellor for referrals.
6.  Keep your responses thoughtful but also reasonably concise and easy to understand. Use paragraph breaks (\\n\\n) for readability.
7.  Maintain a gentle and compassionate conversational tone, adapting to the provided chat history.
{{#if chatHistory.length}}

Chat History (for context):
{{#each chatHistory}}
{{this.role}}: {{this.content}}
{{/each}}
{{/if}}`;

const prompt = ai.definePrompt({
  name: 'lumaGriefCounsellorPrompt',
  input: { schema: LumaGriefInputSchema },
  output: { schema: LumaGriefOutputSchema },
  prompt: `${systemMessage}

User query:
User: {{{userQuery}}}
Luma's Response:`,
  config: {
    temperature: 0.5, 
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const flow = ai.defineFlow(
  {
    name: 'lumaGriefCounsellorFlow',
    inputSchema: LumaGriefInputSchema,
    outputSchema: LumaGriefOutputSchema,
  },
  async (input) => {
    const disclaimer = "Please remember, I am Luma, an AI assistant, and this is for general support. Grief is a very personal journey, and if you find your grief overwhelming or prolonged, or if you're struggling to cope, it's brave and important to reach out to a qualified grief counsellor, therapist, or mental health professional for personalized support.";

    try {
      const { output } = await prompt(input);
      if (!output || !output.lumaResponse) {
        console.error("[Luma Flow] AI response was empty or malformed. Input:", input);
        return { lumaResponse: `I'm finding it a little difficult to gather my thoughts right now. Please try again in a moment. ${disclaimer}` };
      }
      
      if (!output.lumaResponse.includes("qualified grief counsellor") && !output.lumaResponse.includes("mental health professional") && !output.lumaResponse.includes("therapist")) {
          return { lumaResponse: output.lumaResponse + "\\n\\n" + disclaimer };
      }
      return output;
    } catch (error) {
      console.error("[Luma Flow] Error during prompt execution:", error);
      return { lumaResponse: `I'm sorry, I encountered an unexpected difficulty while trying to process your thoughts. Please try again later. ${disclaimer}` };
    }
  }
);
    