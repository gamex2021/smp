/* eslint-disable @typescript-eslint/no-floating-promises */
"use server";

import { type Id } from "~/_generated/dataModel";
import { generateEmbeddings } from "./generate-chat";
import { ConvexHttpClient } from "convex/browser";
import { api } from "~/_generated/api";
import { streamObject, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { mistral } from "@ai-sdk/mistral";
import { z } from "zod";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

// generate summaries
export async function generateSummary(id: Id<"document">, topic?: string) {
  "use server";

  const stream = createStreamableValue();

  const embedding = await generateEmbeddings(topic ?? "All");

  //  find similar artifacts from the input embedding
  const similarDocuments = await convex.action(
    api.actions.document.similarDocuments,
    {
      embedding: embedding,
      documentId: id,
      limit: topic ? 5 : 10,
    },
  );

  if (!similarDocuments) {
    throw new Error("No similar documents found");
  }

  const contextPromises: Promise<string>[] = similarDocuments.map(async (a) => {
    return `title : ${a.title}, page : ${a.page},  content : (${a.content})`;
  });

  const context = (await Promise.all(contextPromises)).join("\n\n");

  //   the stream the topic back to the user
  (async () => {
    const { textStream } = streamText({
      model: mistral("mistral-small-latest"),
      system: "You create moderate summaries on the context given to you",
      prompt: `generate the summary from this ${context}`,
      maxTokens: 700,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}

// extract topics
export async function extractTopics(id: Id<"document">) {
  "use server";

  const stream = createStreamableValue();

  const embedding = await generateEmbeddings("topics");

  //   find similar artifacts from the input embedding
  const similarDocuments = await convex.action(
    api.actions.document.similarDocuments,
    {
      embedding: embedding,
      documentId: id,
      limit: 10,
    },
  );

  if (!similarDocuments) {
    throw new Error("No similar documents found");
  }

  const contextPromises: Promise<string>[] = similarDocuments.map(async (a) => {
    return `title : ${a.title}, page : ${a.page},  content : (${a.content})`;
  });

  const context = (await Promise.all(contextPromises)).join("\n\n");

  //   the stream the topic back to the user
  (async () => {
    const { partialObjectStream } = streamObject({
      model: mistral("mistral-small-latest"),
      system: "You generate four topics from the user's document context",
      prompt: `generate four topics from this ${context}`,
      maxTokens: 500,
      schema: z.object({
        topics: z.array(
          z.object({
            title: z.string().describe("Name of the topic from the document"),
          }),
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}
