export class ChunkingService {
  chunk(text: string, chunkSize = 1000, overlap = 200): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }
}
