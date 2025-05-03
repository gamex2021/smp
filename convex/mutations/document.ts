import { v } from "convex/values";
import { mutation } from "../_generated/server";

// create a new document
export const createWorkspaceDocument = mutation({
  args: {
    title: v.string(),
    file: v.id("_storage"),
    type: v.string(), //pdf, //docx , //pptx
    size: v.string(),
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    // create a new workspace
    const workspaceDocument = await ctx.db.insert("document", {
      title: args.title,
      file: args.file,
      type: args.type,
      size: args.size,
      workspaceId: args.workspaceId,
      uploadedAt: new Date().toISOString(),
    });

    return workspaceDocument;
  },
});

// crreate the document chunks
export const createDocumentChunks = mutation({
  args: {
    documentId: v.id("document"),
    page: v.number(),
    chunkIndex: v.number(),
    content: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const documentChunks = await ctx.db.insert("documentChunk", {
      documentId: args.documentId,
      page: args.page,
      chunkIndex: args.chunkIndex,
      content: args.content,
      embedding: args.embedding,
    });

    return documentChunks;
  },
});
