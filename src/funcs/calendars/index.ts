import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';

import { APP_URL,GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SECRET } from '../../utils/secrets'

export let userTokens: Credentials = {};

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_SECRET,
  APP_URL + "/callback"
);

export const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/calendar', // 必要なスコープを指定
}) + "&openExternalBrowser=1";

export const saveUserTokens = async (code: string) : Promise<void> => {
  const response = await oauth2Client.getToken(code);
  const tokens: Credentials = response.tokens;
  userTokens = tokens;
  oauth2Client.setCredentials(tokens); // ここでトークンを設定
  console.log(userTokens); // eslint-disable-line no-console
}

export const deleteUserTokens = (): void => {
  userTokens = {};
}