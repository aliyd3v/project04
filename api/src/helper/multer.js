import multer from 'multer'
import AppError from '../utils/appError.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(path.resolve(__dirname, 'tmp'))) {
            fs.mkdirSync(path.resolve(__dirname, 'tmp'))
        }
        cb(null, path.resolve(__dirname, 'tmp'));
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/jpeg" || file.mimetype == "image/png" ||
            file.mimetype == "image/svg" || file.mimetype == "image/avif" ||
            file.mimetype == "image/webp" || file.mimetype == "image/bmp" ||
            file.mimetype == "image/ico" || file.mimetype == "image/gif"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(
                new AppError(
                    400,
                    'fail',
                    'Invalid upload: fieldname should be image and format should be image format!'
                )
            );
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.floor(Math.random() * 1000000) + '.' + file.mimetype.split('/')[1])
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }
})

export default upload