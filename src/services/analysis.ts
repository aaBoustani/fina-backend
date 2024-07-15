import { fetchUpload, insertAnalysis } from '@/db/queries';
import { askNutritionalAnalysis } from '@/services/langchain';
import { logger, BackendError } from '@/lib';
import {
    Upload,
    InsertUpload,
    Analysis,
} from '@/types';


async function analyzeAndSave(upload: InsertUpload) {
    if (!upload) {
        throw new BackendError(`No upload provided`);
    }
    if (!upload.id) {
        throw new BackendError(`Upload with no id`);
    }
    if (!upload.image) {
        throw new BackendError(`Upload with id ${upload.id} has no image`);
    }
    const newAnalysis = await askNutritionalAnalysis(upload.image);
    logger.info(`Analysis for upload with id ${upload.id} generated.`);
    return insertAnalysis(newAnalysis, upload.id);
}

async function generateAnalysis(uploadId: string) {
    logger.info(`Analyzing image with id ${uploadId}`);
    let upload: Upload | null = null;
    try {
        upload = await fetchUpload(uploadId);
    } catch (error) {
        throw new BackendError(`Error fetching the upload: ${error}`);
    }
    if (!upload) {
        throw new BackendError(`Upload with id ${uploadId} not found`);
    }
    return analyzeAndSave(upload);
}


export {
    generateAnalysis,
    analyzeAndSave,
};
