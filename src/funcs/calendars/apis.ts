import { calendar_v3,google } from 'googleapis';
import moment from 'moment-timezone'; // moment-timezoneパッケージを追加

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
 * Googleカレンダーのイベント取得
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
    console.log('取得したイベント:', events);
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

// 指定された期間のイベント削除
export const deleteEvents = async (json: string): Promise<string> => {
  const { timeMin, timeMax } = JSON.parse(json);

  try {
    // 指定された期間のイベントを取得
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      return '指定された期間に予定はありません。';
    }

    let deletedEventsMessage = '削除された予定:\n';
    // 取得したイベントを削除
    for (const event of events) {
      if (event.id) {
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: event.id,
        });

        const eventStart = event.start?.dateTime ? new Date(event.start.dateTime) : null;
        const eventEnd = event.end?.dateTime ? new Date(event.end.dateTime) : null;
        const startTime = eventStart ? formatTime(eventStart) : '未設定';
        const endTime = eventEnd ? formatTime(eventEnd) : '未設定';
        deletedEventsMessage += `▼${startTime} - ${endTime}:\n${event.summary}\n場所: ${event.location || '-'}\n`;
      }
    }

    return `${events.length}件の予定を削除しました。\n${deletedEventsMessage}`;
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

  // イベントを日付ごとに分類
  const eventsByDate = events.reduce((acc: Record<string, calendar_v3.Schema$Event[]>, event) => {
    const eventStartDate = event.start?.dateTime || event.start?.date;
    if (!eventStartDate) {
      return acc; // イベント開始日がない場合は、アキュムレータをそのまま返す
    }
    const eventDate = new Date(eventStartDate);
    const dateKey = `${eventDate.getFullYear()}年${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  let message = '';
  Object.entries(eventsByDate).forEach(([date, events]) => {
    message += `【${date}のご予定】\n━━━━━━━━━━━━━\n`;
    events.forEach((event: calendar_v3.Schema$Event) => {
      const title = event.summary || 'タイトルなし';
      const location = event.location || '-';

      if (event.start?.dateTime && event.end?.dateTime) {
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        const startTime = formatTime(start);
        const endTime = formatTime(end);

        message += `▼${startTime} - ${endTime}\n${title}\n場所: ${location}\n\n`;
      } else {
        message += `・終日: ${title}\n場所: ${location}\n\n`;
      }
    });
  });

  message += '以上です。\nよい一日をお過ごしください✨';
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

const formatTime = (date: Date): string => {
  return moment(date).tz('Asia/Tokyo').format('HH:mm');
};
