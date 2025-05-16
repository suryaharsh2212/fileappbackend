import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import ConnectToMongo from "./src/Database/connectToMongo.js"
import router from './src/routes/routes.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

const app = express();
app.use(cors({
    origin: ['*'],  
    credentials: true
}));
app.use(express.json());






ConnectToMongo();



app.use("/api",router)



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


// app.get('/file/:filename', async (req, res) => {
//   try {
//     const file = await File.findOne({ filename: req.params.filename });
//     if (!file) return res.status(404).send('File not found');

//     const decipher = crypto.createDecipheriv(
//       algorithm,
//       secretKey,
//       Buffer.from(file.iv, 'hex')
//     );

//     const decryptedData = Buffer.concat([
//       decipher.update(file.data),
//       decipher.final()
//     ]);

//     res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
//     res.send(decryptedData);
//   } catch (error) {
//     console.error('File fetch error:', error);
//     res.status(500).send('Server error');
//   }
// });


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
