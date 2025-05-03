/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Function to extract plain text from rich text editor JSON
export function extractTextFromEditorJSON(jsonData: any[]) {
  let plainText = "";

  // Handle array of blocks
  if (Array.isArray(jsonData)) {
    jsonData.forEach((block) => {
      // Extract text from each block's content
      if (block.content && Array.isArray(block.content)) {
        block.content.forEach((contentItem: { type: string; text: string }) => {
          if (contentItem.type === "text" && contentItem.text) {
            plainText += contentItem.text;
          }
        });
      }
      // Add a newline after each block
      plainText += "\n\n";
    });
  }

  return plainText.trim();
}
