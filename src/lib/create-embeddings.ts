/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { embed } from "ai";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
// import { PDFDocument } from "pdf-lib";
import { createOpenAI } from "@ai-sdk/openai";
import { mistral} from "@ai-sdk/mistral";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { PDFExtract } from "pdf.js-extract";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { extractPptx } from "pptx-content-extractor";
// Set worker path for pdf.js
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

interface DocumentChunk {
  page: number;
  index: number;
  content: string;
  embedding: number[];
}

interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  minChunkSize?: number;
}

const openai = createOpenAI({
  baseURL: "http://localhost:11434/v1", // Pointing to Ollama's local API
  apiKey: "ollama",
});

export async function createDocumentChunks(
  file: File,
): Promise<DocumentChunk[]> {
  const fileType = file.type;
  const buffer = await file.arrayBuffer();
  const chunks: DocumentChunk[] = [];
  let globalIndex = 0;

  // Extract text based on file type
  const pages = await extractPages(buffer, fileType);

  // Collect all promises for embedding generation
  const embeddingPromises: Promise<DocumentChunk>[] = [];

  // Process each page
  for (let pageNum = 0; pageNum < pages.length; pageNum++) {
    const pageContent = pages[pageNum];
    if (pageContent) {
      const pageChunks = createChunksWithOverlap(pageContent, {
        maxChunkSize: 2000,
        overlap: 200,
        minChunkSize: 100,
      });

      // Generate embeddings concurrently
      for (const chunk of pageChunks) {
        embeddingPromises.push(
          generateEmbeddings(chunk).then((embedding) => ({
            page: pageNum + 1,
            index: globalIndex++,
            content: chunk,
            embedding,
          })),
        );
      }
    }
  }

  // Wait for all embeddings to be generated concurrently
  return Promise.all(embeddingPromises);
}

async function extractPages(
  buffer: ArrayBuffer,
  fileType: string,
): Promise<string[]> {
  switch (fileType) {
    case "application/pdf":
      return extractPdfPages(buffer);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocxPages(buffer);
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return extractXlsxSheets(buffer);
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return extractPptxSlides(buffer);
    default:
      throw new Error("Unsupported file type");
  }
}

// extract text by pages from the pdf
async function extractPdfPages(buffer: ArrayBuffer): Promise<string[]> {
  try {
    const pdfExtract = new PDFExtract();
    const nodeBuffer = Buffer.from(buffer);
    const options = {}; // Define appropriate options if needed
    // Await the extraction result
    const data = await pdfExtract.extractBuffer(nodeBuffer, options);

    const pages = data.pages.map((page) =>
      page.content
        .map((item) => item?.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    );

    return pages;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(String(err));
    }
  }
}

// extract text by pages from the docx
async function extractDocxPages(buffer: ArrayBuffer): Promise<string[]> {
  // Convert ArrayBuffer to Node.js Buffer
  const nodeBuffer = Buffer.from(buffer);

  // Create a temporary file path
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pptx-"));
  const tempFilePath = path.join(tempDir, `temp_${Date.now()}.pptx`);

  // Write the buffer to the temporary file
  await fs.writeFile(tempFilePath, nodeBuffer);

  const result = await mammoth.extractRawText({ path: tempFilePath });
  const text = result.value;

  // Split by page breaks (approximate)
  const pages = text
    .split(/\f|\[PAGE\]|\[page\]|\n{4,}/)
    .map((page) => page.trim())
    .filter((page) => page.length > 0);

  // Clean up: Remove the temp directory and all its files
  await fs.rm(tempDir, { recursive: true, force: true });
  return pages.length > 0 ? pages : [text];
}

async function extractXlsxSheets(buffer: ArrayBuffer): Promise<string[]> {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheets: string[] = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (sheet) {
      const text =
        XLSX.utils.sheet_to_csv(sheet) +
        "\n\n"
          .split("\n")
          .filter((line) => line.trim())
          .join("\n");

      if (text.trim()) {
        sheets.push(`Sheet: ${sheetName}\n${text}`);
      }
    }
  });
  return sheets;
}

async function extractPptxSlides(buffer: ArrayBuffer): Promise<string[]> {
  try {
    // Convert ArrayBuffer to Node.js Buffer
    const nodeBuffer = Buffer.from(buffer);

    // Create a temporary file path
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pptx-"));
    const tempFilePath = path.join(tempDir, `temp_${Date.now()}.pptx`);

    // Write the buffer to the temporary file
    await fs.writeFile(tempFilePath, nodeBuffer);

    // Extract slides using pptx-content-extractor
    const result = await extractPptx(tempFilePath);
    const slides = result.slides;

    // Clean up: Remove the temp directory and all its files
    await fs.rm(tempDir, { recursive: true, force: true });

    return slides.map(
      (slide, i) =>
        `Slide ${i + 1}:\n${slide?.name}\nNotes: ${JSON.stringify(slide.content) || ""}`,
    );
  } catch (error) {
    console.error("Error extracting PPTX slides:", error);
    return [];
  }
}

function createChunksWithOverlap(
  text: string,
  options: ChunkOptions,
): string[] {
  const { maxChunkSize = 2000, overlap = 200 } = options;

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + maxChunkSize, text.length);

    console.log(
      "Start:",
      startIndex,
      "End:",
      endIndex,
      "Total Length:",
      text.length,
      "Chunks Count:",
      chunks.length,
    );
    // Ensure chunk ends at a space for better readability
    if (endIndex < text.length) {
      let breakPoint = endIndex;
      while (breakPoint > startIndex && text[breakPoint] !== " ") {
        breakPoint--;
      }
      if (breakPoint > startIndex) {
        endIndex = breakPoint + 1;
      }
    }

    // Extract and store the chunk
    chunks.push(text.slice(startIndex, endIndex));

    // Move startIndex forward but ensure progress
    startIndex += maxChunkSize - overlap; // Instead of `endIndex - overlapSize`

    // Ensure startIndex never goes backward
    if (
      chunks.length > 0 &&
      chunks[chunks.length - 1] !== undefined &&
      startIndex <= (chunks[chunks.length - 1]?.length ?? 0)
    ) {
      startIndex = chunks[chunks.length - 1]?.length ?? startIndex;
    }
  }

  return chunks;
}

async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: mistral.embedding("mistral-embed"),
      value: text,
    });

    return embedding;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Failed to generate embeddings");
  }
}

export function validateDocument(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error:
        "Invalid file type. Only PDF, DOCX, PPTX, and XLSX files are allowed.",
    };
  }

  if (file.size > 50 * 1024 * 1024) {
    return {
      isValid: false,
      error: "File size exceeds 50MB limit.",
    };
  }

  return { isValid: true };
}

export function estimateTokenCount(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}
