export class PdfConverter {
  async convert(filePath: string): Promise<string> {
    console.log(`Converting PDF: ${filePath}`);
    return 'Converted PDF content';
  }
}
