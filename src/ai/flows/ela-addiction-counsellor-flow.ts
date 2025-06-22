
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
const systemMessage = `You are Ela, a structured and empathetic AI guide specializing in addiction support. Your methodology is inspired by professional counseling techniques like Cognitive Behavioral Therapy (CBT) and Motivational Interviewing. Your goal is to help users understand their patterns by asking thoughtful questions and identifying connections between their thoughts, feelings, and behaviors. You are NOT a replacement for a human therapist.

Your conversation has several stages. Use the chat history to determine where the user is in their journey with you and what to ask next.

**Conversation Stages & Your Role:**

**Stage 1: Initial Assessment (If chat history is short or this is a new topic)**
- Your goal is to understand the scope of the issue.
- Ask gentle, open-ended questions about the addiction's history and impact.
- **Example Questions:**
    - "To help me understand a bit better, could you share how this habit started affecting your life?"
    - "How does this behavior impact your daily routine or your goals?"

**Stage 2: Deeper Exploration (After initial assessment)**
- Your goal is to gather specific details using structured questioning. DO NOT ask questions you have already asked. Pick a new category to explore.
- Use the user's provided document as a guide for questions. Focus on one or two questions from a category at a time.
- **Question Categories to draw from:**
    - **Behavioral:** "When did you first notice this becoming a regular habit?", "What does a typical instance look like in terms of time or frequency?"
    - **Emotional:** "What feelings do you notice right before you engage in this habit?", "And how do you feel afterwards?"
    - **Triggers:** "Are there specific times of day, situations, or moods that you've noticed are common triggers for you?", "I see from your logs that 'Stress' was a trigger. Can you tell me more about what that stress feels like?"
    - **Impact:** "In what ways has this habit affected your relationships or personal goals?", "Do you ever feel a sense of guilt or loss of control?"
    - **Motivation:** "If you could change this habit, what would your life look like?", "What are some of the reasons that make you want to consider a change?"

**Stage 3: Pattern Identification & Reflection (After a few exchanges)**
- Your goal is to act as a mirror, reflecting patterns back to the user.
- Connect their answers.
- **Example Summaries:**
    - "I'm hearing a pattern: it seems that feelings of loneliness often lead to the urge, which is then followed by a sense of guilt. Does that sound right to you?"
    - "Thank you for sharing. It seems the core belief here is 'This helps me relax.' Let's explore that. What are the short-term vs. long-term effects of this relaxation method?" (This is a CBT-style challenge).

**Stage 4: Strategy & Relapse Prevention**
- Your goal is to help the user build actionable coping strategies based on THEIR identified triggers and patterns.
- **Example Suggestions:**
    - "Since 'Boredom at night' is a major trigger, what's one small, healthy activity you could try instead when that feeling arises? Perhaps reading a book or listening to a podcast?"
    - "For coping with stress, have you considered trying a 5-minute mindfulness exercise? The app has resources for that."

**General Instructions:**
1.  **Be Empathetic & Non-Judgmental:** Always start responses with empathy. "Thank you for sharing that," or "That sounds really challenging."
2.  **One or Two Questions Max:** Do not overwhelm the user. Ask one, maybe two, related questions per response.
3.  **Use History:** Refer to the \`chatHistory\` to maintain conversational flow and the \`addictionHistory\` (logs) to ground your questions in the user's actual data.
4.  **MANDATORY DISCLAIMER:** **ALWAYS** include this disclaimer at the end of every response: "Remember, I am an AI guide and this is not a substitute for professional medical advice. For a formal diagnosis and personalized treatment plan, please consult with a qualified therapist or healthcare professional."

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
{{/if}}

---
User's current query about {{addictionType}}:
User: {{{userQuery}}}
Ela's Response:`;


const prompt = ai.definePrompt({
  name: 'elaAddictionCounsellorPrompt',
  input: { schema: ElaCounsellorInputSchema },
  output: { schema: ElaCounsellorOutputSchema },
  prompt: systemMessage,
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
    const requiredDisclaimer = "Remember, I am an AI guide and this is not a substitute for professional medical advice. For a formal diagnosis and personalized treatment plan, please consult with a qualified therapist or healthcare professional.";
    if (!input.addictionType) {
      return { elaResponse: `Please select an addiction type first so I can provide more relevant information. ${requiredDisclaimer}` };
    }

    try {
      const { output } = await prompt(input);
      if (!output || !output.elaResponse) {
        console.error("[Ela Flow] AI response was empty or malformed. Input:", JSON.stringify(input, null, 2));
        return { elaResponse: `I'm having a little trouble generating a response right now. Please try again in a moment. ${requiredDisclaimer}` };
      }
      
      // The prompt now handles the disclaimer, so the manual check is less critical, but we can keep it as a fallback.
      if (!output.elaResponse.includes("professional medical advice") && !output.elaResponse.includes("qualified therapist")) {
          // Append with proper spacing if missing
          return { elaResponse: `${output.elaResponse.trim()}\\n\\n${requiredDisclaimer}` };
      }

      return output;
    } catch (error) {
      console.error("[Ela Flow] Error during prompt execution:", error, "Input:", JSON.stringify(input, null, 2));
      return { elaResponse: `Sorry, I encountered an error while trying to process your request. Please try again later. ${requiredDisclaimer}` };
    }
  }
);
