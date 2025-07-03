import { PrismaClient } from '@prisma/client';
import { UnifiedSearchService } from '@libs/search';

const prisma = new PrismaClient();

export class GdprService {
  private unifiedSearchService: UnifiedSearchService;

  constructor() {
    this.unifiedSearchService = new UnifiedSearchService();
  }

  async handleDataAccessRequest(userId: string): Promise<any> {
    console.log(`Handling data access request for user ${userId}`);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const files = await prisma.file.findMany({ where: { userId } });
    // In a real implementation, you would generate a report in a portable format (e.g., JSON, CSV)
    return { user, files };
  }

  async handleDataDeletionRequest(userId: string): Promise<void> {
    console.log(`Handling data deletion request for user ${userId}`);
    
    // Delete from PostgreSQL
    await prisma.user.delete({ where: { id: userId } });

    // Delete from Qdrant
    const files = await prisma.file.findMany({ where: { userId } });
    for (const file of files) {
      // This assumes a method in UnifiedSearchService to delete by metadata
      await this.unifiedSearchService.deleteCollection(file.id);
    }

    // Delete files from storage (implementation needed in LocalStorageService)
    // localStorageService.deleteUserFiles(userId);

    console.log(`Data for user ${userId} deleted successfully.`);
  }

  async handleDataPortabilityRequest(userId: string): Promise<string> {
    console.log(`Handling data portability request for user ${userId}`);
    const data = await this.handleDataAccessRequest(userId);
    // In a real implementation, this would be a structured, machine-readable format
    const portableData = JSON.stringify(data, null, 2);
    // For example, save to a file and return a URL
    return portableData;
  }
}
