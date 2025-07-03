import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../../../libs/shared/src/config';

export class QdrantService {
  private client: QdrantClient;

  constructor() {
    this.client = new QdrantClient({ url: config.QDRANT_URL });
  }

  async search(collectionName: string, vector: number[], limit: number) {
    return this.client.search(collectionName, {
      vector,
      limit,
    });
  }

  async deletePoints(collectionName: string, pointIds: string[]) {
    return this.client.delete(collectionName, {
      points: pointIds,
    });
  }
}
