import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Chunk by markdown headings and then use Langchain chunker if the heading chunk is too big:
export const chunkMarkdownByHeadingsAndByCharsIfBig = async (
  markdownContent: string
): Promise<string[]> => {
  const chunkSize = 500;
  const chunkOverlap = 20;
  const chunksByHeading = chunkMarkdownByHeadings(markdownContent);

  const chunksWithBigChunksSplit: string[] = [];
  const chunksWithSmallChunksSplit: string[] = [];
  chunksByHeading.forEach((chunk) => {
    if (chunk.length > chunkSize) {
      chunksWithBigChunksSplit.push(chunk);
    } else {
      chunksWithSmallChunksSplit.push(chunk);
    }
  });

  const chunkedRecursively = await chunkStringsRecursively(
    chunksWithBigChunksSplit,
    chunkSize,
    chunkOverlap
  );

  return chunksWithSmallChunksSplit.concat(chunkedRecursively);
};

export function chunkMarkdownByHeadings(markdownContent: string): string[] {
  const lines = markdownContent.split("\n");
  const chunks: string[] = [];
  let currentChunk: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith("#")) {
      if (currentChunk.length) {
        chunks.push(currentChunk.join("\n"));
        currentChunk = [];
      }
    }
    currentChunk.push(line);
  });

  if (currentChunk.length) {
    chunks.push(currentChunk.join("\n"));
  }
  return chunks;
}

export const chunkStringsRecursively = async (
  strings: string[],
  chunkSize: number,
  chunkOverlap: number
): Promise<string[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize,
    chunkOverlap: chunkOverlap,
  });

  const chunks = await splitter.createDocuments(strings);
  const mappedChunks = chunks.map((chunk) => chunk.pageContent);
  return mappedChunks;
};
