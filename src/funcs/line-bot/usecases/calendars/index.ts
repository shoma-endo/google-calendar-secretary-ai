import { google } from 'googleapis';

const client_id = "YOUR_CLIENT_ID";  // 実際のクライアントIDに置き換えてください
const client_secret = "YOUR_CLIENT_SECRET";  // 実際のクライアントシークレットに置き換えてください
const redirect_uris = "http://localhost:3000/callback";  // 適切なリダイレクトURIに置き換えてください

const oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uris);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar.readonly', // 必要なスコープを指定
});

const calendar = google.calendar({version: 'v3', auth: oauth2Client});


const calendarId = "primary";
const authCode = "";