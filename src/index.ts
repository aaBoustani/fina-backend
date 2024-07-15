import 'dotenv/config'
import express, { Request, Response } from 'express';
import cors from 'cors';
import upload from '@/middleware/upload';
import { loggerMiddleware, logger } from '@/lib';
import { saveUpload, getUploadWithAnalysis } from '@/services/storage';


const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.post('/uploads', (req: Request, res: Response) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        } else if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }
        const imageBase64 = req.file.buffer.toString('base64');
        const fileType = req.file.mimetype;
        return saveUpload(imageBase64, fileType)
            .then(id => res.status(201).json({ id }))
            .catch((error) => {
                logger.error('Error saving the image.', error);
                return res.status(500).json({ error: 'Error saving the image' })
            });
    });
});

app.get('/analysis/:uploadID', (req: Request, res: Response) => {
    const { uploadID } = req.params;
    try {
        return getUploadWithAnalysis(uploadID)
            .then((response) => res.status(200).json(response))
            .catch((error) => {
                logger.error('Error fetching the nutritional analysis.', error);
                return res.status(500).json({ error: 'Error fetching the nutritional analysis.' })
            });
    } catch (error) {
        return res.status(500).json({ error: 'Error reading the image.' });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Ok');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});