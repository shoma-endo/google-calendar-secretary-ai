import { google, calendar_v3 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
    keyFile: "service-account-key.json",
    scopes: "https://www.googleapis.com/auth/calendar"
});

async function getAccessToken() {
    try {
        const client = await auth.getClient() as any; // TODO 変更
        const accessToken = await client.getAccessToken();

        const calendar = google.calendar({ version: 'v3', auth: client });
        // イベントを取得する期間を設定
        const start = '2023-12-20T00:00:00.000Z'; // 開始日時（ISOフォーマット）
        const end = '2023-12-31T23:59:59.999Z';   // 終了日時（ISOフォーマット）
    
        // イベントのリストを取得
        const response = await calendar.events.list({
          calendarId: 'primary',
          timeMin: start,
          timeMax: end,
          singleEvents: true,
          orderBy: 'startTime',
        });

        calendar.calendarList.list({}, (err, res) => {
            // calendars配列をループして、各カレンダー情報を出力
            const calendars = res!.data.items;
            console.log(calendars)
          });
        const calendarEntry = response.data;
        // 取得したカレンダー情報を出力
        console.log(JSON.stringify(calendarEntry, null, 2));
    
        const events = response.data.items;
        if (!events || events.length === 0) {
          console.log('No upcoming events found.');
          return;
        }
        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

export { getAccessToken };