import fs from 'fs';

function getFileBase64(file: Express.Multer.File): string {
    try {
        const data = fs.readFileSync(file.path);
        return data.toString('base64');
    } catch (err) {
        console.error(`Error reading file: ${file.filename}`, err);
        throw err;
    }
}

export { default as loggerMiddleware } from './logger';
export { getFileBase64 };