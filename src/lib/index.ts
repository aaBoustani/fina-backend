import fs from 'fs';

function getFileBase64(filePath: string): string {
    try {
        const data = fs.readFileSync(filePath);
        return data.toString('base64');
    } catch (err) {
        console.error(`Error reading file: ${filePath}`, err);
        throw err;
    }
}

export { default as loggerMiddleware } from './logger';
export { getFileBase64 }