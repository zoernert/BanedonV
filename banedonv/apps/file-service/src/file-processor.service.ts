import { LocalStorageService } from './storage/local-storage.service';
import { ChunkingService } from './chunking.service';

export class FileProcessorService {
  private storageService: LocalStorageService;
  private chunkingService: ChunkingService;

  constructor() {
    this.storageService = new LocalStorageService();
    this.chunkingService = new ChunkingService();
  }

  async processFile(filePath: string, originalName: string): Promise<void> {
    // 1. Save the file
    const savedPath = await this.storageService.save(filePath, originalName);

    // 2. Convert to markdown (placeholder)
    const markdownContent = `Converted content of ${originalName}`;

    // 3. Chunk the content
    const chunks = this.chunkingService.chunk(markdownContent);

    // 4. Further processing (e.g., embedding, saving to DB)
    console.log(`Processed file ${originalName}, chunks:`, chunks);
  }
}
