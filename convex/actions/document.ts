/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use node";
import { v } from "convex/values";
import { action, internalQuery } from "../_generated/server";
import { type Id, type Doc } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export const similarDocuments = action({
  args: {
    embedding: v.array(v.float64()),
    documentId: v.id("document"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 2. Then search for similar foods!
    const results = await ctx.vectorSearch("documentChunk", "by_embedding", {
      vector: args.embedding,
      limit: args.limit ?? 16,
      filter: (q) => q.eq("documentId", args.documentId),
    });
    // ...

    const documents: {
      id: Id<"documentChunk">;
      title: string | undefined;
      content: string | undefined;
      page: number | undefined;
    }[] = await ctx.runQuery(internal.queries.document.fetchResults, {
      ids: results.map((result) => result._id),
    });

    return documents;
  },
});
