/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use server";

import { embed, generateObject, streamObject, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { ConvexHttpClient } from "convex/browser";
import { type Id } from "~/_generated/dataModel";
import ollama from "ollama";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { api } from "~/_generated/api";
import { mistral } from "@ai-sdk/mistral";

const openai = createOpenAI({
  baseURL: "http://localhost:11434/v1", // Pointing to Ollama's local API
  apiKey: "ollama",
});

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

type Flashcard = {
  flashcards: {
    id: string;
    question: string;
    answer: string;
  }[];
};

const schema = z.object({
  flashcards: z.array(
    z.object({
      id: z.string().describe("A unique identifier for the question"),
      front: z
        .string()
        .describe(`A question derived from the document content`),
      back: z.string().describe(`The answer to the question with explanation`),
    }),
  ),
});

function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true; // If parsing succeeds, return true
  } catch (e) {
    return false; // If parsing fails, return false
  }
}

export async function generateFlashcards(
  documentId: Id<"document">,
  numCards: string,
  topic: string,
) {
  "use server";

  const stream = createStreamableValue();

  //get the relevant document context to feed to the AI
  const embedding = await generateEmbeddings(topic ?? "all");

  const initialFlashCards: Flashcard = {
    flashcards: [],
  };

  // Update the stream with the initial state
  stream.update(initialFlashCards);

  //   find similar artifacts from the input embedding
  const similarDocuments = await convex.action(
    api.actions.document.similarDocuments,
    {
      embedding: embedding,
      documentId,
      limit: 20,
    },
  );

  if (!similarDocuments) {
    throw new Error("No similar documents found");
  }

  const contextPromises: Promise<string>[] = similarDocuments.map(async (a) => {
    return `title : ${a.title}, page : ${a.page},  content : (${a.content})`;
  });

  const context = (await Promise.all(contextPromises)).join("\n\n");

  //   the system message
  const systemMessage = `You are a flashcard generator. Generate exactly ${numCards} flashcards , with a question and answer, on the provided document content.
- Format your response strictly as valid JSON.
- Each flashcard must have:
    - a question
    - an answer with explanation
- Use clear and correct English.

`;

  // Create a buffer to store incoming JSON chunks
  //   let jsonBuffer = "";
  //   const currentQuiz = initialFlashCards;

  (async () => {
    const { partialObjectStream } = streamObject({
      model: mistral("mistral-small-latest"),
      system: systemMessage,
      prompt: `Generate ${numCards} flashcards from this content : ${context}, the flashcards generated must be ${numCards} in number, generate based on this : ${topic} please use english and make it understandable`,
      // maxTokens: 1000,
      schema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}

async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding("mxbai-embed-large"),
      value: text,
    });

    return embedding;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
}
