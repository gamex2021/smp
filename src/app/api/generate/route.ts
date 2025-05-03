/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
  baseURL: "http://localhost:11434/v1", // Pointing to Ollama's local API
  apiKey: "ollama", 
})

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('llama3.2:1b'),
    messages: [
      {
        role: 'system',
        content:
          'You are an AI writing assistant that continues existing text based on context. ' +
          'You write in a professional and educational tone suitable for school announcements. ' +
          'Keep responses concise but complete.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
  console.log("this is the stream resukt",result)

  return result.toDataStreamResponse();
}
//deepseek-r1:1.5b