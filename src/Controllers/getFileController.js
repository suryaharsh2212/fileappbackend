import crypto from 'crypto';
import File from "../Database/fileschema.js"

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');


export const getFile = async (req, res) => {
  try {
    console.log("Fetching file with filename:", req.params.filename);
    
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
};
