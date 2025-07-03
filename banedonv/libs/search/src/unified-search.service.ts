import { QdrantService } from '@banedonv/apps/vector-service/src/qdrant.service';
import { EmbeddingService } from '@banedonv/apps/vector-service/src/embedding.service';
import { CacheService } from '@banedonv/shared/src/cache.service';

// Define placeholder types for results
type VectorResults = any;
type TextResults = any;
type MergedResults = any;

export class UnifiedSearchService {
  private qdrantService: QdrantService;
  private embeddingService: EmbeddingService;
  private cacheService: CacheService;

  constructor() {
    this.qdrantService = new QdrantService();
    this.embeddingService = new EmbeddingService();
    this.cacheService = new CacheService();
  }

  async semanticSearch(query: string): Promise<VectorResults> {
    const embedding = await this.embeddingService.generate(query);
    return this.qdrantService.search('my_collection', embedding, 10);
  }

  async textSearch(query: string): Promise<TextResults> {
    // Placeholder for PostgreSQL full-text search
    console.log(`Performing text search for: ${query}`);
    return { results: [] };
  }

  async hybridSearch(query: string): Promise<MergedResults> {
    const cacheKey = `hybrid_search:${query}`;
    const cachedResults = await this.cacheService.get(cacheKey);
    if (cachedResults) {
      return JSON.parse(cachedResults);
    }

    const [vectorResults, textResults] = await Promise.all([
      this.semanticSearch(query),
      this.textSearch(query),
    ]);

    const mergedResults = { ...vectorResults, ...textResults }; // Simple merge for now
    await this.cacheService.set(cacheKey, JSON.stringify(mergedResults), 3600);

    return mergedResults;
  }

  async cacheSearch(key: string, results: any): Promise<void> {
    await this.cacheService.set(key, JSON.stringify(results), 3600);
  }
}
