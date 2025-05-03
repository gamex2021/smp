/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { createDocumentChunks } from "@/lib/create-embeddings";
import { ConvexHttpClient } from "convex/browser";
import { api } from "~/_generated/api";
import { type Id } from "~/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

function getFormattedFileType(mimeType: string): string {
  const typeMap: Record<string, string> = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  };
  return typeMap[mimeType] ?? "Unknown";
}

export async function uploadDocument(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const workspaceId = formData.get("workspaceId") as Id<"workspace">;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];


    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type");
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File too large");
    }

    // Upload file to Convex storage
    const generateUploadUrl = await convex.mutation(
      api.mutations.user.generateUploadUrl,
    );

    const result = await fetch(generateUploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    // Process file and generate embeddings
    const chunks = await createDocumentChunks(file);

    // console.log("the chunks", chunks);

    // Create document record
    const document = await convex.mutation(
      api.mutations.document.createWorkspaceDocument,
      {
        title: file.name,
        file: storageId,
        type: getFormattedFileType(file.type),
        size: formatFileSize(file.size),
        workspaceId,
      },
    );

    // Create document chunks with embeddings
    const results = await Promise.allSettled(
      chunks.map((chunk) =>
        convex.mutation(api.mutations.document.createDocumentChunks, {
          documentId: document,
          page: chunk.page,
          chunkIndex: chunk.index,
          content: chunk.content,
          embedding: chunk.embedding,
        }),
      ),
    );

    // Log errors if any
    // results.forEach((result, index) => {
    //   if (result.status === "rejected") {
    //     console.error(`Chunk ${index} failed:`, result.reason);
    //   }
    // });

    return { success: true, documentId: document };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: (error as Error).message };
  }
}

function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
