import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '@banedonv/shared/src/config';

export class QdrantService {
  private client: QdrantClient;

  constructor() {
    this.client = new QdrantClient({ url: config.qdrantUrl });
  }

  async search(collectionName: string, vector: number[], limit: number) {
    return this.client.search(collectionName, {
      vector,
      limit,
    });
  }
}
