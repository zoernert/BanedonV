export class DocxConverter {
  async convert(filePath: string): Promise<string> {
    console.log(`Converting DOCX: ${filePath}`);
    return 'Converted DOCX content';
  }
}
