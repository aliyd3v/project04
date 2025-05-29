import dotenv from 'dotenv'
dotenv.config()

// Production
export const production = process.env.PRODUCTION

// PORT
export const port = process.env.PORT

// DOMAIN
export const domain = process.env.DOMAIN

// Postgresql config
export const postgresConfig = {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

// Serverless database URL
export const databaseUrl = process.env.DATABASE_URL

// JWT config
export const jwtKey = process.env.JWT_KEY
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN

// Salt for crypto
export const salt = process.env.SALT

// Supabase config
export const S3CLIENT_REGION = process.env.S3CLIENT_REGION
export const S3CLIENT_ENDPOINT = process.env.S3CLIENT_ENDPOINT
export const S3CLIENT_ACCESS_KEY_ID = process.env.S3CLIENT_ACCESS_KEY_ID
export const S3CLIENT_SECRET_ACCESS_KEY = process.env.S3CLIENT_SECRET_ACCESS_KEY
export const S3CLIENT_BUCKET_NAME = process.env.S3CLIENT_BUCKET_NAME
export const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID