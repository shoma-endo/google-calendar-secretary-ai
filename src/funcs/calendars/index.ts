import { google } from 'googleapis';
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SECRET, APP_URL } from '../../utils/secrets'

let userTokens: { [key: string]: any } = {}; // TODO: トークンの有効期限を追加したい

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_SECRET,
    APP_URL + "/callback"
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/calendar', // 必要なスコープを指定
});

async function saveUserTokens(req: any) {
  const code = req.query.code as string;
  const { tokens } = await oauth2Client.getToken(code);

  userTokens = tokens;
  console.log(tokens);
}

async function deleteUserTokens(req: any) {
  userTokens = {};
}

export { userTokens, oauth2Client, authUrl, saveUserTokens, deleteUserTokens };