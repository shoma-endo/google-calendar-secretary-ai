"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenaiMessage = void 0;
const openai_client_1 = require("~/clients/openai.client");
const googleapis_1 = require("googleapis");
const calendars_1 = require("../calendars");
const getOpenaiMessage = async (text) => {
    if (text.includes('登録')) {
        return await registrationJsonGeneration(text);
    }
    else if (text.includes('更新')) {
    }
    else if (text.includes('取得')) {
        return await fetchGoogleCalendarEvents();
    }
    else if (text.includes('削除')) {
        if (text.trim() === '削除') {
            return await fetchGoogleCalendarEventsForDeletion();
        }
        else {
            const eventNumber = parseInt(text.replace('削除', ''));
            if (isNaN(eventNumber)) {
                return '有効なイベント番号を入力してください。';
            }
            return await deleteEventByNumber(eventNumber);
        }
    }
    return 'もう一度文章送って';
};
exports.getOpenaiMessage = getOpenaiMessage;
const registrationJsonGeneration = async (text) => {
    const completion = await openai_client_1.openai.chat.completions.create({
        messages: [
            { "role": "system", "content": 'Assistant to create Google calendar api registration request parameters. Please create them based on the instructions from the user. If there are any missing instructions, please tell us each time in Japanese only.' },
            { "role": "user", "content": 'Please create a request parameter for calendar registration according to the following request.' + text },
            { "role": "user", "content": 'If start time, end time, or title is missing, please tell us which one is missing in Japanese only. If all are met, please return only the json parameter. Time zone should be Japan time.' }
        ],
        model: "gpt-4",
    });
    return completion.choices[0].message.content;
};
const calendar = googleapis_1.google.calendar({ version: 'v3', auth: calendars_1.oauth2Client });
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
        return null;
    }
};
let eventMap = new Map();
const fetchGoogleCalendarEventsForDeletion = async () => {
    const now = new Date();
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
        return 'イベントが削除されました。';
    }
    catch (error) {
        console.error(`イベントの削除中にエラーが発生しました: ${error}`);
        return 'イベントの削除中にエラーが発生しました。';
    }
};
const formatEvents = (events) => {
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
        }
        else {
            message += `・終日: ${title}\n場所: ${location}\n`;
        }
        if (index < events.length - 1) {
            message += '------------------\n';
        }
    });
    message += '以上です。よい一日をお過ごしください✨';
    return message;
};
