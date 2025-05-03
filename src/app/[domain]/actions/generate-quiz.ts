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

type Quiz = {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
};

const schema = z.object({
  id: z.string().describe("A unique identifier for the question"),
  title: z.string().describe("the title"),
  questions: z.array(
    z.object({
      id: z.string().describe("A unique identifier for the question"),
      question: z
        .string()
        .describe(`A question derived from the document content`),
      options: z
        .array(z.string())
        .describe("Multiple choice options for the question"),
      correctAnswer: z
        .number()
        .describe("Index of the correct answer in the options array"),
      explanation: z.string().describe("the explanation for the answer"),
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

export async function generate(documentId: Id<"document">, question: string) {
  "use server";

  const stream = createStreamableValue();

  //get the relevant document context to feed to the AI
  const embedding = await generateEmbeddings("all");

  const initialQuiz: Quiz = {
    id: "initial-id",
    title: `Quiz on the document`,
    questions: [],
  };

  // Update the stream with the initial state
  stream.update(initialQuiz);

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
  const systemMessage = `You are a quiz generator. Generate exactly ${question} multiple-choice questions based on the provided document content.
- Format your response strictly as valid JSON.
- Each question must have:
  - A unique ID
  - A clear question derived from the document
  - Four understandable answer options
  - The correct answer’s index in the options array starting 0
  - A brief explanation for why the answer is correct.
- Ensure the explanation always matches the correct answer.
- Use clear and correct English.

`;

  // Create a buffer to store incoming JSON chunks
  //   let jsonBuffer = "";
  //   const currentQuiz = initialQuiz;

  (async () => {
    const { partialObjectStream } = streamObject({
      model: mistral("mistral-small-latest"),
      system: systemMessage,
      prompt: `Generate ${question} questions from this content : ${context}, the questions generated must be ${question} in number, please use english and make it understandable`,
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
