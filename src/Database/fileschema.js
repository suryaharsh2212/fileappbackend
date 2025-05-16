import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileId: String,
  iv: String,
  filename: String,
  data: Buffer, 
  createdAt: { type: Date, default: Date.now, expires: 86400 } 
});
const File = mongoose.model('File', fileSchema);
export default File;