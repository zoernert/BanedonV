import { Router, Request } from 'express';
import multer from 'multer';
import { FileProcessorService } from '../../../file-service/src/file-processor.service';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();
const fileProcessorService = new FileProcessorService();

router.post('/upload', async (req: MulterRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const { path, originalname } = req.file;
  await fileProcessorService.processFile(path, originalname);
  res.json({ message: 'File uploaded and processing started' });
});

export default router;
