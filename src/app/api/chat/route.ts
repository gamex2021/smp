/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

const openai = createOpenAI({
  baseURL: "http://localhost:11434/v1", // Pointing to Ollama's local API
  apiKey: "ollama",
});

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid input: messages must be a non-empty array", {
        status: 400,
      });
    }

    const result = streamText({
      model: openai("llama3.2:1b"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
      system: `You are an AI assistant helping with analysing a study document and answering question about the document from the given context, helping the student study.  Provide detailed and relevant answers based on the context provided. the context : ${context}, you can use that to generate a proper response`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
