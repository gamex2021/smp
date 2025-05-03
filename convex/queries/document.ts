import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("documentChunk")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      const document = doc?.documentId
        ? await ctx.db.get(doc.documentId)
        : null;
      if (doc === null) {
        continue;
      }
      results.push({
        id: doc._id,
        title: document?.title,
        content: doc.content,
        page: doc.page,
      });
    }
    return results;
  },
});
