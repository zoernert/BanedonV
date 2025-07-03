import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../../../libs/shared/src/config';

export class QdrantService {
  private client: QdrantClient;

  constructor() {
    this.client = new QdrantClient({ url: config.QDRANT_URL });
    this.initializeCollections();
  }

  private async initializeCollections() {
    try {
      // Check if collection exists, create if not
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections?.some(
        col => col.name === 'my_collection'
      );

      if (!collectionExists) {
        await this.client.createCollection('my_collection', {
          vectors: {
            size: 768, // Standard embedding size for many models
            distance: 'Cosine'
          }
        });
        console.log('Created collection: my_collection');
      }
    } catch (error) {
      console.error('Error initializing Qdrant collections:', error);
    }
  }

  async search(collectionName: string, vector: number[], limit: number) {
    try {
      return await this.client.search(collectionName, {
        vector,
        limit,
      });
    } catch (error) {
      console.error(`Search error in collection ${collectionName}:`, error);
      // Return empty results if collection doesn't exist or other errors
      return { points: [] };
    }
  }

  async deletePoints(collectionName: string, pointIds: string[]) {
    return this.client.delete(collectionName, {
      points: pointIds,
    });
  }

  async upsertPoints(collectionName: string, points: any[]) {
    return this.client.upsert(collectionName, {
      wait: true,
      points: points
    });
  }
}
