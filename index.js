import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import dotenv from 'dotenv';
import ConnectToMongo from "./src/Database/connectToMongo.js"
import router from './src/routes/routes.js';

import "dotenv/config";
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




app.listen(5000, () => {
  console.log('Server running on port 5000');
});
