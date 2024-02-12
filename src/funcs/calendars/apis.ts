import { calendar_v3,google } from 'googleapis';

import { oauth2Client } from '../calendars';

/** 
 * GoogleカレンダーAPIのバージョンv3を使用
 * 認証にはoauth2Clientを使用してカレンダー情報を初期化
 **/
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Googleカレンダー登録処理
 **/
export const insertCalendar = async (event: string): Promise<string> => {
  const result = await calendar.events.insert({ 
    calendarId: 'primary',
    requestBody: event as calendar_v3.Schema$Event
  })
	return result.status === 200 ? returnMessage.registrationSuccess : returnMessage.registrationFailure
};

/**
 * Googleカレンダー更新処理
 **/
export const updateCalendar = async (text: string, json: string): Promise<string> => {
  const event = await getGoogleCalendarEvent(text);
  if (typeof event === 'string' ) return event;
  const result = await calendar.events.update({ 
    calendarId: 'primary',
    eventId: event[0].id as string,
    requestBody: json as calendar_v3.Schema$Event
  })
	return result.status === 200 ? returnMessage.updateSuccess : returnMessage.updateFailure
};

const returnMessage = {
  'registrationSuccess': 'カレンダー登録に成功しました！',
  'registrationFailure': 'カレンダー登録に失敗しました',
  'updateSuccess': 'カレンダー更新に成功しました！',
  'updateFailure': 'カレンダー更新に失敗しました'
} as const

/**
 * Googleカレンダーから指定された期間のイベントを取得
 **/
export const getEvents = async (json: string): Promise<string> => {
  const { timeMin, timeMax } = JSON.parse(json);
  
  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (events?.length) {
      return formatEvents(events);
    } else {
      return '指定された期間に予定はありません。';
    }
  } catch (err) {
    console.error('APIからエラーが返されました: ', err);
    return '取得できませんでした。開発者にお問い合わせください。';
  }
};

const eventMap = new Map(); // イベント一覧
const now = new Date(); // 現在の日付

// 「削除」というメッセージの場合は、イベント一覧を表示
export const fetchGoogleCalendarEventsForDeletion = async (): Promise<string> => {
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
    eventMap.clear();
		let message = '本日の予定はこちらです。\n';
		events.forEach((event, index) => {
			// イベントの番号とIDをマップに保存
			eventMap.set(index + 1, event.id);
			message += `${index + 1}: ${event.summary}\n`;
		});
		message += '削除したい予定は、「削除1」のように指示してください。';
    return message;
	} catch (error) {
    console.error(`イベントの取得中にエラーが発生しました: ${error}`);
    return 'イベントの取得中にエラーが発生しました。';
  }
};

// 「削除[イベント番号]」の場合は、指定されたイベントを削除
export const deleteEventByNumber = async (eventNumber: number): Promise<string> => {
  const eventId = eventMap.get(eventNumber);
  if (!eventId) {
    return '無効なイベント番号です。';
  }
  
  // イベント削除処理
  try {
    // Google カレンダーAPIを使用してイベントを削除
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    // 削除後のイベント一覧を取得
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = res.data.items;
    if (!events || events.length === 0) {
      return '削除されました。本日の予定はありません。';
    }
    
    // イベント一覧をフォーマットして返す
    eventMap.clear();
    let message = '削除されました。\n本日の予定はこちらです。\n';
    events.forEach((event, index) => {
      // イベントの番号とIDをマップに保存
      eventMap.set(index + 1, event.id);
      message += `${index + 1}: ${event.summary}\n`;
    });
    message += '他に削除したい予定があれば、「削除1」のように指示してください。';
    return message;
  } catch (error) {
    console.error(`イベントの削除中にエラーが発生しました: ${error}`);
    return 'イベントの削除中にエラーが発生しました。';
  }
};

/**
 * Googleカレンダーから取得したイベントのフォーマッター
 **/
const formatEvents = (events: Array<calendar_v3.Schema$Event>): string => {
  if (!events.length) {
    return '本日の予定は特にありません。';
  }
  const eventDate = events[0].start?.dateTime ? new Date(events[0].start.dateTime) : new Date();
  let message = `${eventDate.getFullYear()}年${eventDate.getMonth() + 1}月${eventDate.getDate()}日のご予定をお知らせします！\n------------------\n`;
  events.forEach((event) => {
    const title = event.summary;
    const location = event.location || '-';

    if (event.start?.dateTime && event.end?.dateTime) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      const startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
      const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

      message += `・${startTime}から${endTime}:\n${title}\n場所: ${location}\n`;
    } else {
      message += `・終日: ${title}\n場所: ${location}\n`;
    }

    // イベント間に区切り線を追加
    message += '------------------\n';
  });

  message += '以上です。よい一日をお過ごしください✨';
  return message;
};

/**
 * Googleカレンダーから
 * 入力された日付のイベントを取得
 * 2024年2月23日 18〜21時の予定を2024年2月15日 18〜23時に更新してください
 **/
const getGoogleCalendarEvent = async (text: string): Promise<calendar_v3.Schema$Event[] | string> => {
  const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2})〜(\d{1,2})時/;
  const matches = text.match(regex);

  try {
    if (matches) {
      const [date, year, month, day, startHour, endHour] = matches;
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin:  (new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(startHour))).toISOString(),
        timeMax: (new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(endHour))).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = res.data.items;
      if (events?.length) {
        return events;
      } else {
        return `${date}の予定はありません。`;
      }
    }
    return '西暦から日付を入力してください。';
  } catch (err) {
    console.error('APIからエラーが返されました: ', err);
    return '取得できませんでした。開発者にお問い合わせください。';
  }
};
