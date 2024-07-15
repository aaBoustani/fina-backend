import { insertUpload, fetchUpload } from '@/db/queries';
import { InsertUpload } from '@/types';
import { analyzeAndSave } from './analysis';
import { logger, BackendError } from '@/lib';


async function saveUpload(imageBase64: string, fileType: string) {
    logger.debug('Saving the upload');
    const image = `data:image/${fileType};base64,${imageBase64}`;
    let upload;
    try {
        upload = await insertUpload({ image } as InsertUpload);
    } catch (error) {
        throw new BackendError(`Error saving the upload: ${error}`);
    }
    if (!upload) {
        throw new BackendError('insertUpload returned empty result');
    }
    logger.debug(`Upload saved with id ${upload.id}`);
    try {
        logger.debug(`Analyzing and saving the upload with id ${upload.id}`);
        await analyzeAndSave(upload);
        logger.info(`Analysis saved for upload with id ${upload.id}`);
    } catch (error) {
        logger.error(`saveUpload: Could not analyze and save the upload with id ${upload.id}`);
        throw new BackendError(`Error analyzing and saving the upload: ${error}`);
    }
    return upload.id;
}

async function getUploadWithAnalysis(uploadId: string) {
    try {
        const upload = await fetchUpload(uploadId, true);
        return upload;
    } catch (error) {
        throw new BackendError(`Error getting the upload: ${error}`);
    }
}


export {
    saveUpload,
    getUploadWithAnalysis,
};