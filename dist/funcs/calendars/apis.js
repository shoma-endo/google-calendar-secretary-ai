"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventByNumber = exports.fetchGoogleCalendarEventsForDeletion = exports.fetchGoogleCalendarEvents = exports.updateCalendar = exports.insertCalendar = void 0;
const googleapis_1 = require("googleapis");
const calendars_1 = require("../calendars");
const calendar = googleapis_1.google.calendar({ version: 'v3', auth: calendars_1.oauth2Client });
const insertCalendar = async (event) => {
    const result = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
    });
    return result.status === 200 ? returnMessage.registrationSuccess : returnMessage.registrationFailure;
};
exports.insertCalendar = insertCalendar;
const updateCalendar = async (text, json) => {
    const event = await getGoogleCalendarEvent(text);
    if (typeof event === 'string')
        return event;
    const result = await calendar.events.update({
        calendarId: 'primary',
        eventId: event[0].id,
        requestBody: json
    });
    return result.status === 200 ? returnMessage.updateSuccess : returnMessage.updateFailure;
};
exports.updateCalendar = updateCalendar;
const returnMessage = {
    'registrationSuccess': 'カレンダー登録に成功しました！',
    'registrationFailure': 'カレンダー登録に失敗しました',
    'updateSuccess': 'カレンダー更新に成功しました！',
    'updateFailure': 'カレンダー更新に失敗しました'
};
const fetchGoogleCalendarEvents = async () => {
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
        }
        else {
            return '本日の予定はありません。';
        }
    }
    catch (err) {
        console.error('APIからエラーが返されました: ' + err);
        return '取得できませんでした。開発者にお問い合わせください。';
    }
};
exports.fetchGoogleCalendarEvents = fetchGoogleCalendarEvents;
const eventMap = new Map();
const now = new Date();
const fetchGoogleCalendarEventsForDeletion = async () => {
    try {
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
        eventMap.clear();
        let message = '本日の予定はこちらです。\n';
        events.forEach((event, index) => {
            eventMap.set(index + 1, event.id);
            message += `${index + 1}: ${event.summary}\n`;
        });
        message += '削除したい予定は、「削除1」のように指示してください。';
        return message;
    }
    catch (error) {
        console.error(`イベントの取得中にエラーが発生しました: ${error}`);
        return 'イベントの取得中にエラーが発生しました。';
    }
};
exports.fetchGoogleCalendarEventsForDeletion = fetchGoogleCalendarEventsForDeletion;
const deleteEventByNumber = async (eventNumber) => {
    const eventId = eventMap.get(eventNumber);
    if (!eventId) {
        return '無効なイベント番号です。';
    }
    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
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
        eventMap.clear();
        let message = '削除されました。\n本日の予定はこちらです。\n';
        events.forEach((event, index) => {
            eventMap.set(index + 1, event.id);
            message += `${index + 1}: ${event.summary}\n`;
        });
        message += '他に削除したい予定があれば、「削除1」のように指示してください。';
        return message;
    }
    catch (error) {
        console.error(`イベントの削除中にエラーが発生しました: ${error}`);
        return 'イベントの削除中にエラーが発生しました。';
    }
};
exports.deleteEventByNumber = deleteEventByNumber;
const formatEvents = (events) => {
    if (!events.length) {
        return '本日の予定は特にありません。';
    }
    let message = '本日のご予定をお知らせします！\n------------------\n';
    events.forEach((event, index) => {
        const title = event.summary;
        const location = event.location || '-';
        if (event.start?.dateTime && event.end?.dateTime) {
            const start = new Date(event.start.dateTime);
            const end = new Date(event.end.dateTime);
            const startTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
            const endTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
            console.log(`イベント開始時間: ${startTime}`);
            console.log(`イベント終了時間: ${endTime}`);
            message += `・${startTime}から${endTime}:\n${title}\n場所: ${location}\n`;
        }
        else {
            message += `・終日: ${title}\n場所: ${location}\n`;
        }
        message += '------------------\n';
    });
    message += '以上です。よい一日をお過ごしください✨';
    return message;
};
const getGoogleCalendarEvent = async (text) => {
    const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2})〜(\d{1,2})時/;
    const matches = text.match(regex);
    try {
        if (matches) {
            const [date, year, month, day, startHour, endHour] = matches;
            const res = await calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(startHour))).toISOString(),
                timeMax: (new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(endHour))).toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            const events = res.data.items;
            if (events?.length) {
                return events;
            }
            else {
                return `${date}の予定はありません。`;
            }
        }
        return '西暦から日付を入力してください。';
    }
    catch (err) {
        console.error('APIからエラーが返されました: ' + err);
        return '取得できませんでした。開発者にお問い合わせください。';
    }
};
