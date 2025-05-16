import express from 'express';
import multer from 'multer';
import uploadController from '../Controllers/uploadController.js';
import { getFile } from '../Controllers/getFileController.js';
import { downloadFileInfo } from '../Controllers/downloadController.js';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadController);
router.get('/download/:fileId', downloadFileInfo);
router.get('/file/:filename', getFile);

export default router;
