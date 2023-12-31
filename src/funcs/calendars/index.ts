import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

import { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SECRET, APP_URL } from '../../utils/secrets'

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
});

export const saveUserTokens = async (code: string) : Promise<void> => {
  const response = await oauth2Client.getToken(code);
  const tokens: Credentials = response.tokens;
  userTokens = tokens;
  console.log(userTokens);
}

export const deleteUserTokens = (): void => {
  userTokens = {};
}