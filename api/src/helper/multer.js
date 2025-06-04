import multer from 'multer'
import AppError from '../utils/appError.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (!fs.existsSync(path.join(__dirname, 'tmp'))) fs.mkdirSync(path.join(__dirname, 'tmp'))

const storage = multer.diskStorage({
    destination: 'tmp/',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.floor(Math.random() * 1000000) + path.extname(file.originalname).toLowerCase())
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/jpeg" || file.mimetype == "image/png" ||
            file.mimetype == "image/svg" || file.mimetype == "image/avif" ||
            file.mimetype == "image/webp" || file.mimetype == "image/bmp" ||
            file.mimetype == "image/ico" || file.mimetype == "image/gif"
        )
            cb(null, true)
        else
            cb(new AppError(
                400,
                'fail',
                'Invalid upload: fieldname should be image and format should be image format!'
            ),
                false
            )
    },
    limits: { fileSize: 8 * 1024 * 1024 }
})

export default upload