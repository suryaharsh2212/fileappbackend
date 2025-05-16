import File from "../Database/fileschema.js";

export const downloadFileInfo = async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId });
    if (!file) return res.status(404).send('File not found');

    res.json({ filename: file.filename, iv: file.iv });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('Server error');
  }
};
