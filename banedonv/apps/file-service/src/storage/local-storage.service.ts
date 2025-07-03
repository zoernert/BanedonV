import * as fs from 'fs';
import * as path from 'path';
import { config } from '@banedonv/shared/src/config';

export class LocalStorageService {
  private uploadPath: string;

  constructor() {
    this.uploadPath = config.fileStoragePath || '/opt/banedonv/storage/files';
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async save(filePath: string, originalName: string): Promise<string> {
    const destination = path.join(this.uploadPath, originalName);
    fs.copyFileSync(filePath, destination);
    return destination;
  }
}
