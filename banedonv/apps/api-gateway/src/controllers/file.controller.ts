import { Router } from 'express';
import { FileProcessorService } from '@banedonv/file-service/src/file-processor.service';

const router = Router();
const fileProcessorService = new FileProcessorService();

router.post('/upload', async (req, res) => {
  // Assuming file is uploaded and available at req.file.path
  const { path, originalname } = req.file;
  await fileProcessorService.processFile(path, originalname);
  res.json({ message: 'File uploaded and processing started' });
});

export default router;
