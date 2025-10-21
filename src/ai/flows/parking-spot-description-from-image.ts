'use server';
/**
 * @fileOverview Describes a parking spot based on an image.
 *
 * - parkingSpotDescriptionFromImage - A function that handles the parking spot description process.
 * - ParkingSpotDescriptionFromImageInput - The input type for the parkingSpotDescriptionFromImage function.
 * - ParkingSpotDescriptionFromImageOutput - The return type for the parkingSpotDescriptionFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParkingSpotDescriptionFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a parking spot, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParkingSpotDescriptionFromImageInput = z.infer<typeof ParkingSpotDescriptionFromImageInputSchema>;

const ParkingSpotDescriptionFromImageOutputSchema = z.object({
  description: z.string().describe('The description of the parking spot including its size, any markings, and any restrictions.'),
});
export type ParkingSpotDescriptionFromImageOutput = z.infer<typeof ParkingSpotDescriptionFromImageOutputSchema>;

export async function parkingSpotDescriptionFromImage(input: ParkingSpotDescriptionFromImageInput): Promise<ParkingSpotDescriptionFromImageOutput> {
  return parkingSpotDescriptionFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parkingSpotDescriptionFromImagePrompt',
  input: {schema: ParkingSpotDescriptionFromImageInputSchema},
  output: {schema: ParkingSpotDescriptionFromImageOutputSchema},
  prompt: `You are an AI that describes parking spots based on images.

  Analyze the image of the parking spot and provide a detailed description, including its size, any markings, and any restrictions (e.g. compact only).

  Photo: {{media url=photoDataUri}}`,
});

const parkingSpotDescriptionFromImageFlow = ai.defineFlow(
  {
    name: 'parkingSpotDescriptionFromImageFlow',
    inputSchema: ParkingSpotDescriptionFromImageInputSchema,
    outputSchema: ParkingSpotDescriptionFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
