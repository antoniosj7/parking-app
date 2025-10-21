'use server';
/**
 * @fileOverview Summarizes the parking reservation details for a user.
 *
 * - reservationSummary - A function that generates a summary of a parking reservation.
 * - ReservationSummaryInput - The input type for the reservationSummary function.
 * - ReservationSummaryOutput - The return type for the reservationSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReservationSummaryInputSchema = z.object({
  location: z.string().describe('The parking location.'),
  duration: z.string().describe('The duration of the reservation (e.g., 2 hours).'),
  cost: z.number().describe('The total cost of the reservation.'),
  parkingSpotNumber: z.string().describe('The assigned parking spot number.'),
  userName: z.string().describe('The name of the user who made the reservation.'),
  reservationDate: z.string().describe('The date of the reservation (e.g., YYYY-MM-DD).'),
  reservationTime: z.string().describe('The time of the reservation (e.g., HH:MM).'),
});
export type ReservationSummaryInput = z.infer<typeof ReservationSummaryInputSchema>;

const ReservationSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the parking reservation details.'),
});
export type ReservationSummaryOutput = z.infer<typeof ReservationSummaryOutputSchema>;

export async function reservationSummary(input: ReservationSummaryInput): Promise<ReservationSummaryOutput> {
  return reservationSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reservationSummaryPrompt',
  input: {schema: ReservationSummaryInputSchema},
  output: {schema: ReservationSummaryOutputSchema},
  prompt: `Summarize the following parking reservation details for {{userName}}:\n\nLocation: {{location}}\nDuration: {{duration}}\nCost: ${{cost}}\nParking Spot Number: {{parkingSpotNumber}}\nDate: {{reservationDate}}\nTime: {{reservationTime}}\n\nProvide a concise and informative summary.`,
});

const reservationSummaryFlow = ai.defineFlow(
  {
    name: 'reservationSummaryFlow',
    inputSchema: ReservationSummaryInputSchema,
    outputSchema: ReservationSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
