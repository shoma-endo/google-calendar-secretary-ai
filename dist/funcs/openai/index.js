"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenaiMessage = void 0;
const openai_client_1 = require("~/clients/openai.client");
const apis_1 = require("../calendars/apis");
const apis_2 = require("../calendars/apis");
const apis_3 = require("../calendars/apis");
const getOpenaiMessage = async (text) => {
    if (text.includes('登録')) {
        const registrationJson = await calendarJsonGeneration(text);
        if (registrationJson === null) {
            throw new Error('openaiResponse is null');
        }
        return await (0, apis_1.insertCalendar)(registrationJson);
    }
    else if (text.includes('更新')) {
        const updateJson = await calendarJsonGeneration(text);
        if (updateJson === null) {
            throw new Error('openaiResponse is null');
        }
        return await (0, apis_1.updateCalendar)(text, updateJson);
    }
    else if (text.includes('取得')) {
        const registrationJson = await fetchGoogleCalendarEventsGeneration(text);
        if (registrationJson === null) {
            throw new Error('openaiResponse is null');
        }
    }
    else if (text.includes('削除')) {
        if (text.trim() === '削除') {
            return await (0, apis_2.fetchGoogleCalendarEventsForDeletion)();
        }
        else {
            const eventNumber = parseInt(text.replace('削除', ''));
            if (isNaN(eventNumber)) {
                return '有効なイベント番号を入力してください。';
            }
            return await (0, apis_3.deleteEventByNumber)(eventNumber);
        }
    }
    return 'もう一度文章送って';
};
exports.getOpenaiMessage = getOpenaiMessage;
const calendarJsonGeneration = async (text) => {
    const completion = await openai_client_1.openai.chat.completions.create({
        messages: [
            { "role": "system", "content": 'You are the text formatting assistant. Parses the Google Calendar event API request parameters in JSON format for the string provided by the user. The timeZone of the JSON key should be Asia/Tokyo.' },
            { "role": "user", "content": text },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: { "type": "json_object" }
    });
    return completion.choices[0].message.content;
};
const fetchGoogleCalendarEventsGeneration = async (text) => {
    const systemMessage = 'You are the text analysis assistant. Based on the string provided by the user, parse the Google Calendar event API request parameters in JSON format. Parse the date from the given string and generate the Google Calendar API fetch request parameters for that date. Interpret "tomorrow" as the day after today, "next Monday" as the upcoming Monday, and specific dates like "February 22nd" as future dates from today. Always assume the date is in the future relative to today, and the timeZone should be `Asia/Tokyo`. Based on the provided date, set the timeMin and timeMax parameters in ISO 8601 format to fetch events for the specific date through the Google Calendar API.';
    const completion = await openai_client_1.openai.chat.completions.create({
        messages: [
            { "role": "system", "content": systemMessage },
            { "role": "user", "content": text },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: { "type": "json_object" }
    });
    return completion.choices[0].message.content;
};
