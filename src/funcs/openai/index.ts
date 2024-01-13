import { openai } from '~/clients/openai.client'
import { google } from 'googleapis';
import { oauth2Client } from '../calendars';

export const getOpenaiMessage = async (text: string): Promise<string | null> => {
  if (text.includes('登録')) {
    return await registrationJsonGeneration(text);
  }
  else if (text.includes('更新')) {
    // 更新処理関数
  }
  else if (text.includes('取得')) {
    return await fetchGoogleCalendarEvents();
  }
  else if (text.includes('削除')) {
    // 「削除」というメッセージの場合は、イベント一覧を表示
    if (text.trim() === '削除') {
      return await fetchGoogleCalendarEventsForDeletion();
    } 
    // 「削除 [イベントID]」の場合は、指定されたイベントを削除
    else {
      const eventId = text.split(' ')[1];
      try {
        return await deleteEventById(eventId);
      } catch (error) {
        console.error(`イベントの削除中にエラーが発生しました: ${error}`);
        return 'イベントの削除中にエラーが発生しました。';
      }
    }
  }
  return 'もう一度文章送って';
}

const registrationJsonGeneration = async (text: string): Promise<string | null> => {
	const completion = await openai.chat.completions.create({
    messages: [
			{"role": "system", "content": 'Assistant to create Google calendar api registration request parameters. Please create them based on the instructions from the user. If there are any missing instructions, please tell us each time in Japanese only.'},
      {"role": "user", "content": 'Please create a request parameter for calendar registration according to the following request.' + text },
			{"role": "user", "content": 'If start time, end time, or title is missing, please tell us which one is missing in Japanese only. If all are met, please return only the json parameter. Time zone should be Japan time.'}
		],
    model: "gpt-4",
  });
  return completion.choices[0].message.content;
}

/** 
 * GoogleカレンダーAPIのバージョンv3を使用
 * 認証にはoauth2Clientを使用してカレンダーを初期化します。
 **/
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });


/**
 * Googleカレンダーからイベントを取得する関数
 * 現在の日時から翌日の0時までのイベントを取得
 **/
const fetchGoogleCalendarEvents = async (): Promise<string | null> => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: tomorrow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (events?.length) {
      return formatEvents(events);
    } else {
      return '本日の予定はありません。';
    }
  } catch (err) {
    console.error('APIからエラーが返されました: ' + err);
    return null;
  }
};

const fetchGoogleCalendarEventsForDeletion = async (): Promise<string | null> => {
  // 現在の日付を取得
  const now = new Date();

  try {
    // Google Calendar APIを呼び出してイベント一覧を取得
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      return '本日の予定はありません。';
    }

    // イベント一覧をフォーマットして返す
    return events.map((event, index) => `${index + 1}: ${event.id} - ${event.summary}`).join('\n');
  } catch (error) {
    console.error(`APIからエラーが返されました: ${error}`);
    return 'イベント取得中にエラーが発生しました。';
  }
};

// イベント削除メソッド
const deleteEventById = async (eventId: string): Promise<string | null> => {
  try {
    // Google カレンダーAPIを使用してイベントを削除
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    return 'イベントが削除されました。';
  } catch (error) {
    console.error(`イベントの削除中にエラーが発生しました: ${error}`);
    return 'イベントの削除中にエラーが発生しました。';
  }
};




// Googleカレンダーから取得したイベントのフォーマッター
const formatEvents = (events: any[]): string => {
  if (!events.length) {
    return '本日の予定は特にありません。';
  }

  let message = '本日のご予定をお知らせします！\n------------------\n';
  events.forEach((event, index) => {
    const title = event.summary;
    const location = event.location || '-';

    if ('dateTime' in event.start) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      const startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

      console.log(`イベント開始時間: ${startTime}`);
      console.log(`イベント終了時間: ${endTime}`);

      message += `・${startTime}から${endTime}:\n${title}\n場所: ${location}\n`;
    } else {
      message += `・終日: ${title}\n場所: ${location}\n`;
    }

    // イベント間に区切り線を追加
    if (index < events.length - 1) {
      message += '------------------\n';
    }
  });

  message += '以上です。よい一日をお過ごしください✨';
  return message;
};