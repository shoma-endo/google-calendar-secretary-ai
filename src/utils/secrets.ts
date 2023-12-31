import 'dotenv/config'

export const APP_URL = process.env.APP_URL as string

// LINE

export const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN as string
export const LINE_SECRET = process.env.LINE_SECRET as string

// OpenAI

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string

// Google Auth

export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID as string
export const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET as string
