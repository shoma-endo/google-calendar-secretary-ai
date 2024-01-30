import { Credentials } from 'google-auth-library';
import { google } from 'googleapis';

import { APP_URL,GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_SECRET } from '../../utils/secrets'

import { lineClient } from '~/clients/line.client'
import { msgExample } from '~lineBot/notice-messages/oauth'

export let userTokens: Credentials = {};

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_SECRET,
  APP_URL + "/callback"
);

export const generateAuthUrl = (userId: string) : string => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar', // 必要なスコープを指定
    state: userId
  }) + "&openExternalBrowser=1";
}

export const saveUserTokens = async (code: string) : Promise<void> => {
  const response = await oauth2Client.getToken(code);
  userTokens = response.tokens;
  oauth2Client.setCredentials(userTokens); // ここでトークンを設定
  console.log(userTokens); // eslint-disable-line no-console
}

export const updateAccessToken = async () : Promise<void> => {
  try {
    // リフレッシュトークンを基にアクセストークンを再度生成する
    const { credentials } = await oauth2Client.refreshAccessToken();
    userTokens = credentials
    console.log(userTokens); // eslint-disable-line no-console
  } catch {
    // リフレッシュトークンがない、または期限切れの場合はトークン情報削除
    deleteUserTokens();
  }
}

const deleteUserTokens = (): void => {
  userTokens = {};
  oauth2Client.setCredentials({});
}

export const sendGoogleMessage = async (userId: string): Promise<void> => {
  await lineClient.pushMessage(userId, msgExample);
}