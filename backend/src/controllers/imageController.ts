import { log } from 'console';
import express , { Request, Response }  from 'express';
import fs from 'fs';
import path from 'path';

const imageRouter = express.Router();

imageRouter.post('/uploadImageBase64', async (req: Request, res: Response): Promise<any> => {
  try {
    const { imageBase64, filename } = req.body;
    let filenameParsed = filename.toString();
    if (!imageBase64 || !filename) {
      return res.status(400).json({ error: 'imageBase64 e filename são obrigatórios' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const extension = '.png';
    let safeFilename = filename;

    if (!filenameParsed.toLowerCase().endsWith(extension)) {
      safeFilename = filenameParsed + extension;
    }

    const filePath = path.join(uploadsDir, safeFilename);

    // Salva o arquivo
    fs.writeFileSync(filePath, buffer);
    
    // Retorna o path (ou URL se servidor serve estático)
    return res.status(200).json({ message: "Image created with success"});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error to save image' });
  }
});

export default imageRouter;
