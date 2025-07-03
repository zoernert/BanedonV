import { Router, Request } from 'express';
import multer from 'multer';
import { FileProcessorService } from '../../../file-service/src/file-processor.service';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();
const fileProcessorService = new FileProcessorService();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/upload', upload.single('file'), async (req: MulterRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const { path, originalname } = req.file;
  await fileProcessorService.processFile(path, originalname);
  res.json({ message: 'File uploaded and processing started' });
});

export default router;
