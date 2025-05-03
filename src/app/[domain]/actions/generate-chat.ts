/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use server";
import { createOpenAI } from "@ai-sdk/openai";

import { embed } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "~/_generated/api";
import { type Id } from "~/_generated/dataModel";

const openai = createOpenAI({
  baseURL: "http://localhost:11434/v1", // Pointing to Ollama's local API
  apiKey: "ollama",
});

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

type Chunk = {
  id: Id<"documentChunk">;
  title: string | undefined;
  content: string | undefined;
  page: number | undefined;
};

export async function generateDocumentChat(
  input: string,
  id: Id<"document">,
) {
  // get the embedding from the input
  const embedding = await generateEmbeddings(input);
  //   find similar artifacts from the input embedding
  const similarDocuments = await convex.action(
    api.actions.document.similarDocuments,
    {
      embedding: embedding,
      documentId: id,
      limit : 4
    },
  );

  if (!similarDocuments) {
    throw new Error("No similar documents found");
  }

  const contextPromises: Promise<string>[] = similarDocuments.map(async (a) => {
    return `title : ${a.title}, page : ${a.page},  content : (${a.content})`;
  });

  const context = (await Promise.all(contextPromises)).join("\n\n");

  return context;
}

// function to generate embeddings
export async function generateEmbeddings(text: string): Promise<number[]> {
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
