import { insertUpload } from '@/db/queries';
import { InsertUpload } from '@/db/schema';


async function saveUpload(imageBase64: string) {
    return insertUpload({ image: imageBase64 } as InsertUpload)
        .then(id => {
            // TODO: Call function to analyze the image asynchronously.
            return id;
        });
}

export {
    saveUpload,
};