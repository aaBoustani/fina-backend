import 'dotenv/config'
import express, { Request, Response } from 'express';
import cors from 'cors';
import upload from './middleware/upload';
import { getFileBase64 } from './lib';
import sample from '../data/sample.json';
import { loggerMiddleware } from './lib';
import { saveUpload } from './services/storage';

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
        return saveUpload(imageBase64)
            .then(id => res.status(201).json({ id }))
            .catch(error => res.status(500).json({ error: 'Error saving the image' }));
    });
});

app.get('/analysis/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    try {
        // const imageBase64 = getFileBase64(`data/uploads/${filename}`);
        // getNutritionalAnalysis(imageBase64)
        //     .then((response) => res.status(200).json(response))
        //     .catch((error) => {
        //         console.error('Error analyzing the nutritional values.', error);
        //         return res.status(500).json({ error: 'Error analyzing the nutritional values.' })
        //     });
        return res.status(200).json(sample);
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