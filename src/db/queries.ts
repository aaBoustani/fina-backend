import { InsertUpload, uploadTable } from './schema';
import { db } from './index';


function insertUpload(upload: InsertUpload) {
    return db.insert(uploadTable).values([upload]).returning({ id: uploadTable.id });
}

export {
    insertUpload,
}