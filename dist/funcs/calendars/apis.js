"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvents = exports.getEvents = exports.updateCalendar = exports.insertCalendar = void 0;
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
const getEvents = async (json) => {
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
        }
        else {
            return '指定された期間に予定はありません。';
        }
    }
    catch (err) {
        console.error('APIからエラーが返されました: ', err);
        return '取得できませんでした。開発者にお問い合わせください。';
    }
};
exports.getEvents = getEvents;
const deleteEvents = async (json) => {
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
        if (!events || events.length === 0) {
            return '指定された期間に予定はありません。';
        }
        let deletedEventsMessage = '削除された予定:\n';
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
    }
    catch (error) {
        console.error(`イベントの削除中にエラーが発生しました: ${error}`);
        return 'イベントの削除中にエラーが発生しました。';
    }
};
exports.deleteEvents = deleteEvents;
const formatEvents = (events) => {
    if (!events.length) {
        return '本日の予定は特にありません。';
    }
    const eventsByDate = events.reduce((acc, event) => {
        const eventStartDate = event.start?.dateTime || event.start?.date;
        if (!eventStartDate) {
            return acc;
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
        events.forEach((event) => {
            const title = event.summary || 'タイトルなし';
            const location = event.location || '-';
            if (event.start?.dateTime && event.end?.dateTime) {
                const start = new Date(event.start.dateTime);
                const end = new Date(event.end.dateTime);
                const startTime = formatTime(start);
                const endTime = formatTime(end);
                message += `▼${startTime} - ${endTime}\n${title}\n場所: ${location}\n\n`;
            }
            else {
                message += `・終日: ${title}\n場所: ${location}\n\n`;
            }
        });
    });
    message += '以上です。\nよい一日をお過ごしください✨';
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
        console.error('APIからエラーが返されました: ', err);
        return '取得できませんでした。開発者にお問い合わせください。';
    }
};
const formatTime = (date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
