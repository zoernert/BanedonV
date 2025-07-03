import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import { LocalStorageService } from './storage/local-storage.service';
import { ChunkingService } from './chunking.service';
import { QdrantService } from '../../vector-service/src/qdrant.service';
import { EmbeddingService } from '../../vector-service/src/embedding.service';

export class FileProcessorService {
  private storageService: LocalStorageService;
  private chunkingService: ChunkingService;
  private qdrantService: QdrantService;
  private embeddingService: EmbeddingService;

  constructor() {
    this.storageService = new LocalStorageService();
    this.chunkingService = new ChunkingService();
    this.qdrantService = new QdrantService();
    this.embeddingService = new EmbeddingService();
  }

  async processFile(filePath: string, originalName: string): Promise<void> {
    try {
      console.log(`Processing file: ${originalName} from ${filePath}`);

      // 1. Read the file content
      const content = await fs.readFile(filePath, 'utf-8');
      console.log(`File content read: ${content.length} characters`);

      // 2. Save the file to permanent storage
      const savedPath = await this.storageService.save(filePath, originalName);
      console.log(`File saved to: ${savedPath}`);

      // 3. Convert to markdown (for text files, just use as-is)
      const markdownContent = this.convertToMarkdown(content, originalName);

      // 4. Chunk the content
      const chunks = this.chunkingService.chunk(markdownContent);
      console.log(`Content chunked into ${chunks.length} pieces`);

      // 5. Generate embeddings and index in Qdrant
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await this.embeddingService.generate(chunk);
        
        await this.qdrantService.upsertPoints('my_collection', [{
          id: randomUUID(),
          vector: embedding,
          payload: {
            filename: originalName,
            content: chunk,
            chunkIndex: i,
            timestamp: new Date().toISOString()
          }
        }]);
      }

      console.log(`Successfully processed and indexed ${originalName}`);
    } catch (error) {
      console.error(`Error processing file ${originalName}:`, error);
      throw error;
    }
  }

  private convertToMarkdown(content: string, filename: string): string {
    // For text files, just return content as-is
    if (filename.endsWith('.txt')) {
      return content;
    }
    
    // For other files, wrap in markdown
    return `# ${filename}\n\n${content}`;
  }
}
