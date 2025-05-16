import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); 


async function ConnectToMongo() {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`, );
    console.log('Database connected successfully');
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
  }
}
ConnectToMongo();


const fileSchema = new mongoose.Schema({
  fileId: String,
  iv: String,
  filename: String,
  data: Buffer, 
  createdAt: { type: Date, default: Date.now, expires: 86400 } 
});
const File = mongoose.model('File', fileSchema);


const storage = multer.memoryStorage();
const upload = multer({ storage });


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { fileId } = req.body;
    const iv = crypto.randomBytes(16);

    const fileBuffer = req.file.buffer;

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encryptedData = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

    await File.create({
      fileId,
      iv: iv.toString('hex'),
      filename: req.file.originalname,
      data: encryptedData
    });

    res.json({ message: 'Encrypted & Uploaded successfully', fileId });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});


app.get('/download/:fileId', async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId });
    if (!file) return res.status(404).send('File not found');

    res.json({ filename: file.filename, iv: file.iv });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('Server error');
  }
});


app.get('/file/:filename', async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).send('File not found');

    const decipher = crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(file.iv, 'hex')
    );

    const decryptedData = Buffer.concat([
      decipher.update(file.data),
      decipher.final()
    ]);

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(decryptedData);
  } catch (error) {
    console.error('File fetch error:', error);
    res.status(500).send('Server error');
  }
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
