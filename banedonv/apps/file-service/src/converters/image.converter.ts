export class ImageConverter {
  async convert(filePath: string): Promise<string> {
    console.log(`Converting image: ${filePath}`);
    return 'AI-generated image description';
  }
}
