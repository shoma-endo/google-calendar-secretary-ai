import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SECRET, APP_URL } from '../../utils/secrets'

let userTokens: Credentials = {};

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

async function saveUserTokens(code: string) {
  const response = await oauth2Client.getToken(code);
  const tokens: Credentials = response.tokens;
  userTokens = tokens;
  console.log(userTokens);
}

function deleteUserTokens() {
  userTokens = {};
}



export { userTokens, oauth2Client, authUrl, saveUserTokens, deleteUserTokens };