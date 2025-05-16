
import File from "../Database/fileschema.js"
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');



const uploadController=async (req, res) => {
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
}
export default uploadController;