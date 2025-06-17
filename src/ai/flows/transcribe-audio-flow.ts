
'use server';
/**
 * @fileOverview An AI flow to transcribe audio to text.
 *
 * - transcribeAudio - A function that takes audio data URI and returns a transcript.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import { ai } from '@/ai/ai-instance'; // Ensure this path is correct for your ai instance
import { z } from 'genkit';

// Define the input schema for the flow
const TranscribeAudioInputSchema = z.object({
  audioDataUri: z.string().describe(
    "Audio data as a Data URI. Expected format: 'data:audio/<mimetype>;base64,<encoded_data>'."
  ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

// Define the output schema for the flow
const TranscribeAudioOutputSchema = z.object({
  transcript: z.string().describe("The transcribed text from the audio."),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

// This prompt assumes a model capable of understanding audio input via data URI.
// For Gemini, audio input is typically handled differently (e.g. via specific APIs or if the model version supports it directly in multimodal prompts).
// This is a simplified representation; actual implementation might require a more specific model or plugin if `gemini-2.0-flash` doesn't support this directly.
const prompt = ai.definePrompt({
  name: 'transcribeAudioPrompt',
  input: { schema: TranscribeAudioInputSchema },
  output: { schema: TranscribeAudioOutputSchema },
  prompt: `Please transcribe the following audio accurately.
Audio: {{media url=audioDataUri}}
Respond with only the transcribed text.`,
   // It's important to use a model that is confirmed to support audio transcription via this method.
   // `gemini-2.0-flash` is multimodal, but direct audio file/data URI transcription might need specific handling or model versions.
   // If direct audio transcription isn't supported by the general 'gemini-2.0-flash' in this way,
   // one would typically use a specialized speech-to-text model/API.
   // For this example, we assume the model has some capability.
   // Consider setting safetySettings to be less restrictive if transcription of varied content is expected.
   config: {
    // Example: temperature: 0.2 for more factual transcription
    // safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }] // Adjust as needed
  },
});

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    console.log("Transcribe audio flow received input audioDataUri (first 100 chars):", input.audioDataUri.substring(0,100));
    try {
      const { output } = await prompt(input); // Call the ai.definePrompt instance
      
      if (!output || typeof output.transcript !== 'string') {
        console.error("[Transcribe Flow] Transcription prompt did not return a valid transcript. LLM output might be malformed or model call failed. Output:", output);
        // Fallback or specific error handling
        return { transcript: "" }; // Or throw an error
      }
      console.log("[Transcribe Flow] Successfully transcribed. Transcript (first 100 chars):", output.transcript.substring(0,100));
      return output;
    } catch (flowError) {
      console.error("[Transcribe Flow] Error during prompt execution:", flowError);
      // Consider re-throwing or returning a specific error structure
      // For now, return empty transcript on error to prevent breaking client if AI fails
      // In a production app, you might want to throw and handle this more gracefully on client.
      // throw flowError; 
      return { transcript: "[Error during transcription]" };
    }
  }
);
