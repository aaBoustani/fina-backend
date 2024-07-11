import multer from 'multer';
import path from 'path';


const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        return (mimetype && extname)
            ? cb(null, true)
            : cb(new Error('Only images are allowed'));
    }
});

export default upload;