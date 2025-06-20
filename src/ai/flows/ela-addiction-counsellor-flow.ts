
'use server';
/**
 * @fileOverview AI Counsellor "Ela" for addiction support.
 *
 * - elaAddictionCounsellorFlow - A function that provides responses from Ela.
 * - ElaCounsellorInput - The input type for the flow.
 * - ElaCounsellorOutput - The return type for the flow.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define a schema for individual chat messages to use in chatHistory
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Schema for a single logged instance of an addiction
const AddictionInstanceSchema = z.object({
  date: z.string().describe("Date of the logged instance (YYYY-MM-DD)."),
  quantity: z.number().nullable().optional().describe("Quantity logged, if applicable."),
  quantificationUnit: z.string().optional().describe("Unit of quantification, if applicable (e.g., Cigarettes, ML)."),
  triggers: z.string().optional().describe("User-noted triggers for this specific instance. This is crucial for personalized advice."),
});

const ElaCounsellorInputSchema = z.object({
  addictionType: z.string().describe("The specific type of addiction the user is asking about (e.g., 'Alcohol Addiction', 'Gaming Addiction')."),
  userQuery: z.string().describe("The user's current question or statement to Ela."),
  chatHistory: z.array(ChatMessageSchema).optional().describe("Previous messages in the conversation, for context. Each message has a 'role' ('user' or 'model') and 'content'."),
  addictionHistory: z.array(AddictionInstanceSchema).optional().describe("User's recent log entries for the specified addiction, including dates, quantities, and noted triggers. This should be used to personalize advice."),
});
export type ElaCounsellorInput = z.infer<typeof ElaCounsellorInputSchema>;

const ElaCounsellorOutputSchema = z.object({
  elaResponse: z.string().describe("Ela's helpful and empathetic response to the user, considering their specific triggers and history if provided."),
});
export type ElaCounsellorOutput = z.infer<typeof ElaCounsellorOutputSchema>;

export async function elaAddictionCounsellorFlow(input: ElaCounsellorInput): Promise<ElaCounsellorOutput> {
  return flow(input);
}

// System message to define Ela's persona and responsibilities
const systemMessage = `You are Ela, a compassionate and knowledgeable AI assistant. Your purpose is to provide supportive information, general coping strategies, and encouragement for users dealing with addictions. You are NOT a replacement for professional medical advice, diagnosis, or treatment.

When responding:
1.  Acknowledge the user's concern with empathy.
2.  If the user is asking about a specific addiction (like '{{addictionType}}'), tailor your information to that addiction using your general knowledge.
{{#if addictionHistory.length}}
3.  **Analyze Past Logs**: Review the provided 'addictionHistory'. This includes past dates, quantities, and user-noted triggers for '{{addictionType}}'.
    *   Acknowledge patterns if you see them. For example: "I notice from your logs that 'Stress' and 'Social Gatherings' have often been triggers for you when it comes to {{addictionType}}." or "I see you've logged {{addictionType}} on several occasions where you mentioned feeling 'Bored'."
    *   If quantities are provided, you can gently refer to them if relevant, e.g., "Sometimes when the quantity was higher, the trigger noted was 'X'."
    *   Tailor your coping strategy suggestions to address THESE SPECIFIC USER-NOTED TRIGGERS. For instance, if 'Boredom' is a frequent trigger, suggest activities to combat boredom. If 'Stress' is noted, suggest stress-management techniques.
{{else}}
3.  Provide general information about the nature of the addiction, common challenges, and recognized coping mechanisms (e.g., mindfulness, identifying triggers, importance of support systems, healthy habits).
{{/if}}
4.  Be encouraging and non-judgmental.
5.  **Crucially, ALWAYS include a disclaimer in your response like: "Remember, I'm an AI assistant and this information is for general guidance only. It's important to consult with a qualified healthcare professional or counsellor for personalized advice and treatment options."**
6.  If the user asks for specific resources, you can suggest they explore the articles and programs available on the current page, or look for local support groups and official health organization websites (e.g., SAMHSA, NHS, etc., depending on context if known, otherwise general).
7.  Keep your responses concise and easy to understand. Use paragraph breaks (\\n\\n) for readability if the response is long.
8.  Maintain a conversational tone based on the provided chat history.
{{#if chatHistory.length}}

Chat History (for context):
{{#each chatHistory}}
{{this.role}}: {{this.content}}
{{/each}}
{{/if}}
{{#if addictionHistory.length}}

Recent logs for {{addictionType}} (for your analysis):
{{#each addictionHistory}}
- On {{this.date}}: {{#if this.quantity}}Quantity: {{this.quantity}} {{this.quantificationUnit}}{{else}}Quantity not specified{{/if}}. Triggers: '{{this.triggers}}'.
{{/each}}
{{/if}}`;


const prompt = ai.definePrompt({
  name: 'elaAddictionCounsellorPrompt',
  input: { schema: ElaCounsellorInputSchema },
  output: { schema: ElaCounsellorOutputSchema },
  prompt: `${systemMessage}

User's current query about {{addictionType}}:
User: {{{userQuery}}}
Ela's Response:`,
  config: {
    temperature: 0.6, 
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
    name: 'elaAddictionCounsellorFlow',
    inputSchema: ElaCounsellorInputSchema,
    outputSchema: ElaCounsellorOutputSchema,
  },
  async (input) => {
    if (!input.addictionType) {
      return { elaResponse: "Please select an addiction type first so I can provide more relevant information. Remember, I'm an AI assistant and this information is for general guidance only. It's important to consult with a qualified healthcare professional or counsellor for personalized advice and treatment options." };
    }

    try {
      const { output } = await prompt(input);
      if (!output || !output.elaResponse) {
        console.error("[Ela Flow] AI response was empty or malformed. Input:", JSON.stringify(input, null, 2));
        return { elaResponse: "I'm having a little trouble generating a response right now. Please try again in a moment. Remember, I'm an AI assistant and this information is for general guidance only. It's important to consult with a qualified healthcare professional or counsellor for personalized advice and treatment options." };
      }
      
      const disclaimer = "Remember, I'm an AI assistant and this information is for general guidance only. It's important to consult with a qualified healthcare professional or counsellor for personalized advice and treatment options.";
      if (!output.elaResponse.includes("healthcare professional") && !output.elaResponse.includes("counsellor")) {
          // Ensure disclaimer is appended with proper spacing if missing
          if (output.elaResponse.endsWith("\n\n") || output.elaResponse.endsWith("\n")) {
            return { elaResponse: output.elaResponse + disclaimer };
          } else if (output.elaResponse.includes("\n")) {
            return { elaResponse: output.elaResponse + "\\n\\n" + disclaimer };
          } else {
            return { elaResponse: output.elaResponse + ". " + disclaimer }; // Add a period if it's a single line
          }
      }
      return output;
    } catch (error) {
      console.error("[Ela Flow] Error during prompt execution:", error, "Input:", JSON.stringify(input, null, 2));
      return { elaResponse: "Sorry, I encountered an error while trying to process your request. Please try again later. Remember, I'm an AI assistant and this information is for general guidance only. It's important to consult with a qualified healthcare professional or counsellor for personalized advice and treatment options." };
    }
  }
);
