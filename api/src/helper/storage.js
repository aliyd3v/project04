import { createReadStream } from 'fs'
import { S3Client, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import mime from 'mime-types'
import {
    S3CLIENT_REGION,
    S3CLIENT_ENDPOINT,
    S3CLIENT_ACCESS_KEY_ID,
    S3CLIENT_SECRET_ACCESS_KEY,
    S3CLIENT_BUCKET_NAME,
    SUPABASE_PROJECT_ID
} from '../config/config.js'

// S3CLIENT SETUP.
const s3Client = new S3Client({
    forcePathStyle: true,
    region: S3CLIENT_REGION,
    endpoint: S3CLIENT_ENDPOINT,
    credentials: {
        accessKeyId: S3CLIENT_ACCESS_KEY_ID,
        secretAccessKey: S3CLIENT_SECRET_ACCESS_KEY
    }
})

// CHECK BUCKET IN AWS FOR EXISTENCE.
const checkBucket = async () => {
    // GET HEAD BUCKET.
    const bucket = await s3Client.send(new HeadBucketCommand({ Bucket: S3CLIENT_BUCKET_NAME }))
    if (bucket['$metadata'].httpStatusCode !== 200)
        // IF BUCKET NO EXISTS.
        // CREATE NEW BUCKET.
        await s3Client.send(new CreateBucketCommand({ ACL: 'public-read', Bucket: S3CLIENT_BUCKET_NAME }))
}

const storage = {
    upload: async (fileName, filePath) => {
        try {
            const contentType = mime.lookup(fileName)
            // Checking bucket.
            await checkBucket()

            // Uploading.
            const file = createReadStream(filePath)
            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: S3CLIENT_BUCKET_NAME,
                    Key: fileName,
                    ContentType: contentType,
                    Body: file,
                },
                queueSize: 4,
                partSize: 5 * 1024 * 1024,
                leavePartsOnError: false
            })
            const uploaded = await upload.done()
            return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${S3CLIENT_BUCKET_NAME}/${uploaded.Key}`
        } catch (error) {
            throw error
        }
    },
    delete: async fileName => {
        try {
            const command = new DeleteObjectCommand({
                Bucket: S3CLIENT_BUCKET_NAME,
                Key: fileName
            })
            await s3Client.send(command)
        } catch (error) {
            console.error(error)
        }
    }
}

export default storage