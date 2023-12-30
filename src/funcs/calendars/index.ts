import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SECRET, APP_URL } from '../../utils/secrets'
export const userTokens: { [userId: string]: any } = {}; // TODO: トークンの有効期限を追加したい

const oauth2Client = new OAuth2Client(
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

  // TODO: キー修正
  const userId = 'some-unique-user-id';
  userTokens[userId] = tokens;
  console.log(tokens);
}

export { oauth2Client, authUrl, saveUserTokens };