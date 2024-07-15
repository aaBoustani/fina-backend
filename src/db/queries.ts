import { uploadTable, analysisTable } from './schema';
import { Analysis, Upload, InsertUpload, SelectUpload } from '@/types';
import { db } from './index';
import { eq } from 'drizzle-orm';


async function insertUpload(upload: InsertUpload): Promise<SelectUpload> {
    return db.insert(uploadTable)
        .values(upload)
        .returning()
        .then(result => result[0] as SelectUpload);
}

async function fetchUpload(uploadId: string, populateAnalysis: boolean = false): Promise<Upload | null> {
    return db.query.uploadTable.findFirst({
        with: populateAnalysis ? { analysis: true } : undefined,
        where: (uploadTable, { eq }) => (eq(uploadTable.id, uploadId))
    }).then((result) => result as Upload);
}

async function insertAnalysis(analysis: Analysis, uploadId: string) {
    const upsertObject = Object.keys(analysis)
        .reduce((acc, key) => key === 'id' ? acc : { ...acc, [key]: analysis[key] }, {});
    return db.transaction(async (tx) => {
        const savedAnalysis: Analysis = await tx.insert(analysisTable)
            .values([analysis])
            .onConflictDoUpdate({ target: analysisTable.id, set: upsertObject })
            .returning()
            .then((result) => result[0] as Analysis);

        await tx.update(uploadTable)
            .set({ analysisId: savedAnalysis.id as string })
            .where(eq(uploadTable.id, uploadId));

        return savedAnalysis;
    });
}

export {
    insertUpload,
    fetchUpload,
    insertAnalysis,
};